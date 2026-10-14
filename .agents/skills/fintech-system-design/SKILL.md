---
name: fintech-system-design
description: >-
  Expert architectural framework and review methodology for evaluating
  zero-knowledge fintech applications, edge serverless computing, client-side
  cryptography, distributed database schemas, and offline-first systems. Use
  this skill when the user asks to audit, evaluate, or review security,
  cryptographic mechanisms, Cloudflare Worker endpoints, database schemas,
  authentication, or system design trade-offs.
---

# FinTech System Design & Cryptographic Architecture Framework

This skill equips the agent with advanced financial software engineering,
cryptographic verification, and edge systems architecture patterns to conduct
rigorous, adversarial evaluations of zero-knowledge web applications.

---

## 1. Zero-Knowledge Cryptography Evaluation Rubric

When evaluating client-side encryption and key management architectures:

### A. Key Derivation Function (KDF) Integrity
* **Algorithm & Work Factor:** Enforce modern KDF standards. PBKDF2 must use at
  least 100,000 iterations of HMAC-SHA-256 (or Argon2id where WebAssembly is
  acceptable).
* **Salt Strategy:** Salts must be globally unique per user (e.g. normalized
  canonical email). Evaluate risks of precomputed rainbow table attacks.
* **Separation of Keys:** The encryption key (Master Key) must **never** be
  transmitted or used directly for authentication. The client must derive an
  independent `authHash` (e.g. `SHA-256(rawKeyHex)`) for API authentication.
* **Memory Safety:** Sensitive keys should reside in `CryptoKey` non-extractable
  handles where feasible, preventing XSS-based memory extraction.

### B. Symmetric Cipher Configuration
* **Authenticated Encryption:** Enforce **AES-256-GCM** (Galois/Counter Mode).
  Reject unauthenticated modes (CBC without HMAC, ECB).
* **Initialization Vector (IV):** Must be a cryptographically secure random
  12-byte (96-bit) buffer generated via `crypto.getRandomValues()` for **every
  single encryption operation**.
* **IV Reuse Vulnerability:** In GCM, reusing an IV with the same key destroys
  authenticity and leaks plaintext XOR relations. Audit code to ensure IVs are
  never static, reused, or derived sequentially.

### C. Account Recovery & Clean Slate Defenses
* **Emergency Recovery Keys:** Evaluate recovery envelope security. High-entropy
  Base32 recovery tokens must encrypt the Master Key independently.
* **Clean Slate Protocol (Option B):** When a user loses both password and
  recovery key, evaluate the defense against email takeover:
  * Free accounts: 6-digit email OTP with strict expiration (15 min) and brute
    force counters (3 attempts).
  * Paid/Pro accounts: Must enforce a secondary proof-of-ownership barrier (e.g.
    Last 4 digits of payment card on file) before allowing unreadable vault
    wiping.

---

## 2. Edge & Serverless Architecture (Cloudflare Workers & D1)

### A. Distributed SQLite (Cloudflare D1) Consistency
* **Read-Replication vs Write Latency:** D1 provides read replication at edge
  locations with primary writes coordinated centrally. Evaluate read-after-write
  consistency for instant UI sync.
* **Monotonic Versioning:** Enforce monotonically increasing `vault_version`
  counters on records to detect and prevent split-brain write conflicts or
  accidental overwriting of newer data from stale tabs.
* **Parameterized Query Bindings:** 100% of SQL statements must use prepared
  statements (`env.DB.prepare().bind()`). Reject dynamic string interpolation.

### B. Edge Security Defenses
* **Anti-Enumeration:** Registration, login, and password reset endpoints must
  return identical timing and payload responses for existent and non-existent
  accounts to prevent user enumeration.
* **Rate Limiting:** Enforce strict per-IP and per-account rate limits on
  cryptographic derivation and authentication endpoints (e.g. max 3 reset
  requests per hour).
* **Payload Sanitation:** Enforce maximum payload limits (e.g. 64KB for vault
  ciphertexts) to prevent edge memory exhaustion.

---

## 3. Client-Side Data Ingestion (CSV / Excel / PDF)

* **Zero-Server Exposure:** Document parsing must occur entirely within client
  memory using Web Streams or client JavaScript. Financial statements must never
  touch an intermediary server.
* **Formula Injection Defenses:** When parsing CSV or Excel files, sanitize cells
  beginning with `=`, `+`, `-`, or `@` to neutralize CSV formula injection if
  data is re-exported.
* **Memory Management:** Ensure large statement parsing (e.g. multi-year PDF
  ledgers) releases object URLs and intermediate buffers cleanly.

---

## 4. Evaluation Checklist for Audit Sessions

When reviewing a codebase or proposal under this skill:
1. **Threat Model:** Identify the attacker profile (passive network snooper,
   compromised database operator, malicious browser extension, hostile public
   Wi-Fi).
2. **Failure Modes:** Analyze what happens when network disconnects mid-sync,
   local storage is cleared, or token expires.
3. **Single Point of Failure (SPOF):** Verify if any single component can leak
   unencrypted holdings.
4. **Architectural Trade-Off Matrix:** Compare security vs latency, simplicity
   vs defense-in-depth, and client compute vs server compute.
