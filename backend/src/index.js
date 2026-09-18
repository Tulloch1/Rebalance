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

            // 404 for unknown endpoints
            return errorResponse(`Endpoint not found: ${request.method} ${path}`, 404, request);
        } catch (serverErr) {
            console.error("Worker unhandled error:", serverErr);
            return errorResponse("Internal server error: " + serverErr.message, 500, request);
        }
    }
};
