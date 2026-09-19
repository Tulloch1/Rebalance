const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

console.log("=================================================");
console.log("   RUNNING CLOUDFLARE WORKER & D1 TEST SUITE     ");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

async function runTest(description, fn) {
    totalTests++;
    try {
        await fn();
        console.log(`  ✓ ${description}`);
        passedTests++;
    } catch (err) {
        console.error(`  ✗ ${description}`);
        console.error(`    ${err.stack || err}`);
        throw err;
    }
}

function createMockD1() {
    const db = new DatabaseSync(':memory:');
    const schemaPath = path.resolve(__dirname, '..', 'backend', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);

    return {
        _rawDb: db,
        prepare(sql) {
            return {
                _params: [],
                bind(...params) {
                    this._params = params;
                    return this;
                },
                async first() {
                    const stmt = db.prepare(sql);
                    const row = stmt.get(...this._params);
                    return row || null;
                },
                async all() {
                    const stmt = db.prepare(sql);
                    const rows = stmt.all(...this._params);
                    return { results: rows };
                },
                async run() {
                    const stmt = db.prepare(sql);
                    const info = stmt.run(...this._params);
                    return { success: true, meta: info };
                }
            };
        }
    };
}

async function runAllBackendTests() {
    const workerModule = await import('../backend/src/index.js');
    const worker = workerModule.default;
    const d1 = createMockD1();
    const env = { DB: d1 };

    // Helper to make mock fetch calls to the worker
    async function request(path, options = {}) {
        const url = `https://rebalance.local${path}`;
        const headers = new Headers(options.headers || {});
        if (options.body && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        const req = new Request(url, {
            method: options.method || "GET",
            headers,
            body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null
        });
        return await worker.fetch(req, env, {});
    }

    // --- 1. CORS & Security Headers ---
    await runTest("OPTIONS preflight returns 204 with required CORS headers", async () => {
        const res = await request("/api/account", {
            method: "OPTIONS",
            headers: { "Origin": "https://rebalancer.pages.dev" }
        });
        assert.strictEqual(res.status, 204);
        assert.strictEqual(res.headers.get("Access-Control-Allow-Origin"), "https://rebalancer.pages.dev");
        assert.ok(res.headers.get("Access-Control-Allow-Methods").includes("POST"));
    });

    // --- 2. Health Endpoint ---
    await runTest("GET /api/health confirms API status and D1 connectivity", async () => {
        const res = await request("/api/health");
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.status, "ok");
        assert.strictEqual(data.d1, "connected");
        assert.ok(data.timestamp);
    });

    // --- 3. Registration: POST /api/account ---
    await runTest("POST /api/account validates email format and authHash", async () => {
        // Missing email
        const res1 = await request("/api/account", {
            method: "POST",
            body: { authHash: "a".repeat(64) }
        });
        assert.strictEqual(res1.status, 400);

        // Invalid email format
        const res2 = await request("/api/account", {
            method: "POST",
            body: { email: "not-an-email", authHash: "a".repeat(64) }
        });
        assert.strictEqual(res2.status, 400);

        // Short authHash
        const res3 = await request("/api/account", {
            method: "POST",
            body: { email: "valid@example.com", authHash: "short" }
        });
        assert.strictEqual(res3.status, 400);
    });

    const testUser = {
        email: "investor@example.com",
        authHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        vault: { v: 1, iv: "iv_base64", data: "data_base64" },
        tier: "free",
        preferences: { currency: "USD", theme: "dark", autoSync: true }
    };

    await runTest("POST /api/account successfully registers new account with schema v2", async () => {
        const res = await request("/api/account", {
            method: "POST",
            body: testUser
        });
        assert.strictEqual(res.status, 201);
        const data = await res.json();
        assert.strictEqual(data.email, "investor@example.com");
        assert.strictEqual(data.schemaVersion, 2);
        assert.strictEqual(data.vaultVersion, 1);
        assert.strictEqual(data.tier, "free");
        assert.deepStrictEqual(data.vault, testUser.vault);
        assert.strictEqual(data.subscriptionStatus, "none");
        assert.ok(data.createdAt && data.updatedAt && data.lastLoginAt);
    });

    await runTest("POST /api/account rejects duplicate registration with 409 Conflict", async () => {
        const res = await request("/api/account", {
            method: "POST",
            body: testUser
        });
        assert.strictEqual(res.status, 409);
        const data = await res.json();
        assert.ok(data.error.includes("already exists"));
    });

    // --- 4. Account Lookup: GET /api/account ---
    await runTest("GET /api/account retrieves registered user and parses encrypted blobs", async () => {
        const res = await request(`/api/account?email=${encodeURIComponent(testUser.email)}`);
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.email, testUser.email);
        assert.strictEqual(data.authHash, testUser.authHash);
        assert.deepStrictEqual(data.vault, testUser.vault);
        assert.strictEqual(data.schemaVersion, 2);
    });

    await runTest("GET /api/account returns 404 for unknown user", async () => {
        const res = await request(`/api/account?email=unknown@example.com`);
        assert.strictEqual(res.status, 404);
    });

    // --- 5. Vault Auto-Sync: PUT /api/vault ---
    await runTest("PUT /api/vault updates encrypted vault and increments vaultVersion", async () => {
        const newVault = { v: 1, iv: "iv_updated", data: "data_updated" };
        const res = await request("/api/vault", {
            method: "PUT",
            body: {
                email: testUser.email,
                vault: newVault
            }
        });
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.vaultVersion, 2);
        assert.deepStrictEqual(data.vault, newVault);
    });

    await runTest("PUT /api/vault updates recovery envelope when key is generated", async () => {
        const recoveryEnvelope = { v: 1, iv: "rec_iv", data: "rec_data" };
        const res = await request("/api/vault", {
            method: "PUT",
            body: {
                email: testUser.email,
                recoveryEnvelope: recoveryEnvelope
            }
        });
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.deepStrictEqual(data.recoveryEnvelope, recoveryEnvelope);
    });

    // --- 6. Account Recovery: POST /api/recover ---
    await runTest("POST /api/recover resets credentials and updates vault on emergency recovery", async () => {
        const newAuthHash = "f".repeat(64);
        const restoredVault = { v: 1, iv: "restored_iv", data: "restored_data" };

        const res = await request("/api/recover", {
            method: "POST",
            body: {
                email: testUser.email,
                authHash: newAuthHash,
                vault: restoredVault
            }
        });
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.authHash, newAuthHash);
        assert.deepStrictEqual(data.vault, restoredVault);
        assert.strictEqual(data.vaultVersion, 4);
    });

    await runTest("POST /api/recover rejects account without configured recovery key", async () => {
        // Register user without recovery envelope
        await request("/api/account", {
            method: "POST",
            body: { email: "norecovery@example.com", authHash: "b".repeat(64) }
        });

        const res = await request("/api/recover", {
            method: "POST",
            body: { email: "norecovery@example.com", authHash: "c".repeat(64) }
        });
        assert.strictEqual(res.status, 400);
        const data = await res.json();
        assert.ok(data.error.includes("No emergency recovery key configured"));
    });

    // --- 7. Security Guardrails & Edge Cases ---
    await runTest("Worker rejects oversized payload with 413", async () => {
        const res = await request("/api/account", {
            method: "POST",
            headers: { "Content-Length": String(600 * 1024) },
            body: { email: "huge@example.com" }
        });
        assert.strictEqual(res.status, 413);
    });

    await runTest("Worker rejects malformed JSON with 400", async () => {
        const res = await request("/api/account", {
            method: "POST",
            body: "{ broken-json"
        });
        assert.strictEqual(res.status, 400);
    });

    await runTest("Worker returns 404 for nonexistent route", async () => {
        const res = await request("/api/nonexistent");
        assert.strictEqual(res.status, 404);
    });

    await runTest("SQL injection in email query parameter is neutralized by prepared statement", async () => {
        const injection = "investor@example.com' OR '1'='1";
        const res = await request(`/api/account?email=${encodeURIComponent(injection)}`);
        assert.strictEqual(res.status, 400); // Invalid email format rejects safely
    });

    console.log(`\n=================================================`);
    console.log(` BACKEND TEST SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log(`=================================================\n`);
}

runAllBackendTests().catch(err => {
    console.error("Backend test suite failure:", err);
    process.exit(1);
});

