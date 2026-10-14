---
name: saas-monetization-economics
description: >-
  Specialized SaaS business strategy, pricing psychology, Merchant of Record
  (MoR) economics, churn mitigation, and product tiering framework for web
  applications and micro-SaaS. Use this skill when the user asks to evaluate,
  audit, or optimize monetization models, pricing structures, Lemon Squeezy
  integrations, conversion funnels, refund policies, or free-vs-pro boundaries.
---

# SaaS Monetization & Micro-FinTech Business Economics Framework

This skill equips the agent with high-level SaaS economics, conversion
psychology, payment gateway fee modeling, and micro-SaaS business strategy to
critique, optimize, and stress-test product monetization models.

---

## 1. The Intermittent Utility Churn Problem

### The Core Challenge
Portfolio rebalancing, tax preparation, and periodic audit tools are
**intermittent utilities** (used once a month, once a quarter, or twice a
year). Unlike daily-use workflow tools (Slack, Notion), intermittent tools face
a structural retention hazard:
* A customer subscribes on Day 1 for \$5–\$8/month.
* They complete their rebalance within 10 minutes.
* They immediately cancel their subscription to avoid recurring charges for the
  next 89 days of inactivity.

### Strategic Solutions
1. **Price Anchoring Towards Annual Plans:**
   * Frame the annual plan as the default, irresistible choice.
   * Example: **\$48.00 / year** framed as **"\$4.00 / month, locked in for
     life"** or **\$60.00 / year** ("Save 38%").
   * Captures 100% of the customer's annual value upfront on Day 1, eliminating
     intermittent monthly cancellation.
2. **Grandfathering Incentive:**
   * Clearly state that promotional annual rates (\$48/yr) remain locked in for
     life as long as the subscription is maintained continuously. If canceled,
     future renewals revert to full market price (\$60–\$80/yr). This converts
     potential churn into sticky passive retention.
3. **No-Refund / Paid Trial Policy:**
   * Free trials and 14-day money-back guarantees on intermittent tools get
     exploited by hit-and-run users who balance once and refund.
   * Maintain a transparent, firm policy: *"Cancel anytime with one click;
     access continues until the end of the paid period. No partial refunds."*
   * The low-cost monthly tier (\$5–\$8) serves as the user's self-selected paid
     trial.

---

## 2. Merchant of Record (MoR) Financial Engineering

### Why an MoR (Lemon Squeezy / Paddle) vs Standard Stripe
* **Global Tax Remittance:** Standard Stripe requires the founder to track,
  calculate, collect, and legally file sales taxes, EU VAT (via OSS), UK VAT,
  and Australian GST across dozens of jurisdictions.
* **Reseller Protection:** An MoR legally acts as the authorized merchant. They
  take 100% of the liability for global tax remittance and compliance,
  transferring clean, consolidated payouts to the business owner.

### Fee Drag Optimization
MoRs charge a flat fee plus percentage (e.g. Lemon Squeezy: **5.5% + \$0.50** per
transaction):
* **On Monthly Billing (\$5.00):**
  * \$0.50 fixed + \$0.28 (5.5%) = **\$0.78 fee** (**15.6% fee drag**).
  * Net take-home: **\$4.22 / month**.
* **On Annual Billing (\$48.00):**
  * \$0.50 fixed (paid once) + \$2.64 (5.5%) = **\$3.14 fee** (**6.5% fee
    drag**).
  * Net take-home: **\$44.86 upfront**.
* **Strategic Takeaway:** Every monthly customer incurs 12x the fixed transaction
  overhead. Shifting the distribution to 80%+ annual drastically cuts payment
  processing drag from ~15% down to ~6%.

---

## 3. Product Tiering Boundaries: "Never Paywall the Math"

When assessing feature gating between Free and Paid tiers:

### What Must Remain Free (The Trust Engine)
* **Mathematical Precision:** Never truncate decimal accuracy, restrict
  fractional shares, or deliberately insert cash leaks into the free math.
* **Both Input Modes:** Value mode and Price/Qty mode should both be free.
* **Core Privacy:** Client-side zero-knowledge encryption must never be a
  "Pro" feature; privacy is a fundamental standard.

### What Should Be Monetized (The Scale & Convenience Engine)
* **Scale / Quantity:**
  * Free: 1 Portfolio, up to 8 holdings (covers 85% of retail 3-fund investors).
  * Pro: Unlimited Portfolios (Retirement, Taxable, Spouse, Crypto) & unlimited
    holdings.
* **Ongoing Server Costs & API Compute:**
  * Free: Manual entry or client-side file imports (costs \$0.00 to serve).
  * Pro: Live market data price feeds (Finnhub, TwelveData), automated daily
    drift monitoring crons, and transactional email alerts (Resend/SendGrid).
* **Multi-Device Cloud Sync:**
  * Seamless encrypted synchronization across desktop and mobile devices.

---

## 4. Evaluation Checklist for Business Review Sessions

When auditing monetization plans or feature gating:
1. **Friction vs Value:** Does the paywall disrupt the core "Aha!" moment or
   feel like an extortion tax?
2. **Unit Economics:** Does the annual price exceed the annualized API and
   database compute cost per active Pro user?
3. **Abuse Vectors:** Can a user bypass the 8-holding limit or single portfolio
   limit via local storage export/import tricks?
4. **Checkout Friction:** Is checkout embedded via an overlay modal
   (`lemon.js`) to minimize drop-off, or does it redirect to an external domain?
