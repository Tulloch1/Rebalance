---
name: quantitative-portfolio-math
description: >-
  Mathematical principles, algorithmic optimization, conserved rounding
  mechanisms, and precision safeguards for portfolio rebalancing engines. Use
  this skill when the user asks to review, audit, verify, or optimize
  rebalancing calculations, rounding algorithms, drift band thresholds,
  floating-point precision, or mathematical invariants.
---

# Quantitative Portfolio Mathematics & Algorithmic Rebalancing Framework

This skill equips the agent with quantitative finance algorithms, discrete
apportionment mathematics, floating-point precision guarantees, and invariant
verification methodologies for portfolio optimization engines.

---

## 1. Discrete Apportionment & Conserved Whole-Dollar Rounding

### The Rounding Paradox
When calculating rebalancing orders, ideal mathematical allocations yield
fractional dollar amounts (e.g. \$100.40, \$199.80, \$99.80 for a \$400
deposit).
* Applying naive round-half-up (`Math.round`) results in \$100 + \$200 + \$100 =
  **\$400** (works here), but for \$100.45 + \$199.55 = \$100 + \$200 = \$300
  (correct), whereas \$100.51 + \$199.51 = \$101 + \$200 = **\$301** (leaks \$1
  of unauthorized cash!).
* An unconstrained rounding algorithm inevitably causes **cash leaks**
  (overspending the deposit) or **cash creation/shortfall**.

### The Solution: Largest Remainder Method (Hamilton-Hare)
To guarantee the hard conservation invariant:
$$\sum_{i=1}^n \text{Allocations}_i \equiv \text{Deposit}$$

1. **Integer Floor:** Floor each allocation to its integer component:
   $$I_i = \lfloor A_i \rfloor$$
2. **Fractional Remainder:** Compute the remainder for each asset:
   $$R_i = A_i - I_i$$
3. **Remainder Deficit:** Calculate unallocated whole dollars:
   $$\Delta = \text{Deposit} - \sum_{i=1}^n I_i$$
4. **Apportionment:** Sort assets by $R_i$ descending. Add \$1.00 to the top
   $\Delta$ assets.
* **Mathematical Invariant:** Zero dollars created, zero dollars lost. The total
  order strictly matches the user's intended cash injection.

---

## 2. Rebalancing Algorithm Architectures

### A. Cash Injection Rebalancing (Buys Only)
* **Goal:** Bring portfolio as close to target percentages as possible without
  triggering taxable sales of overweight assets.
* **Iterative Allocation:**
  1. Calculate current asset values and total portfolio value including new
     deposit.
  2. Compute target monetary value for each asset: $T_i = V_{\text{total}} \times w_i$.
  3. Identify underweight assets ($V_i < T_i$) and calculate initial deficits
     $D_i = T_i - V_i$.
  4. Allocate funds proportionally to deficits. If deposit exceeds total
     deficits, distribute surplus strictly according to target weights $w_i$.
* **Minimum Purchase Threshold (`minBuy`):**
  * When $D_i < \text{minBuy}$, micro-transactions generate disproportionate
    broker fees.
  * Consolidate sub-minimum purchases into the most underweight holding, or
    suppress allocations below threshold while signaling an explicit warning
    banner.

### B. Complete Rebalancing (Buys and Sells)
* **Goal:** Exact target weight alignment across all assets.
* **Calculation:**
  $$\text{Cut}_i = (V_{\text{total}} + \text{Deposit}) \times w_i - V_i$$
* **Invariant:**
  $$\sum_{i=1}^n \text{Cut}_i \equiv \text{Deposit}$$
  Positive cuts indicate BUY orders; negative cuts indicate SELL orders.

---

## 3. Precision & Numerical Safeguards

### Binary Floating-Point Hazards
* In IEEE 754 floating-point arithmetic:
  $$0.1 + 0.2 = 0.30000000000000004$$
* In financial applications, accumulated floating-point inaccuracies cause false
  target mismatch warnings (e.g. weights summing to `99.99999999999999%` instead
  of `100%`).
* **Safeguard Standards:**
  * Use epsilon comparisons for equality: `Math.abs(sum - 100) < 1e-5`.
  * Quantize monetary values to 2 decimal places using cent-scaled integers or
    `Number(val.toFixed(2))` after intermediate arithmetic.
  * Avoid repeated division/multiplication round-trips.

---

## 4. Evaluation Checklist for Quantitative Math Sessions

When auditing rebalancing math:
1. **Conservation Invariant:** Does the sum of output buy orders minus sell orders
   identically match the user's cash injection under all deposit amounts?
2. **Extreme Edge Cases:**
   * Single holding at 100%.
   * Zero deposit (\$0.00).
   * Negative deposit (withdrawal) exceeding total portfolio value.
   * Uneven target weights (e.g. 33.33%, 33.33%, 33.34%).
3. **Property-Based Fuzzing:** Verify if randomized simulation suites test
   thousands of erratic asset distributions to confirm that no negative buys,
   NaN allocations, or cash leakages ever manifest.
