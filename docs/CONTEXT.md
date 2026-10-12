# Project Context & Quick-Start Briefing

> **Purpose:** This file is a condensed, single-page executive summary of the entire project. When starting a fresh Antigravity session, prompt the agent to **"Read `docs/CONTEXT.md` and check `git status`"** to bring it up to speed instantly with zero context loss.

---

## 1. Product Identity & Core Philosophy
* **Product:** Portfolio Rebalancer (`v1.2.2`).
* **Architecture:** Privacy-first, local-first, zero-knowledge client-side application.
* **Tech Stack:**
  * **Frontend:** Vanilla HTML5, CSS Custom Properties, and modern JavaScript in a single, zero-dependency file (`index.html`).
  * **Backend:** Cloudflare Workers (`backend/src/index.js`) + Cloudflare D1 distributed SQLite (`backend/schema.sql`).
  * **Cryptography:** Client-side Web Crypto API using **PBKDF2** (100,000 iterations, SHA-256) and **AES-256-GCM** (12-byte IV). Server never sees master passwords or decrypted portfolios.
* **The Golden Rule:** **Never paywall the arithmetic.** The calculator math (whole shares, fractional shares, dollar mode, price/qty mode, conserving rounding) is 100% free and un-neutered. We only monetize automation, external API costs, multi-portfolio management, and scale.

---

## 2. Current Implementation Status (v1.2.2)
* **Active Branch:** `dev` (tracks `origin/dev`).
* **Parity Requirement:** Exact **0-diff parity** maintained between root `index.html` and `GitHub/Rebalance/index.html`.
* **Test Suite:** **221 / 221 automated tests passing (100%)**:
  * `tests/master_test_suite.js`: 194 tests (Parts 1–12).
  * `tests/backend_test_suite.js`: 27 tests (Worker API & D1 SQL).
