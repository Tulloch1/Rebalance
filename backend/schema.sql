-- Portfolio Rebalancer D1 Database Schema (Schema Version 2)
-- Forward-compatible schema supporting Zero-Knowledge Vaults, Recovery Envelopes, and Subscriptions

CREATE TABLE IF NOT EXISTS accounts (
    email TEXT PRIMARY KEY,
    auth_hash TEXT NOT NULL,
    schema_version INTEGER NOT NULL DEFAULT 2,
    vault_version INTEGER NOT NULL DEFAULT 1,
    vault_ciphertext TEXT,
    recovery_envelope TEXT,
    tier TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'none',
    subscription_expires_at TEXT,
    preferences TEXT NOT NULL DEFAULT '{"currency":"USD","theme":"auto","autoSync":true}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_login_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_accounts_auth ON accounts(auth_hash);
CREATE INDEX IF NOT EXISTS idx_accounts_tier ON accounts(tier);

-- Password Reset & Clean Slate Verification Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    code TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reset_email_status ON password_reset_tokens(email, status);
CREATE INDEX IF NOT EXISTS idx_reset_email_created ON password_reset_tokens(email, created_at);

