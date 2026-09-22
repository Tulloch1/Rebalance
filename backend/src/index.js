/**
 * Portfolio Rebalancer - Cloudflare Workers Edge API
 * Zero-Knowledge Vault Synchronization & User Persistence
 */

function getCorsHeaders(request) {
    const origin = (request && request.headers && request.headers.get("Origin")) || "*";
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400"
    };
}

function jsonResponse(data, status = 200, request = null, extraHeaders = {}) {
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        ...getCorsHeaders(request),
        ...extraHeaders
    };
    return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(message, status = 400, request = null) {
    return jsonResponse({ error: message, success: false }, status, request);
}

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function normalizeAccountRow(row) {
    if (!row) return null;
    let vault = null;
    let recoveryEnvelope = null;
    let preferences = { currency: "USD", theme: "auto", autoSync: true };

    try {
        if (row.vault_ciphertext) vault = JSON.parse(row.vault_ciphertext);
    } catch (e) {
        vault = null;
    }

    try {
        if (row.recovery_envelope) recoveryEnvelope = JSON.parse(row.recovery_envelope);
    } catch (e) {
        recoveryEnvelope = null;
    }

    try {
        if (row.preferences) preferences = JSON.parse(row.preferences);
    } catch (e) {
        preferences = { currency: "USD", theme: "auto", autoSync: true };
    }

    return {
        email: row.email,
        authHash: row.auth_hash,
        schemaVersion: Number(row.schema_version) || 2,
        vaultVersion: Number(row.vault_version) || 1,
        vault: vault,
        recoveryEnvelope: recoveryEnvelope,
        tier: row.tier || "free",
        stripeCustomerId: row.stripe_customer_id || null,
        subscriptionStatus: row.subscription_status || "none",
        subscriptionExpiresAt: row.subscription_expires_at || null,
        preferences: preferences,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastLoginAt: row.last_login_at
    };
}

function generateOtpCode() {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const codeNum = (arr[0] % 900000) + 100000;
    return codeNum.toString();
}

function generateTokenId() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

async function getCustomerCardLast4(customerId, env) {
    if (!customerId) return null;
    if (env.STRIPE_MOCK_CARDS && env.STRIPE_MOCK_CARDS[customerId]) {
        return env.STRIPE_MOCK_CARDS[customerId];
    }
    if (env.TEST_MOCK_CARD_LAST4) {
        return env.TEST_MOCK_CARD_LAST4;
    }
    if (env.STRIPE_SECRET_KEY) {
        try {
            const resp = await fetch(`https://api.stripe.com/v1/payment_methods?customer=${encodeURIComponent(customerId)}&type=card`, {
                headers: {
                    "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`
                }
            });
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.data && data.data.length > 0 && data.data[0].card) {
                    return data.data[0].card.last4;
                }
            }
        } catch (e) {
            console.error("Stripe fetch error:", e);
        }
    }
    return null;
}

async function sendResetOtpEmail(email, code, env) {
    if (env.RESEND_API_KEY) {
        try {
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: env.EMAIL_FROM || "Portfolio Rebalancer <security@rebalanceportfolio.app>",
                    to: [email],
                    subject: "Your Clean Slate Reset Code",
                    html: `<p>Your single-use verification code is: <strong style="font-size: 22px; letter-spacing: 2px;">${code}</strong></p><p>This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>`
                })
            });
        } catch (err) {
            console.error("Failed to send email via Resend:", err);
        }
    }
    if (env.RECORD_SENT_EMAILS || !env.RESEND_API_KEY) {
        if (!env._sentEmails) env._sentEmails = [];
        env._sentEmails.push({ email, code, timestamp: new Date().toISOString() });
    }
}

async function sendResetConfirmationEmail(email, env) {
    if (env.RESEND_API_KEY) {
        try {
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: env.EMAIL_FROM || "Portfolio Rebalancer <security@rebalanceportfolio.app>",
                    to: [email],
                    subject: "Account Credentials Reset Confirmation",
                    html: `<p>Your account credentials have been successfully reset via verified billing authorization.</p><p>If you did not authorize this action, please contact security support immediately.</p>`
                })
            });
        } catch (err) {
            console.error("Failed to send confirmation email:", err);
        }
    }
    if (env.RECORD_SENT_EMAILS || !env.RESEND_API_KEY) {
        if (!env._sentConfirmations) env._sentConfirmations = [];
        env._sentConfirmations.push({ email, timestamp: new Date().toISOString() });
    }
}