* **Features Fully Completed:**
  1. **Dual Input Modes:** Toggle in Settings -> Preferences between:
     * **Value Mode (Default):** 5-column grid (`[Ticker] [Current Value] [Target %]`).
     * **Shares Mode:** 6-column grid (`[Ticker] [Share Price] [Quantity] [Target %]`). Auto-calculates $\text{Value} = \text{Price} \times \text{Qty}$. Fractional shares supported.
  2. **Holdings Sorting Subsystem (`--sort by--`):**
     * Dynamic sorting dropdown anchored above the delete button (`✕`) with ascending/descending directional toggle button.
     * Supports `Alphabetical`, `Target Weight`, and `Value`, plus dynamic `Share Price` and `Quantity` options in Shares Mode.
     * Restores exact manual input order via `_originalIndex` when set to `--sort by--`.
     * Harmonized column layout (`32px 1.2fr 1.15fr 0.95fr 1.15fr 36px`) and `8px 11px` header padding ensuring pixel-perfect vertical alignment with input fields and over 30px clearance to the sort pill.
  3. **Decoupled Configuration & Privacy Engine (`config.js`):**
     * All personal identifiers, support contacts (`rebalancecalculator@gmail.com`), version tags, and sync endpoints extracted into a standalone `config.js` module.
     * Graceful fallback defaults in `index.html` ensuring offline zero-dependency resilience.
  4. **Dual-Tier Session Persistence & UI Theming:**
     * "Stay signed in on this device" persistent authentication in `localStorage` vs ephemeral single-tab session in `sessionStorage`.
     * Styled checkbox accents using native CSS `--accent` (#24dba1) mint green.
  5. **Rebalancing Engines:**
     * **Cash Injection:** Buys only, prioritizing underweight holdings, respecting `minBuy`.
     * **Complete Rebalance:** Buys and sells to hit exact target weights.
     * **Conserving Whole-Dollar Rounding:** Largest Remainder Method (Hamilton-Hare) guaranteeing zero cash leaks or created dollars ($\sum \text{Allocations} \equiv \text{Deposit}$).
  6. **Comparative Progress Bars:** Clean dual-bar layout displaying initial weight (`alloc-bar-start`), post-rebalance weight (`alloc-bar-new`), and target line (`alloc-target-marker`).
  7. **Client-Side Document Parsing & Extensible Broker Adapters:**
     * Native RFC-4180 CSV tokenizer, native OpenXML (.xlsx / .xlsm) decompressor, and native PDF text extractor.
     * Automated broker detection and aggregation adapters for Vanguard, CommSec, Pearler, Nabtrade, and Betashares Direct.
  8. **Option B Clean Slate Account Reset:**
     * Allows users who lost their password and recovery key to wipe unreadable vaults and reset credentials without losing their subscription.
     * **Free tier:** 6-digit email OTP.
     * **Pro tier:** 6-digit email OTP **+ Last 4 Digits of the payment card on file** (prevents email takeover attacks).
     * Rate limited to 3 requests/hr; 3-attempt lockout.

---

## 3. Business & Monetization Blueprint

### A. Pricing Structure
* **Launch / Founder Phase (First 500 Subscribers):**
  * **Annual Early Bird:** **\$48.00 / year** (framed as **"\$4.00 / month, locked in for life"**).
  * **Monthly Plan:** **\$5.00 / month** (serves as the low-friction test drive).
  * **Grandfathering Rule:** The \$48/yr rate remains active as long as the subscription is continuously maintained. If canceled, future resubscriptions are at standard market rates.
* **Mature Phase (Post-500 Subscribers):**
  * **Annual Plan:** **\$60.00 / year** (\$5.00 / month flat, "Save 38%").
  * **Monthly Plan:** **\$8.00 / month** (flexible, cancel anytime).

### B. Merchant of Record (MoR): Lemon Squeezy
* **Why an MoR:** Lemon Squeezy (owned by Stripe) acts as the legal reseller, assuming **100% legal liability for calculating, collecting, and remitting sales tax, EU VAT, UK VAT, and GST globally**.
* **Fee Structure:** **5.5% + \$0.50** per transaction.
  * **Annual (\$48):** \$3.14 total fee (**6.5% drag**). You net **\$44.86 upfront on Day 1**.
  * **Monthly (\$5):** \$0.78 total fee (**15.6% drag**). You net **\$4.22 / month**.
* **No-Refund Policy / Abuse Prevention:**
  * For intermittent rebalancing tools, free trials and 14-day refund guarantees get exploited by hit-and-run users who rebalance once and cancel.
  * **Policy:** *"Cancel anytime with one click; access remains active until the end of the paid billing period. No partial refunds."* The \$5 monthly plan acts as the paid trial.

### C. Free vs. Pro Feature Boundaries
* **Free:** 1 Portfolio, up to 8 holdings, full mathematical precision, manual price entry, local/cloud vault.
* **Pro:** Unlimited Portfolios (Retirement, Taxable, Crypto), unlimited holdings, live market data feeds, daily automated drift monitoring crons with email alerts.

---

## 4. Technical Roadmap & Immediate Next Tasks

1. **Rebalance Breakdown for Shares Mode:**
   * Currently, the rebalance output displays dollar amounts to buy (e.g., `+$500.00`).
   * When in **Share Price & Quantity Mode**, update the breakdown to also display **exact shares to buy** (e.g., `+5 shares @ $100.00`) alongside leftover cash.
2. **Lemon Squeezy Integration:**
   * Frontend: Add `lemon.js` overlay checkout modal to `index.html`.
   * Backend: Implement webhook endpoint `POST /api/webhooks/lemonsqueezy` in `worker.js` with HMAC-SHA256 signature verification.
   * D1 Database: Map webhooks to `tier = 'pro'`, `subscription_status`, and `subscription_expires_at` in the existing `accounts` table.
3. **Live Price Feeds & Automated Drift Alerts:**
   * Integrate financial data API (e.g. TwelveData / Finnhub / FMP) with Cloudflare KV caching.
   * Add Cloudflare Cron Trigger to monitor drift daily and trigger transactional emails via Resend.

---

## 5. Development Rules for AI Agents & Developers
1. **Never Push to Git:** Run commits locally on branch `dev` or `main`. The user pushes to GitHub.
2. **Preserve User Code:** Do not revert user edits, and strictly preserve version tags (currently **`v1.2.2`**).
3. **Strict Parity:** Always mirror changes between `c:\Users\willi\Desktop\Rebalancing\index.html` and `c:\Users\willi\Desktop\Rebalancing\GitHub\Rebalance\index.html`. Verify with `fc.exe`.
4. **All Tests Green:** Run `node tests/master_test_suite.js` (194 tests) and `node tests/backend_test_suite.js` (27 tests) before finishing any task. All 221 tests must pass.
5. **Zero-Knowledge & Client-Side File Parsing:** CSV, Excel (.xlsx, .xlsm, .xls), and PDF (.pdf) parsing must remain 100% client-side and offline-capable without sending user financial files to any remote server.