export default {
    async fetch(request, env, ctx) {
        // 1. Handle CORS Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: getCorsHeaders(request)
            });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // Guard: Check body size limit (512 KB)
            const contentLength = request.headers.get("Content-Length");
            if (contentLength && parseInt(contentLength, 10) > 512 * 1024) {
                return errorResponse("Payload too large (max 512KB).", 413, request);
            }

            // Route: GET /api/health
            if (path === "/api/health" && request.method === "GET") {
                let d1Status = "unknown";
                try {
                    if (env.DB) {
                        const testRes = await env.DB.prepare("SELECT 1 AS ok").first();
                        if (testRes && testRes.ok === 1) d1Status = "connected";
                    }
                } catch (dbErr) {
                    d1Status = "error: " + dbErr.message;
                }
                return jsonResponse({
                    status: "ok",
                    service: "portfolio-rebalance-api",
                    version: "2.0.0",
                    d1: d1Status,
                    timestamp: new Date().toISOString()
                }, 200, request);
            }

            // Route: GET /api/account?email=...
            if (path === "/api/account" && request.method === "GET") {
                const emailParam = url.searchParams.get("email");
                if (!emailParam) {
                    return errorResponse("Missing email query parameter.", 400, request);
                }
                const email = emailParam.trim().toLowerCase();
                if (!isValidEmail(email)) {
                    return errorResponse("Invalid email address format.", 400, request);
                }

                const row = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                if (!row) {
                    return errorResponse("Account not found.", 404, request);
                }

                return jsonResponse(normalizeAccountRow(row), 200, request);
            }

            // Route: POST /api/account (Registration)
            if (path === "/api/account" && request.method === "POST") {
                let body = null;
                try {
                    body = await request.json();
                } catch (parseErr) {
                    return errorResponse("Invalid JSON in request body.", 400, request);
                }

                if (!body || typeof body !== 'object') {
                    return errorResponse("Request body must be a JSON object.", 400, request);
                }

                const email = body.email ? body.email.trim().toLowerCase() : "";
                const authHash = body.authHash ? body.authHash.trim() : "";

                if (!isValidEmail(email)) {
                    return errorResponse("A valid email address is required.", 400, request);
                }
                if (!authHash || typeof authHash !== 'string' || authHash.length < 32) {
                    return errorResponse("A valid authHash string is required.", 400, request);
                }

                // Check if account already exists
                const existing = await env.DB.prepare("SELECT email FROM accounts WHERE email = ?").bind(email).first();
                if (existing) {
                    return errorResponse("An account with this email already exists.", 409, request);
                }

                const now = new Date().toISOString();
                const vaultCiphertext = body.vault ? JSON.stringify(body.vault) : null;
                const recoveryEnvelope = body.recoveryEnvelope ? JSON.stringify(body.recoveryEnvelope) : null;
                const tier = body.tier || "free";
                const preferences = body.preferences ? JSON.stringify(body.preferences) : JSON.stringify({ currency: "USD", theme: "auto", autoSync: true });

                await env.DB.prepare(`
                    INSERT INTO accounts (
                        email, auth_hash, schema_version, vault_version,
                        vault_ciphertext, recovery_envelope, tier, stripe_customer_id,
                        subscription_status, subscription_expires_at, preferences,
                        created_at, updated_at, last_login_at
                    ) VALUES (?, ?, 2, 1, ?, ?, ?, NULL, 'none', NULL, ?, ?, ?, ?)
                `).bind(
                    email,
                    authHash,
                    vaultCiphertext,
                    recoveryEnvelope,
                    tier,
                    preferences,
                    now,
                    now,
                    now
                ).run();

                const created = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                return jsonResponse(normalizeAccountRow(created), 201, request);
            }

            // Route: PUT /api/vault (Vault Auto-Sync & Key Recovery Envelope Update)
            if (path === "/api/vault" && request.method === "PUT") {
                let body = null;
                try {
                    body = await request.json();
                } catch (e) {
                    return errorResponse("Invalid JSON in request body.", 400, request);
                }

                const email = body && body.email ? body.email.trim().toLowerCase() : "";
                if (!isValidEmail(email)) {
                    return errorResponse("A valid email is required.", 400, request);
                }

                const account = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                if (!account) {
                    return errorResponse("Account not found.", 404, request);
                }

                const now = new Date().toISOString();
                const vaultCiphertext = body.vault !== undefined ? JSON.stringify(body.vault) : account.vault_ciphertext;
                const recoveryEnvelope = body.recoveryEnvelope !== undefined ? JSON.stringify(body.recoveryEnvelope) : account.recovery_envelope;
                const targetVersion = (body.vaultVersion !== null && body.vaultVersion !== undefined)
                    ? Number(body.vaultVersion)
                    : (Number(account.vault_version) || 1) + 1;

                await env.DB.prepare(`
                    UPDATE accounts
                    SET vault_ciphertext = ?,
                        recovery_envelope = ?,
                        vault_version = ?,
                        updated_at = ?
                    WHERE email = ?
                `).bind(
                    vaultCiphertext,
                    recoveryEnvelope,
                    targetVersion,
                    now,
                    email
                ).run();

                const updated = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                return jsonResponse(normalizeAccountRow(updated), 200, request);
            }

            // Route: POST /api/recover (Account Recovery via Emergency Key)
            if (path === "/api/recover" && request.method === "POST") {
                let body = null;
                try {
                    body = await request.json();
                } catch (e) {
                    return errorResponse("Invalid JSON in request body.", 400, request);
                }

                const email = body && body.email ? body.email.trim().toLowerCase() : "";
                const newAuthHash = body && body.authHash ? body.authHash.trim() : "";
                if (!isValidEmail(email)) {
                    return errorResponse("A valid email is required.", 400, request);
                }
                if (!newAuthHash || newAuthHash.length < 32) {
                    return errorResponse("A valid authHash is required.", 400, request);
                }

                const account = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                if (!account) {
                    return errorResponse("Account not found.", 404, request);
                }
                if (!account.recovery_envelope) {
                    return errorResponse("No emergency recovery key configured for this account.", 400, request);
                }

                const now = new Date().toISOString();
                const newVaultCiphertext = body.vault ? JSON.stringify(body.vault) : account.vault_ciphertext;
                const nextVersion = (Number(account.vault_version) || 1) + 1;

                await env.DB.prepare(`
                    UPDATE accounts
                    SET auth_hash = ?,
                        vault_ciphertext = ?,
                        vault_version = ?,
                        updated_at = ?,
                        last_login_at = ?
                    WHERE email = ?
                `).bind(
                    newAuthHash,
                    newVaultCiphertext,
                    nextVersion,
                    now,
                    now,
                    email
                ).run();

                const updated = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                return jsonResponse(normalizeAccountRow(updated), 200, request);
            }

            // Route: POST /api/account/request-reset (Initiate Clean Slate OTP Reset)
            if (path === "/api/account/request-reset" && request.method === "POST") {
                let body = null;
                try {
                    body = await request.json();
                } catch (e) {
                    return errorResponse("Invalid JSON in request body.", 400, request);
                }

                const email = body && body.email ? body.email.trim().toLowerCase() : "";
                if (!isValidEmail(email)) {
                    return errorResponse("A valid email is required.", 400, request);
                }

                const account = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                if (!account) {
                    // Prevent account enumeration by returning success without dispatching email
                    return jsonResponse({ success: true, requiresBillingChallenge: false }, 200, request);
                }

                // Rate limiting: Max 3 requests per 1 hour (3600 seconds)
                const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
                const rateCheck = await env.DB.prepare(
                    "SELECT COUNT(*) AS req_count FROM password_reset_tokens WHERE email = ? AND created_at > ?"
                ).bind(email, oneHourAgo).first();

                if (rateCheck && Number(rateCheck.req_count) >= 3) {
                    return jsonResponse({
                        error: "Too many reset requests. You can only request 3 reset codes per hour. Please try again later.",
                        success: false
                    }, 429, request);
                }

                // Invalidate/supersede any existing active tokens for this email
                await env.DB.prepare(
                    "UPDATE password_reset_tokens SET status = 'superseded' WHERE email = ? AND status = 'active'"
                ).bind(email).run();

                const code = generateOtpCode();
                const tokenId = generateTokenId();
                const now = new Date();
                const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
                const nowIso = now.toISOString();

                await env.DB.prepare(`
                    INSERT INTO password_reset_tokens (
                        id, email, token_hash, code, failed_attempts, status, expires_at, created_at
                    ) VALUES (?, ?, ?, ?, 0, 'active', ?, ?)
                `).bind(tokenId, email, tokenId, code, expiresAt, nowIso).run();

                await sendResetOtpEmail(email, code, env);

                const requiresBillingChallenge = Boolean(account.tier === 'pro' && account.stripe_customer_id);
                return jsonResponse({ success: true, requiresBillingChallenge }, 200, request);
            }

            // Route: POST /api/account/clean-slate-reset (Verify OTP + Billing Challenge & Execute Wipe)
            if (path === "/api/account/clean-slate-reset" && request.method === "POST") {
                let body = null;
                try {
                    body = await request.json();
                } catch (e) {
                    return errorResponse("Invalid JSON in request body.", 400, request);
                }

                const email = body && body.email ? body.email.trim().toLowerCase() : "";
                const code = body && body.code ? String(body.code).trim() : "";
                const newAuthHash = body && body.newAuthHash ? body.newAuthHash.trim() : "";
                const cardLast4 = body && body.cardLast4 ? String(body.cardLast4).trim() : "";

                if (!isValidEmail(email)) {
                    return errorResponse("A valid email is required.", 400, request);
                }
                if (!code || !/^\d{6}$/.test(code)) {
                    return errorResponse("A 6-digit verification code is required.", 400, request);
                }
                if (!newAuthHash || newAuthHash.length < 32) {
                    return errorResponse("A valid authHash string is required.", 400, request);
                }

                const token = await env.DB.prepare(
                    "SELECT * FROM password_reset_tokens WHERE email = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
                ).bind(email).first();

                if (!token) {
                    return errorResponse("No active reset request found. Please request a new verification code.", 400, request);
                }

                // Check expiration (15 minutes)
                if (new Date(token.expires_at).getTime() < Date.now()) {
                    await env.DB.prepare("UPDATE password_reset_tokens SET status = 'expired' WHERE id = ?").bind(token.id).run();
                    return errorResponse("Verification code has expired. Please request a new code.", 400, request);
                }

                // Helper for tracking failed attempts
                const recordFailure = async (message) => {
                    const newFailed = (Number(token.failed_attempts) || 0) + 1;
                    if (newFailed >= 3) {
                        await env.DB.prepare("UPDATE password_reset_tokens SET failed_attempts = ?, status = 'revoked' WHERE id = ?").bind(newFailed, token.id).run();
                        return jsonResponse({
                            error: "Too many failed verification attempts. This reset code has been revoked. Please request a new code.",
                            success: false,
                            revoked: true
                        }, 403, request);
                    } else {
                        await env.DB.prepare("UPDATE password_reset_tokens SET failed_attempts = ? WHERE id = ?").bind(newFailed, token.id).run();
                        const remaining = 3 - newFailed;
                        return jsonResponse({
                            error: `${message} ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
                            success: false,
                            attemptsRemaining: remaining
                        }, 401, request);
                    }
                };

                // 1. Verify OTP code
                if (token.code !== code) {
                    return await recordFailure("Invalid verification code.");
                }

                // 2. Fetch Account
                const account = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                if (!account) {
                    return errorResponse("Account not found.", 404, request);
                }

                // 3. Billing Challenge Verification for Pro accounts with Stripe
                if (account.tier === 'pro' && account.stripe_customer_id) {
                    if (!/^\d{4}$/.test(cardLast4)) {
                        return await recordFailure("Valid 4-digit card number required.");
                    }
                    const actualLast4 = await getCustomerCardLast4(account.stripe_customer_id, env);
                    if (!actualLast4 || actualLast4 !== cardLast4) {
                        return await recordFailure("Card digits do not match the payment method on file.");
                    }
                }

                // Verification successful - Mark token as used
                await env.DB.prepare("UPDATE password_reset_tokens SET status = 'used' WHERE id = ?").bind(token.id).run();

                // Atomically wipe encrypted vault and recovery envelope, set new authHash, preserve subscription & metadata
                const nowIso = new Date().toISOString();
                await env.DB.prepare(`
                    UPDATE accounts
                    SET auth_hash = ?,
                        vault_ciphertext = NULL,
                        recovery_envelope = NULL,
                        vault_version = 1,
                        updated_at = ?,
                        last_login_at = ?
                    WHERE email = ?
                `).bind(
                    newAuthHash,
                    nowIso,
                    nowIso,
                    email
                ).run();

                await sendResetConfirmationEmail(email, env);

                const updated = await env.DB.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first();
                return jsonResponse(normalizeAccountRow(updated), 200, request);
            }

            // 404 for unknown endpoints
            return errorResponse(`Endpoint not found: ${request.method} ${path}`, 404, request);
        } catch (serverErr) {
            console.error("Worker unhandled error:", serverErr);
            return errorResponse("Internal server error: " + serverErr.message, 500, request);
        }
    }
};
