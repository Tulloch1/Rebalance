const assert = require('assert');
const { createTestEnv } = require('./test_helper');

let totalTests = 0;
let passedTests = 0;

async function runTest(name, fn) {
    totalTests++;
    try {
        const res = fn();
        if (res && typeof res.then === 'function') {
            await res;
        }
        passedTests++;
        console.log(`  ✓ ${name}`);
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(`    Error: ${err.message}`);
        throw err;
    }
}

async function runAllMasterTests() {
    console.log("=================================================");
    console.log("       RUNNING MASTER DETERMINISTIC SUITE        ");
    console.log("=================================================\n");

// =========================================================================
// PART 1: CALCULATE BUTTON & MINIMUM TRANSACTION STATE MACHINE MATRIX
// =========================================================================
console.log("--- PART 1: Calculate Button & Min Transaction State Machine Matrix ---");
    // =========================================================================
    // PART 1: CALCULATE BUTTON & MINIMUM TRANSACTION STATE MACHINE MATRIX
    // =========================================================================
    console.log("--- PART 1: Calculate Button & Min Transaction State Machine Matrix ---");

{
    const env = createTestEnv();

    // 1. Complete OFF, deposit='', minBuy=0
    runTest("Complete OFF, deposit='', minBuy=0 -> Disabled ('Please enter a deposit/withdrawal amount')", () => {
        env.setInputs({ deposit: '', minBuy: '0', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, true);
        assert.strictEqual(state.noticeText, "Please enter a deposit/withdrawal amount");
    });

    // 2. Complete OFF, deposit='0', minBuy=0
    runTest("Complete OFF, deposit='0', minBuy=0 -> Disabled ('Please enter a deposit/withdrawal amount')", () => {
        env.setInputs({ deposit: '0', minBuy: '0', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, true);
        assert.strictEqual(state.noticeText, "Please enter a deposit/withdrawal amount");
    });

    // 3. Complete OFF, deposit='', minBuy=50 (Priority 1 check)
    runTest("Complete OFF, deposit='', minBuy=50 -> Priority 1 takes precedence", () => {
        env.setInputs({ deposit: '', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, true);
        assert.strictEqual(state.noticeText, "Please enter a deposit/withdrawal amount");
    });

    // 4. Complete OFF, deposit='0', minBuy=50 (Priority 1 check)
    runTest("Complete OFF, deposit='0', minBuy=50 -> Priority 1 takes precedence on 0 deposit", () => {
        env.setInputs({ deposit: '0', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, true);
        assert.strictEqual(state.noticeText, "Please enter a deposit/withdrawal amount");
    });

    // 5. Complete OFF, deposit='20', minBuy=50 (Priority 2 check: exceeds deposit)
    runTest("Complete OFF, deposit='20', minBuy=50 -> Disabled ('Minimum transaction exceeds deposit')", () => {
        env.setInputs({ deposit: '20', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, true);
        assert.strictEqual(state.noticeText, "Minimum transaction exceeds deposit");
    });

    // 6. Complete OFF, deposit='-20', minBuy=50 (Priority 2 check: exceeds withdrawal)
    runTest("Complete OFF, deposit='-20', minBuy=50 -> Disabled ('Minimum transaction exceeds withdrawal')", () => {
        env.setInputs({ deposit: '-20', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, true);
        assert.strictEqual(state.noticeText, "Minimum transaction exceeds withdrawal");
    });

    // 7. Complete OFF, deposit='50', minBuy=50 -> Enabled (exactly equals threshold)
    runTest("Complete OFF, deposit='50', minBuy=50 -> Enabled (deposit == minBuy)", () => {
        env.setInputs({ deposit: '50', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 8. Complete OFF, deposit='-50', minBuy=50 -> Enabled (|withdrawal| == minBuy)
    runTest("Complete OFF, deposit='-50', minBuy=50 -> Enabled (|withdrawal| == minBuy)", () => {
        env.setInputs({ deposit: '-50', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 9. Complete OFF, deposit='100', minBuy=50 -> Enabled
    runTest("Complete OFF, deposit='100', minBuy=50 -> Enabled", () => {
        env.setInputs({ deposit: '100', minBuy: '50', complete: false });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 10. Complete ON, deposit='', minBuy=0 -> Enabled
    runTest("Complete ON, deposit='', minBuy=0 -> Enabled", () => {
        env.setInputs({ deposit: '', minBuy: '0', complete: true });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 11. Complete ON, deposit='0', minBuy=0 -> Enabled
    runTest("Complete ON, deposit='0', minBuy=0 -> Enabled", () => {
        env.setInputs({ deposit: '0', minBuy: '0', complete: true });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 12. Complete ON, deposit='', minBuy=50 -> Enabled
    runTest("Complete ON, deposit='', minBuy=50 -> Enabled", () => {
        env.setInputs({ deposit: '', minBuy: '50', complete: true });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 13. Complete ON, deposit='20', minBuy=50 -> Enabled
    runTest("Complete ON, deposit='20', minBuy=50 -> Enabled", () => {
        env.setInputs({ deposit: '20', minBuy: '50', complete: true });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 14. Complete ON, deposit='-20', minBuy=50 -> Enabled
    runTest("Complete ON, deposit='-20', minBuy=50 -> Enabled", () => {
        env.setInputs({ deposit: '-20', minBuy: '50', complete: true });
        const state = env.getCalcButtonState();
        assert.strictEqual(state.disabled, false);
        assert.strictEqual(state.noticeVisible, false);
    });

    // 15. Mouse wheel on focused number input triggers blur to prevent value alteration
    runTest("Mouse wheel on focused number input triggers blur without altering value", () => {
        const input = env.getEl("deposit");
        input.type = "number";
        input.value = "500";
        env.sandbox.document.activeElement = input;
        let blurred = false;
        input.blur = () => { blurred = true; };
        env.dispatchDocumentEvent({ type: "wheel" });
        assert.strictEqual(blurred, true);
        assert.strictEqual(input.value, "500");
    });
}

// =========================================================================
// PART 2: HOLDINGS INPUT VALIDATION & ERROR PHRASING MATRIX
// =========================================================================
console.log("\n--- PART 2: Holdings Input Validation & Error Phrasing Matrix ---");

{
    const env = createTestEnv();

    // 1. Valid holdings row passes
    runTest("0 invalid fields passes without errors", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: 'AAPL', v: '100', w: '100' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), []);
    });

    // 2. Single invalid: missing ticker
    runTest("Single invalid field (empty ticker) -> 'Please fill in a valid asset name for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: '', v: '100', w: '100' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid asset name for holding #1."]);
    });

    // 3. Single invalid: empty value
    runTest("Single invalid field (empty value) -> 'Please fill in a valid value for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: 'AAPL', v: '', w: '100' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid value for holding #1."]);
    });

    // 4. Single invalid: negative value
    runTest("Single invalid field (negative value) -> 'Please fill in a valid value for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: 'AAPL', v: '-50', w: '100' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid value for holding #1."]);
    });

    // 5. Single invalid: empty weight
    runTest("Single invalid field (empty weight) -> 'Please fill in a valid weight for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: 'AAPL', v: '100', w: '' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid weight for holding #1."]);
    });

    // 6. Single invalid: negative weight
    runTest("Single invalid field (negative weight) -> 'Please fill in a valid weight for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: 'AAPL', v: '100', w: '-10' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid weight for holding #1."]);
    });

    // 7. Two invalid: empty ticker & weight (User Spec)
    runTest("Two invalid fields (ticker & weight) -> 'Please fill in a valid asset name and weight for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: '', v: '100', w: '' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid asset name and weight for holding #1."]);
    });

    // 8. Two invalid: empty value & weight (User Spec)
    runTest("Two invalid fields (value & weight) -> 'Please fill in a valid value and weight for holding #2.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: 'AAPL', v: '100', w: '50' },
            { t: 'BHP', v: '', w: '' }
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid value and weight for holding #2."]);
    });

    // 9. Two invalid: empty ticker & value (User Spec)
    runTest("Two invalid fields (ticker & value) -> 'Please fill in a valid asset name and value for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: '', v: '', w: '50' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid asset name and value for holding #1."]);
    });

    // 10. Three invalid fields: partially filled row with invalid values
    runTest("Three invalid fields -> 'Please fill in valid asset name, value and weight values for holding #1.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([{ t: '', v: '-10', w: '-20' }]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in valid asset name, value and weight values for holding #1."]);
    });

    // 11. Blank row is skipped silently
    runTest("Completely empty rows are skipped silently", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: 'AAPL', v: '100', w: '100' },
            { t: '', v: '', w: '' }
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), []);
    });

    // 12. All rows completely empty
    runTest("All rows empty -> 'Please add at least one holding with ticker, value, and target weight.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: '', v: '', w: '' },
            { t: '', v: '', w: '' }
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), ["Please add at least one holding with ticker, value, and target weight."]);
    });

    // 13. Multiple invalid rows in row order (weights <= 100%)
    runTest("Multiple invalid rows are reported in holding index order", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: '', v: '50', w: '' },        // row 1: ticker & weight
            { t: 'AAPL', v: '100', w: '50' },  // row 2: valid
            { t: '', v: '', w: '' },          // row 3: blank (ignored)
            { t: 'BHP', v: '-5', w: '30' },   // row 4: value
            { t: '', v: '20', w: '20' }       // row 5: ticker
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), [
            "Please fill in a valid asset name and weight for holding #1.",
            "Please fill in a valid value for holding #4.",
            "Please fill in a valid asset name for holding #5."
        ]);
    });

    // 14. Complete Rebalance target weights sum check (< 100%)
    runTest("Complete Rebalance requires target weights sum to 100%", () => {
        env.setInputs({ deposit: '0', minBuy: '0', complete: true });
        env.setHoldings([
            { t: 'AAPL', v: '100', w: '50' },
            { t: 'BHP', v: '100', w: '30' }  // total = 80%
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), [
            "Target weights must sum to 100% to perform a Complete Rebalance (currently 80.0%)."
        ]);
    });

    // 15. Withdrawal exceeding total portfolio value
    runTest("Withdrawal cannot exceed total portfolio value", () => {
        env.setInputs({ deposit: '-250', minBuy: '0', complete: false });
        env.setHoldings([
            { t: 'AAPL', v: '100', w: '50' },
            { t: 'BHP', v: '100', w: '50' }
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), [
            "Withdrawal amount cannot exceed total portfolio value ($200.00)."
        ]);
    });

    // 16. Target weights exceed 100% on valid holdings
    runTest("Target weights exceed 100% -> 'Total target weights exceed 100% (currently X%). Please adjust weights to 100%.'", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: 'AAPL', v: '100', w: '60' },
            { t: 'BHP', v: '100', w: '55' }   // total = 115%
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), [
            "Total target weights exceed 100% (currently 115%). Please adjust weights to 100%."
        ]);
    });

    // 17. Target weights exceed 100% takes priority and is listed first when invalid fields exist
    runTest("Weighting cap error takes priority and is listed first when invalid fields exist", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: '', v: '50', w: '' },        // row 1: ticker & weight
            { t: 'AAPL', v: '100', w: '50' },  // row 2: valid
            { t: '', v: '', w: '' },          // row 3: blank (ignored)
            { t: 'BHP', v: '-5', w: '50' },   // row 4: value
            { t: '', v: '20', w: '30' }       // row 5: ticker (total weight = 50 + 50 + 30 = 130%)
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), [
            "Total target weights exceed 100% (currently 130%). Please adjust weights to 100%.",
            "Please fill in a valid asset name and weight for holding #1.",
            "Please fill in a valid value for holding #4.",
            "Please fill in a valid asset name for holding #5."
        ]);
    });
}

// =========================================================================
// PART 3: CORE REBALANCING ALGORITHMIC EDGE CASES
// =========================================================================
console.log("\n--- PART 3: Algorithmic Edge Cases & Reference Tests ---");

{
    const env = createTestEnv();

    // 1. Proportional underweight allocation test (matches dynaReb.c)
    runTest("Dynamic Rebalance Deposit: Standard 3-holding portfolio proportional allocation", () => {
        const holdings = [
            { name: 'AAPL', value: 150, targ_weight: 0.50 },
            { name: 'A200', value: 150, targ_weight: 0.30 },
            { name: 'BHP', value: 1000, targ_weight: 0.20 }
        ];
        const res = env.runDynaRebAlgorithm(600, holdings, 0);
        const cuts = {};
        res.assets.forEach(a => { cuts[a.name] = Math.round(a.cut); });
        assert.strictEqual(cuts['AAPL'], 393);
        assert.strictEqual(cuts['A200'], 207);
        assert.strictEqual(cuts['BHP'], 0);
        assert.strictEqual(cuts['AAPL'] + cuts['A200'] + cuts['BHP'], 600);
    });

    // 2. Deposit with MIN_BUY threshold consolidation (added >= MIN_BUY)
    runTest("Dynamic Rebalance Deposit: MIN_BUY consolidation into most underweight", () => {
        const holdings = [
            { name: 'AAPL', value: 150, targ_weight: 0.50 },
            { name: 'A200', value: 150, targ_weight: 0.30 },
            { name: 'BHP', value: 1000, targ_weight: 0.20 }
        ];
        const res = env.runDynaRebAlgorithm(600, holdings, 300);
        const cuts = {};
        res.assets.forEach(a => { cuts[a.name] = Math.round(a.cut); });
        // AAPL receives entire 600 because A200's pass-1 cut was 207 (< 300)
        assert.strictEqual(cuts['AAPL'], 600);
        assert.strictEqual(cuts['A200'], 0);
        assert.strictEqual(cuts['BHP'], 0);
        assert.strictEqual(res.isThresholdWarning, false); // deposit >= minBuy
    });

    // 2b. Low deposit below MIN_BUY triggers threshold warning
    runTest("Dynamic Rebalance Deposit: Deposit < MIN_BUY triggers threshold warning banner", () => {
        const holdings = [
            { name: 'AAPL', value: 150, targ_weight: 0.30 },
            { name: 'BHP', value: 70, targ_weight: 0.20 },
            { name: 'NAB', value: 175, targ_weight: 0.50 }
        ];
        const res = env.runDynaRebAlgorithm(5, holdings, 10);
        assert.strictEqual(res.isThresholdWarning, true);
        assert.strictEqual(Math.round(res.underweight.cut), 5);
    });

    // 3. Excess deposit beyond rebalance amount
    runTest("Dynamic Rebalance Deposit: Large deposit brings all assets to target and distributes excess", () => {
        const holdings = [
            { name: 'AAPL', value: 100, targ_weight: 0.50 },
            { name: 'BHP', value: 500, targ_weight: 0.50 }
        ];
        const res = env.runDynaRebAlgorithm(2000, holdings, 0);
        const cuts = {};
        res.assets.forEach(a => { cuts[a.name] = Math.round(a.cut); });
        // Total new folio = 2600. Target per asset = 1300. AAPL gets +1200, BHP gets +800.
        assert.strictEqual(cuts['AAPL'], 1200);
        assert.strictEqual(cuts['BHP'], 800);
        assert.strictEqual(res.new_folio_value, 2600);
    });

    // 4. Withdrawal sell-only rebalance
    runTest("Dynamic Rebalance Withdrawal: Sells overweight assets proportionally towards balance", () => {
        const holdings = [
            { name: 'AAPL', value: 100, targ_weight: 0.20 }, // 10% (underweight)
            { name: 'BHP', value: 500, targ_weight: 0.40 },  // 50% (overweight)
            { name: 'NAB', value: 400, targ_weight: 0.40 }   // 40% (overweight relative to min ratio)
        ];
        const res = env.runDynaRebAlgorithm(-100, holdings, 0);
        const cuts = {};
        res.assets.forEach(a => { cuts[a.name] = Math.round(a.cut); });
        assert.strictEqual(cuts['AAPL'], 0);
        assert.strictEqual(cuts['BHP'], -60);
        assert.strictEqual(cuts['NAB'], -40);
        assert.strictEqual(cuts['BHP'] + cuts['NAB'], -100);
    });

    // 5. Withdrawal with Minimum Transaction consolidation
    runTest("Dynamic Rebalance Withdrawal: Sub-minimum sell consolidated into most overweight", () => {
        const holdings = [
            { name: 'BHP', value: 530, targ_weight: 0.50 },
            { name: 'NAB', value: 470, targ_weight: 0.50 },
            { name: 'AAPL', value: 0, targ_weight: 0.00 }
        ];
        // Total = 1000. Withdrawal = -50. New = 950. Target = 475 each.
        // Ideal cuts: BHP: -55, NAB: +5 (NAB is underweight). But wait, NAB ideal sell is 0.
        // Let's use user case: BHP: 540, NAB: 460 -> Target 475. BHP excess: 65. NAB deficit: 15.
        // Withdrawal with multiple overweight candidates:
        const holdings2 = [
            { name: 'BHP', value: 550, targ_weight: 0.40 },  // Target 360, excess 190
            { name: 'NAB', value: 450, targ_weight: 0.40 },  // Target 360, excess 90
            { name: 'AAPL', value: 0, targ_weight: 0.20 }
        ];
        const res = env.runDynaRebAlgorithm(-50, holdings2, 25);
        const cuts = {};
        res.assets.forEach(a => { cuts[a.name] = Math.round(a.cut); });
        // Check that all sells are >= 25 and total sold == 50
        const totalSold = Object.values(cuts).reduce((sum, c) => sum + Math.abs(c), 0);
        assert.strictEqual(totalSold, 50);
        for (let name in cuts) {
            if (cuts[name] !== 0) {
                assert.ok(Math.abs(cuts[name]) >= 25, `${name} sell cut ${cuts[name]} should be >= 25`);
            }
        }
    });

    // 6. Complete Rebalance with buys and sells simultaneously
    runTest("Complete Rebalance: Simultaneous buys and sells maintain balance", () => {
        const holdings = [
            { name: 'AAPL', value: 300, targ_weight: 0.50 },
            { name: 'BHP', value: 700, targ_weight: 0.50 }
        ];
        // Total = 1000, Deposit = 0. New total = 1000. Target: 500 each.
        // BHP sells 200, AAPL buys 200.
        const res = env.runCompleteRebalanceAlgorithm(0, holdings, 0);
        const cuts = {};
        res.assets.forEach(a => { cuts[a.name] = Math.round(a.cut); });
        assert.strictEqual(cuts['AAPL'], 200);
        assert.strictEqual(cuts['BHP'], -200);
        assert.strictEqual(res.total_sold, 200);
        assert.strictEqual(res.total_bought, 200);
    });

    // 7. Complete Rebalance with Minimum Transaction threshold
    runTest("Complete Rebalance: Orders comply with Minimum Transaction threshold", () => {
        const holdings = [
            { name: 'AAPL', value: 290, targ_weight: 0.33 },
            { name: 'BHP', value: 370, targ_weight: 0.33 },
            { name: 'NAB', value: 340, targ_weight: 0.34 }
        ];
        const res = env.runCompleteRebalanceAlgorithm(0, holdings, 25);
        res.assets.forEach(a => {
            if (Math.abs(a.cut) > 0.005) {
                assert.ok(Math.abs(a.cut) >= 25 - 0.01, `Order for ${a.name} of ${a.cut} must be >= 25`);
            }
        });
    });

    // 8. Single holding portfolio (100% target weight)
    runTest("Single holding portfolio at 100% weight handles deposits and withdrawals", () => {
        const holdings = [{ name: 'VGS', value: 1000, targ_weight: 1.00 }];
        const resDeposit = env.runDynaRebAlgorithm(500, holdings, 0);
        assert.strictEqual(Math.round(resDeposit.assets[0].cut), 500);

        const resWithdraw = env.runDynaRebAlgorithm(-300, holdings, 0);
        assert.strictEqual(Math.round(resWithdraw.assets[0].cut), -300);
    });

    // 9. Full liquidation
    runTest("Withdrawal equal to entire portfolio liquidates to $0", () => {
        const holdings = [
            { name: 'AAPL', value: 400, targ_weight: 0.50 },
            { name: 'BHP', value: 600, targ_weight: 0.50 }
        ];
        const res = env.runDynaRebAlgorithm(-1000, holdings, 0);
        const finalVal = res.assets.reduce((sum, a) => sum + (a.value + a.cut), 0);
        assert.strictEqual(Math.round(finalVal), 0);
    });

    // 10. Penny precision rounding (33.33 / 33.33 / 33.34)
    runTest("Penny precision rounding with uneven decimal weights", () => {
        const holdings = [
            { name: 'A', value: 100, targ_weight: 0.3333 },
            { name: 'B', value: 100, targ_weight: 0.3333 },
            { name: 'C', value: 100, targ_weight: 0.3334 }
        ];
        const res = env.runCompleteRebalanceAlgorithm(100, holdings, 0);
        const sumFinal = res.assets.reduce((sum, a) => sum + (a.value + a.cut), 0);
        assert.ok(Math.abs(sumFinal - 400) < 0.02, `Sum of final values (${sumFinal}) must equal 400`);
    });

    // 11. Proportional Normalization when target weights sum to < 100%
    runTest("Proportional Normalization: Weights < 100% are displayed in pre-normalized terms and balanced proportionally", () => {
        env.setInputs({ deposit: '100', minBuy: '0', complete: false });
        env.setHoldings([
            { t: 'AAPL', v: '500', w: '30' },
            { t: 'BHP', v: '500', w: '20' }  // total = 50%
        ]);
        env.calculateRebalance();
        assert.deepStrictEqual(env.getErrorMessages(), []);

        const normNotice = env.getEl("normNotice");
        assert.strictEqual(normNotice.style.display, "block");
        assert.ok(normNotice.innerHTML.includes("50.0%"));
        assert.ok(normNotice.innerHTML.includes("Before and after percentages are displayed relative to your 50.0% target allocation"));

        // Check that AAPL received the deposit because 30/50 = 60% > 50% current weight
        const allocList = env.getEl("allocationList");
        assert.ok(allocList.innerHTML.includes("AAPL"));
        assert.ok(allocList.innerHTML.includes("+$100.00"));
        // AAPL pre-normalized: 50% * 0.5 = 25.0% -> 600/1100 * 0.5 = 27.3%, target 30.0%
        assert.ok(allocList.innerHTML.includes("Before: <strong>25.0%</strong> → After: <strong style=\"color: var(--accent);\">27.3%</strong>"));
        assert.ok(allocList.innerHTML.includes("Target: <strong>30.0%</strong>"));
        // BHP pre-normalized: 50% * 0.5 = 25.0% -> 500/1100 * 0.5 = 22.7%, target 20.0%
        assert.ok(allocList.innerHTML.includes("Before: <strong>25.0%</strong> → After: <strong style=\"color: var(--accent);\">22.7%</strong>"));
        assert.ok(allocList.innerHTML.includes("Target: <strong>20.0%</strong>"));
    });
}

// =========================================================================
// PART 4: INFORMATION GUIDE MODAL & CHROME TAB NAVIGATION
// =========================================================================
console.log("\n--- PART 4: Information Guide Modal & Chrome Tab Navigation ---");

{
    const env = createTestEnv();

    // 1. openInfoModal adds active class and hides body overflow
    runTest("openInfoModal() activates overlay and locks body scroll", () => {
        const overlay = env.getEl("infoModalOverlay");
        assert.strictEqual(overlay.classList.contains("active"), false);
        env.openInfoModal();
        assert.strictEqual(overlay.classList.contains("active"), true);
        assert.strictEqual(env.sandbox.document.body.style.overflow, "hidden");
    });

    // 2. closeInfoModal removes active class and restores body overflow
    runTest("closeInfoModal() deactivates overlay and restores body scroll", () => {
        const overlay = env.getEl("infoModalOverlay");
        env.openInfoModal();
        assert.strictEqual(overlay.classList.contains("active"), true);
        env.closeInfoModal();
        assert.strictEqual(overlay.classList.contains("active"), false);
        assert.strictEqual(env.sandbox.document.body.style.overflow, "");
    });

    // 3. Backdrop click closes modal only when clicking overlay itself
    runTest("Backdrop click closes modal when clicking overlay background", () => {
        const overlay = env.getEl("infoModalOverlay");
        env.openInfoModal();
        assert.strictEqual(overlay.classList.contains("active"), true);

        // Clicking inside modal content does not close
        env.handleModalBackdropClick({ target: { id: "someInnerCard" } });
        assert.strictEqual(overlay.classList.contains("active"), true);

        // Clicking overlay directly closes
        env.handleModalBackdropClick({ target: { id: "infoModalOverlay" } });
        assert.strictEqual(overlay.classList.contains("active"), false);
    });

    // 4. Escape key closes modal
    runTest("Escape keydown event closes modal when active", () => {
        const overlay = env.getEl("infoModalOverlay");
        env.openInfoModal();
        assert.strictEqual(overlay.classList.contains("active"), true);

        // Non-escape key does not close
        env.dispatchDocumentEvent({ type: "keydown", key: "Enter" });
        assert.strictEqual(overlay.classList.contains("active"), true);

        // Escape key closes
        env.dispatchDocumentEvent({ type: "keydown", key: "Escape" });
        assert.strictEqual(overlay.classList.contains("active"), false);
    });

    // 5. Chrome Tab Navigation switches active tabs and panels
    runTest("switchInfoTab() switches active Chrome tab button and content pane", () => {
        const btnOverview = env.getEl("tab-btn-overview");
        const paneOverview = env.getEl("tab-pane-overview");
        const btnDynamic = env.getEl("tab-btn-dynamic");
        const paneDynamic = env.getEl("tab-pane-dynamic");
        const btnComplete = env.getEl("tab-btn-complete");
        const paneComplete = env.getEl("tab-pane-complete");

        // Switch to dynamic
        env.switchInfoTab("dynamic");
        assert.strictEqual(btnDynamic.classList.contains("active"), true);
        assert.strictEqual(paneDynamic.classList.contains("active"), true);
        assert.strictEqual(btnOverview.classList.contains("active"), false);
        assert.strictEqual(paneOverview.classList.contains("active"), false);

        // Switch to complete
        env.switchInfoTab("complete");
        assert.strictEqual(btnComplete.classList.contains("active"), true);
        assert.strictEqual(paneComplete.classList.contains("active"), true);
        assert.strictEqual(btnDynamic.classList.contains("active"), false);
        assert.strictEqual(paneDynamic.classList.contains("active"), false);

        // Switch to disclaimers
        const btnDisclaimer = env.getEl("tab-btn-disclaimers");
        const paneDisclaimer = env.getEl("tab-pane-disclaimers");
        env.switchInfoTab("disclaimers");
        assert.strictEqual(btnDisclaimer.classList.contains("active"), true);
        assert.strictEqual(paneDisclaimer.classList.contains("active"), true);
        assert.strictEqual(btnComplete.classList.contains("active"), false);
        assert.strictEqual(paneComplete.classList.contains("active"), false);
    });
}

    // =========================================================================
    // PART 5: ZERO-KNOWLEDGE CLIENT CRYPTOGRAPHIC ENGINE
    // =========================================================================
    console.log("\n--- PART 5: Zero-Knowledge Client Cryptographic Engine ---");

    {
        const env = createTestEnv();
        const crypto = env.RebalanceCrypto;

        // 1. Dual-key derivation produces deterministic authHash and encryptionKey
        await runTest("RebalanceCrypto.deriveKeys() deterministically derives authHash and encryptionKey", async () => {
            const res1 = await crypto.deriveKeys("Alice@example.com", "SecretPass123!");
            const res2 = await crypto.deriveKeys("alice@example.com ", "SecretPass123!"); // case & trim normalization
            assert.strictEqual(res1.authHash, res2.authHash);
            assert.strictEqual(res1.authHash.length, 64);
            assert.ok(res1.encryptionKey instanceof Object);
        });

        // 2. Cryptographic separation & non-extractability
        await runTest("Key separation & non-extractability: encryptionKey is non-extractable and isolated from authHash", async () => {
            const res = await crypto.deriveKeys("Alice@example.com", "SecretPass123!");
            assert.strictEqual(res.encryptionKey.extractable, false, "encryptionKey must be non-extractable for memory protection");
            assert.strictEqual(res.encryptionKey.algorithm.name, "AES-GCM");
            assert.strictEqual(res.encryptionKey.algorithm.length, 256);
            assert.strictEqual(typeof res.authHash, "string");
            assert.strictEqual(res.authHash.length, 64);
        });

        // 3. Roundtrip portfolio encryption and decryption
        await runTest("Roundtrip portfolio encryption and decryption restores exact data", async () => {
            const keys = await crypto.deriveKeys("Bob@example.com", "MyPortfolioKey#1");
            const portfolio = {
                deposit: 500,
                minBuy: 25,
                complete: false,
                holdings: [
                    { name: 'AAPL', value: 1500, targ_weight: 0.5 },
                    { name: 'BHP.AX', value: 1500, targ_weight: 0.5 }
                ]
            };

            const envelope = await crypto.encryptPortfolio(portfolio, keys.encryptionKey);
            assert.strictEqual(envelope.v, 1);
            assert.ok(envelope.iv && typeof envelope.iv === 'string');
            assert.ok(envelope.data && typeof envelope.data === 'string');

            const decrypted = await crypto.decryptPortfolio(envelope, keys.encryptionKey);
            assert.deepStrictEqual(decrypted, portfolio);
        });

        // 4. Semantic security (IND-CPA): encrypting same data twice produces completely different ciphertexts
        await runTest("Semantic security: encrypting identical portfolio twice yields different ciphertexts", async () => {
            const keys = await crypto.deriveKeys("Charlie@example.com", "PasswordABC");
            const portfolio = { holdings: [{ name: 'VGS', value: 10000, targ_weight: 1.0 }] };

            const envelope1 = await crypto.encryptPortfolio(portfolio, keys.encryptionKey);
            const envelope2 = await crypto.encryptPortfolio(portfolio, keys.encryptionKey);

            assert.notStrictEqual(envelope1.iv, envelope2.iv);
            assert.notStrictEqual(envelope1.data, envelope2.data);

            // Both decrypt to identical data
            const dec1 = await crypto.decryptPortfolio(envelope1, keys.encryptionKey);
            const dec2 = await crypto.decryptPortfolio(envelope2, keys.encryptionKey);
            assert.deepStrictEqual(dec1, dec2);
        });

        // 5. Wrong password / key rejection (Integrity check)
        await runTest("Decryption fails with incorrect encryption key", async () => {
            const keysAlice = await crypto.deriveKeys("Alice@example.com", "PasswordA");
            const keysBob = await crypto.deriveKeys("Bob@example.com", "PasswordB");

            const envelope = await crypto.encryptPortfolio({ secret: 42 }, keysAlice.encryptionKey);

            let failed = false;
            try {
                await crypto.decryptPortfolio(envelope, keysBob.encryptionKey);
            } catch (err) {
                failed = true;
                assert.ok(err.message.includes("Decryption failed"));
            }
            assert.strictEqual(failed, true, "Decryption with wrong key must fail");
        });

        // 6. Tamper resistance: modified ciphertext shatters authentication tag
        await runTest("Tamper resistance: modified ciphertext byte causes immediate rejection", async () => {
            const keys = await crypto.deriveKeys("David@example.com", "SafePass123");
            const envelope = await crypto.encryptPortfolio({ ticker: "TSLA", shares: 100 }, keys.encryptionKey);

            // Tamper with one character of the base64 ciphertext
            const originalData = envelope.data;
            const tamperedData = (originalData[0] === 'A' ? 'B' : 'A') + originalData.slice(1);
            const tamperedEnvelope = { ...envelope, data: tamperedData };

            let failed = false;
            try {
                await crypto.decryptPortfolio(tamperedEnvelope, keys.encryptionKey);
            } catch (err) {
                failed = true;
                assert.ok(err.message.includes("Decryption failed"));
            }
            assert.strictEqual(failed, true, "Tampered ciphertext must be rejected");
        });

        // 7. Input validation on missing or corrupted arguments
        await runTest("Input validation rejects invalid credentials or corrupted envelope format", async () => {
            await assert.rejects(async () => await crypto.deriveKeys("", "pass"), /valid email/);
            await assert.rejects(async () => await crypto.deriveKeys("email", ""), /valid password/);
            await assert.rejects(async () => await crypto.encryptPortfolio(null, {}), /must be an object/);
            await assert.rejects(async () => await crypto.decryptPortfolio({ v: 2 }, {}), /unsupported version/);
        });
    }

    // =========================================================================
    // PART 6: ACCOUNT & VAULT UI, LOCAL SESSION & BACKUP ENGINE
    // =========================================================================
    console.log("\n--- PART 6: Account & Vault UI, Local Session & Backup Engine ---");

    {
        const env = createTestEnv();

        // 1. Account Modal open and close
        await runTest("openAccountModal() activates overlay and locks body scroll", () => {
            const overlay = env.getEl("accountModalOverlay");
            assert.strictEqual(overlay.classList.contains("active"), false);
            env.openAccountModal();
            assert.strictEqual(overlay.classList.contains("active"), true);
            assert.strictEqual(env.sandbox.document.body.style.overflow, "hidden");
        });

        await runTest("closeAccountModal() deactivates overlay and restores body scroll", () => {
            const overlay = env.getEl("accountModalOverlay");
            env.openAccountModal();
            assert.strictEqual(overlay.classList.contains("active"), true);
            env.closeAccountModal();
            assert.strictEqual(overlay.classList.contains("active"), false);
            assert.strictEqual(env.sandbox.document.body.style.overflow, "");
        });

        await runTest("handleAccountBackdropClick() closes modal on backdrop click", () => {
            const overlay = env.getEl("accountModalOverlay");
            env.openAccountModal();
            assert.strictEqual(overlay.classList.contains("active"), true);

            // Inner click should not close
            env.handleAccountBackdropClick({ target: { id: "accountCard" } });
            assert.strictEqual(overlay.classList.contains("active"), true);

            // Overlay click closes
            env.handleAccountBackdropClick({ target: { id: "accountModalOverlay" } });
            assert.strictEqual(overlay.classList.contains("active"), false);
        });

        await runTest("Escape keydown event closes account modal when active", () => {
            const overlay = env.getEl("accountModalOverlay");
            env.openAccountModal();
            assert.strictEqual(overlay.classList.contains("active"), true);

            env.dispatchDocumentEvent({ type: "keydown", key: "Enter" });
            assert.strictEqual(overlay.classList.contains("active"), true);

            env.dispatchDocumentEvent({ type: "keydown", key: "Escape" });
            assert.strictEqual(overlay.classList.contains("active"), false);
        });

        // 2. Chrome Tab Navigation in Account Modal
        await runTest("switchAccountTab() switches active tab buttons and panes", () => {
            const btnStatus = env.getEl("tab-btn-acc-status");
            const paneStatus = env.getEl("tab-pane-acc-status");
            const btnSignIn = env.getEl("tab-btn-acc-signin");
            const paneSignIn = env.getEl("tab-pane-acc-signin");
            const btnSignUp = env.getEl("tab-btn-acc-signup");
            const paneSignUp = env.getEl("tab-pane-acc-signup");

            env.switchAccountTab("signin");
            assert.strictEqual(btnSignIn.classList.contains("active"), true);
            assert.strictEqual(paneSignIn.classList.contains("active"), true);
            assert.strictEqual(btnStatus.classList.contains("active"), false);
            assert.strictEqual(paneStatus.classList.contains("active"), false);

            env.switchAccountTab("signup");
            assert.strictEqual(btnSignUp.classList.contains("active"), true);
            assert.strictEqual(paneSignUp.classList.contains("active"), true);
            assert.strictEqual(btnSignIn.classList.contains("active"), false);
            assert.strictEqual(paneSignIn.classList.contains("active"), false);

            env.switchAccountTab("status");
            assert.strictEqual(btnStatus.classList.contains("active"), true);
            assert.strictEqual(paneStatus.classList.contains("active"), true);
        });

        // 3. Client Account Sign Up Validation & Creation
        await runTest("handleSignUpSubmit() enforces email validation, password length, and password confirmation", async () => {
            const feedback = env.getEl("signUpFeedback");

            // Invalid email
            env.getEl("signUpEmail").value = "notanemail";
            env.getEl("signUpPassword").value = "validpass123";
            env.getEl("signUpConfirmPassword").value = "validpass123";
            await env.handleSignUpSubmit();
            assert.ok(feedback.innerText.includes("valid email address"));

            // Short password
            env.getEl("signUpEmail").value = "user@example.com";
            env.getEl("signUpPassword").value = "short";
            env.getEl("signUpConfirmPassword").value = "short";
            await env.handleSignUpSubmit();
            assert.ok(feedback.innerText.includes("at least 8 characters"));

            // Mismatched passwords
            env.getEl("signUpEmail").value = "user@example.com";
            env.getEl("signUpPassword").value = "securepassword1";
            env.getEl("signUpConfirmPassword").value = "differentpassword2";
            await env.handleSignUpSubmit();
            assert.ok(feedback.innerText.includes("Passwords do not match"));
        });

        await runTest("handleSignUpSubmit() creates encrypted account vault and updates session UI", async () => {
            const accountBtn = env.getEl("accountBtn");
            const badge = env.getEl("accStatusBadge");
            const btnSignOut = env.getEl("btnSignOut");

            env.setInputs({ deposit: 1000, minBuy: 50, complete: false });
            env.setHoldings([{ t: "BTC", v: "5000", w: "50" }, { t: "ETH", v: "5000", w: "50" }]);

            env.getEl("signUpEmail").value = "Investor@Example.com"; // verify case normalization
            env.getEl("signUpPassword").value = "VaultMaster2026!";
            env.getEl("signUpConfirmPassword").value = "VaultMaster2026!";

            await env.handleSignUpSubmit();

            const cur = env.getCurrentAccount();
            assert.ok(cur !== null);
            assert.strictEqual(cur.email, "investor@example.com");
            assert.strictEqual(accountBtn.classList.contains("logged-in"), true);
            assert.strictEqual(badge.innerText, "Encrypted");
            assert.strictEqual(btnSignOut.style.display, "flex");

            // Verify account stored in localStorage
            const stored = JSON.parse(env.sandbox.localStorage.getItem("rebalance_accounts"));
            assert.ok(stored["investor@example.com"] !== undefined);
            assert.ok(stored["investor@example.com"].vault.data !== undefined);

            // Re-attempt duplicate signup
            await env.handleSignUpSubmit();
            const feedback = env.getEl("signUpFeedback");
            assert.ok(feedback.innerText.includes("already exists"));
        });

        // 4. Sign Out and Sign In workflow
        await runTest("handleSignOut() clears session state and resets UI to Guest mode", () => {
            env.handleSignOut();
            assert.strictEqual(env.getCurrentAccount(), null);
            assert.strictEqual(env.getEl("accountBtn").classList.contains("logged-in"), false);
            assert.strictEqual(env.getEl("accStatusBadge").innerText, "Stored Locally");
            assert.strictEqual(env.getEl("btnSignOut").style.display, "none");
        });

        await runTest("handleSignInSubmit() rejects unknown email or invalid master password", async () => {
            const feedback = env.getEl("signInFeedback");

            // Unknown email
            env.getEl("signInEmail").value = "stranger@example.com";
            env.getEl("signInPassword").value = "anypassword";
            await env.handleSignInSubmit();
            assert.ok(feedback.innerText.includes("No account found"));

            // Wrong password
            env.getEl("signInEmail").value = "investor@example.com";
            env.getEl("signInPassword").value = "WrongPassword999!";
            await env.handleSignInSubmit();
            assert.ok(feedback.innerText.includes("Incorrect master password"));
        });

        await runTest("handleSignInSubmit() unlocks vault with correct master password and restores state", async () => {
            // Modify local inputs to test restoration
            env.setInputs({ deposit: 0, minBuy: 0 });
            env.setHoldings([{ t: "DUMMY", v: "1", w: "100" }]);

            env.getEl("signInEmail").value = "investor@example.com";
            env.getEl("signInPassword").value = "VaultMaster2026!";
            await env.handleSignInSubmit();

            const cur = env.getCurrentAccount();
            assert.ok(cur !== null);
            assert.strictEqual(cur.email, "investor@example.com");
            assert.strictEqual(env.getEl("accountBtn").classList.contains("logged-in"), true);

            // Verify portfolio state restored from encrypted vault
            assert.strictEqual(env.getEl("deposit").value, "1000");
            assert.strictEqual(env.getEl("minBuy").value, "50");
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);
            assert.strictEqual(holdings[0].t, "BTC");
        });

        // 5. Encrypted Backup Export and Restore
        await runTest("exportEncryptedBackupData() exports AES-256 envelope and importEncryptedBackupData() restores state", async () => {
            // Change state
            env.setInputs({ deposit: 2500, minBuy: 100 });
            env.setHoldings([
                { t: "VGS", v: "15000", w: "70" },
                { t: "VAS", v: "5000", w: "30" }
            ]);

            // Export backup
            const backup = await env.exportEncryptedBackupData("BackupPassphrase789!");
            assert.strictEqual(backup.type, "rebalance_encrypted_backup");
            assert.strictEqual(backup.version, 1);
            assert.ok(backup.payload.iv && backup.payload.data);

            // Clear portfolio
            env.setInputs({ deposit: 0, minBuy: 0 });
            env.setHoldings([]);

            // Restore from backup
            const restored = await env.importEncryptedBackupData(backup, "BackupPassphrase789!");
            assert.strictEqual(restored.deposit, "2500");
            assert.strictEqual(restored.minBuy, "100");
            assert.strictEqual(restored.holdings[0].t, "VGS");
            assert.strictEqual(env.getEl("deposit").value, "2500");
        });

        await runTest("importEncryptedBackupData() rejects corrupted backup or incorrect password", async () => {
            const backup = await env.exportEncryptedBackupData("CorrectPassword123!");
            await assert.rejects(
                async () => await env.importEncryptedBackupData(backup, "WrongPassword456!"),
                /Decryption failed|incorrect password/
            );
        });
    }

    // =========================================================================
    // PART 7: FORWARD-COMPATIBLE SCHEMA, REBALANCESYNC & EMERGENCY RECOVERY KEYS
    // =========================================================================
    console.log("\n--- PART 7: Forward-Compatible Schema, RebalanceSync & Emergency Recovery Keys ---");

    {
        const env = createTestEnv();
        const crypto = env.RebalanceCrypto;
        const sync = env.RebalanceSync;

        // 1. Recovery Key generation format and entropy
        await runTest("RebalanceCrypto.generateRecoveryKey() generates valid 24-character high-entropy formatted key", () => {
            const key1 = crypto.generateRecoveryKey();
            const key2 = crypto.generateRecoveryKey();
            assert.notStrictEqual(key1, key2);
            assert.strictEqual(key1.length, 29); // 24 chars + 5 dashes
            const parts = key1.split('-');
            assert.strictEqual(parts.length, 6);
            parts.forEach(p => {
                assert.strictEqual(p.length, 4);
                assert.ok(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/.test(p), `Invalid charset in part: ${p}`);
            });
        });

        // 2. Recovery Key encryption & decryption roundtrip
        await runTest("RebalanceCrypto.deriveRecoveryEncryptionKey() provides roundtrip envelope security", async () => {
            const email = "recovery_test@example.com";
            const recKey = crypto.generateRecoveryKey();
            const recEncKey = await crypto.deriveRecoveryEncryptionKey(email, recKey);

            const testData = { holdings: [{ t: "IVV", v: "1000", w: "100" }], deposit: "500", minBuy: "0" };
            const envelope = await crypto.encryptPortfolio(testData, recEncKey);
            assert.ok(envelope.iv && envelope.data);

            const decrypted = await crypto.decryptPortfolio(envelope, recEncKey);
            assert.deepStrictEqual(decrypted, testData);
        });

        // 3. Forward-compatible account schema on signup
        await runTest("handleSignUpSubmit() initializes all forward-compatible schema version 2 fields", async () => {
            env.getEl("signUpEmail").value = "future_proof@example.com";
            env.getEl("signUpPassword").value = "MasterPassword2026!";
            env.getEl("signUpConfirmPassword").value = "MasterPassword2026!";
            await env.handleSignUpSubmit();

            const acc = await sync.getAccount("future_proof@example.com");
            assert.ok(acc !== null);
            assert.strictEqual(acc.schemaVersion, 2);
            assert.strictEqual(acc.vaultVersion, 1);
            assert.strictEqual(acc.tier, "free");
            assert.strictEqual(acc.recoveryEnvelope, null);
            assert.strictEqual(acc.stripeCustomerId, null);
            assert.strictEqual(acc.subscriptionStatus, "none");
            assert.strictEqual(acc.subscriptionExpiresAt, null);
            assert.strictEqual(typeof acc.preferences, "object");
            assert.strictEqual(acc.preferences.currency, "USD");
            assert.strictEqual(acc.preferences.autoSync, true);
            assert.ok(acc.createdAt && acc.updatedAt && acc.lastLoginAt);

            // UI tier badge
            assert.strictEqual(env.getEl("accTierBadge").style.display, "inline-flex");
            assert.strictEqual(env.getEl("accTierBadge").innerText, "FREE PLAN");
            assert.strictEqual(env.getEl("btnGenRecoveryKey").style.display, "flex");
        });

        // 4. Emergency Recovery Key generation and saving
        let savedRecoveryKey = "";
        await runTest("handleGenerateRecoveryKey() creates recovery envelope and updates account record", async () => {
            await env.handleGenerateRecoveryKey();

            const codeEl = env.getEl("recoveryKeyCode");
            savedRecoveryKey = codeEl.innerText.trim();
            assert.ok(savedRecoveryKey.length === 29);
            assert.strictEqual(env.getEl("recoveryKeyDisplayBox").style.display, "block");

            const acc = await sync.getAccount("future_proof@example.com");
            assert.ok(acc.recoveryEnvelope !== null);
            assert.ok(acc.recoveryEnvelope.iv && acc.recoveryEnvelope.data);
            assert.strictEqual(env.getEl("btnGenRecoveryKey").innerText, "Regenerate Emergency Recovery Key");
        });

        // 5. Account Recovery flow (forgot password)
        await runTest("handleRecoverAccount() resets password and unlocks vault with Emergency Recovery Key", async () => {
            // Sign out first
            env.handleSignOut();
            assert.strictEqual(env.getCurrentAccount(), null);

            // Populate recovery form in sign-in tab
            env.getEl("signInEmail").value = "future_proof@example.com";
            env.getEl("recoveryKeyInput").value = savedRecoveryKey;
            env.getEl("recoveryNewPassword").value = "BrandNewMasterPassword2026!";

            await env.handleRecoverAccount();

            const cur = env.getCurrentAccount();
            assert.ok(cur !== null, "User should be signed in after successful recovery");
            assert.strictEqual(cur.email, "future_proof@example.com");

            // Verify account record was updated
            const acc = await sync.getAccount("future_proof@example.com");
            assert.strictEqual(acc.vaultVersion, 2, "vaultVersion should increment on re-encryption");

            // Verify old password no longer works
            env.handleSignOut();
            env.getEl("signInEmail").value = "future_proof@example.com";
            env.getEl("signInPassword").value = "MasterPassword2026!";
            await env.handleSignInSubmit();
            assert.ok(env.getEl("signInFeedback").innerText.includes("Incorrect master password"));

            // Verify new password unlocks vault
            env.getEl("signInPassword").value = "BrandNewMasterPassword2026!";
            await env.handleSignInSubmit();
            assert.strictEqual(env.getCurrentAccount().email, "future_proof@example.com");
            assert.strictEqual(env.getEl("accountBtn").classList.contains("logged-in"), true);
        });

        // 6. Recovery error validation
        await runTest("handleRecoverAccount() rejects invalid recovery key or short new password", async () => {
            env.handleSignOut();

            // Wrong recovery key
            env.getEl("signInEmail").value = "future_proof@example.com";
            env.getEl("recoveryKeyInput").value = "ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZ";
            env.getEl("recoveryNewPassword").value = "BrandNewValidPass123!";
            await env.handleRecoverAccount();
            assert.ok(env.getEl("signInFeedback").innerText.includes("Recovery failed"));

            // Too short password (< 8 chars)
            env.getEl("recoveryKeyInput").value = savedRecoveryKey;
            env.getEl("recoveryNewPassword").value = "short";
            await env.handleRecoverAccount();
            assert.ok(env.getEl("signInFeedback").innerText.includes("at least 8 characters"));
        });

        // 7. Schema auto-migration for legacy accounts
        await runTest("handleSignInSubmit() automatically normalizes legacy v1 accounts to schema v2", async () => {
            // Seed a legacy account with only v1 fields
            const legacyAccounts = env.getStoredAccounts();
            const legacyKeys = await crypto.deriveKeys("legacy_user@example.com", "LegacyPass123!");
            const legacyVault = await crypto.encryptPortfolio({ holdings: [] }, legacyKeys.encryptionKey);
            legacyAccounts["legacy_user@example.com"] = {
                email: "legacy_user@example.com",
                authHash: legacyKeys.authHash,
                vault: legacyVault,
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z"
            };
            env.setStoredAccounts(legacyAccounts);

            // Sign in
            env.getEl("signInEmail").value = "legacy_user@example.com";
            env.getEl("signInPassword").value = "LegacyPass123!";
            await env.handleSignInSubmit();

            // Check normalized fields
            const updated = await sync.getAccount("legacy_user@example.com");
            assert.strictEqual(updated.schemaVersion, 2);
            assert.strictEqual(updated.tier, "free");
            assert.strictEqual(updated.vaultVersion, 1);
            assert.strictEqual(updated.preferences.currency, "USD");
            assert.ok(updated.lastLoginAt);
        });

        // 8. RebalanceSync.syncVault increments vault version
        await runTest("RebalanceSync.syncVault() persists new vault ciphertext and increments vaultVersion", async () => {
            const email = "future_proof@example.com";
            const before = await sync.getAccount(email);
            const initialVersion = before.vaultVersion;

            const dummyVault = { iv: "sync_iv", data: "sync_data" };
            await sync.syncVault(email, dummyVault);

            const after = await sync.getAccount(email);
            assert.strictEqual(after.vault.data, "sync_data");
            assert.strictEqual(after.vaultVersion, initialVersion + 1);
            assert.ok(new Date(after.updatedAt).getTime() >= new Date(before.updatedAt).getTime());
        });

        // 9. Persistent Session Management on Sign In & Sign Up
        await runTest("handleSignInSubmit() saves session with rawKeyHex in localStorage", async () => {
            // Restore a valid encrypted vault for future_proof@example.com
            const keys = await crypto.deriveKeys("future_proof@example.com", "BrandNewMasterPassword2026!");
            const validVault = await crypto.encryptPortfolio({ holdings: [{ t: "VTI", v: "1000", w: "100" }] }, keys.encryptionKey);
            await sync.syncVault("future_proof@example.com", validVault);

            env.getEl("signInEmail").value = "future_proof@example.com";
            env.getEl("signInPassword").value = "BrandNewMasterPassword2026!";
            await env.handleSignInSubmit();

            const session = env.getSession();
            assert.ok(session !== null, "Session should exist in localStorage");
            assert.strictEqual(session.email, "future_proof@example.com");
            assert.ok(session.rawKeyHex && session.rawKeyHex.length === 64, "Should store 256-bit raw key hex");
            assert.ok(session.authHash && session.authHash.length === 64, "Should store authHash");
        });

        // 10. restoreSession() restores currentAccount and UI across simulated page reload
        await runTest("restoreSession() seamlessly restores account state and unlocks vault on page reload", async () => {
            // Simulate reload: clear currentAccount in-memory without clearing localStorage
            env.setCurrentAccount(null);
            assert.strictEqual(env.getCurrentAccount(), null);

            // Call restoreSession (as triggered by DOMContentLoaded)
            const restored = await env.restoreSession();
            assert.ok(restored !== null, "Should return restored account");
            assert.strictEqual(restored.email, "future_proof@example.com");
            assert.strictEqual(env.getCurrentAccount().email, "future_proof@example.com");
            assert.strictEqual(env.getEl("accountBtn").classList.contains("logged-in"), true);
            assert.strictEqual(env.getEl("accTierBadge").style.display, "inline-flex");
            assert.strictEqual(env.getEl("accUserDisplay").innerText, "future_proof@example.com");
            assert.strictEqual(env.getHoldings()[0].t, "VTI");
        });

        // 11. handleSignOut() removes session and returns to Guest mode
        await runTest("handleSignOut() clears localStorage session and resets UI to guest", () => {
            env.handleSignOut();
            assert.strictEqual(env.getCurrentAccount(), null);
            assert.strictEqual(env.getSession(), null, "rebalance_session should be removed");
            assert.strictEqual(env.getEl("accountBtn").classList.contains("logged-in"), false);
            assert.strictEqual(env.getEl("accStatusBadge").innerText, "Stored Locally");
        });

        // 12. restoreSession() rejects invalid or tampered session
        await runTest("restoreSession() safely ignores and clears corrupt or tampered session", async () => {
            env.saveSession("future_proof@example.com", "deadbeef", "tampered_auth_hash");
            const result = await env.restoreSession();
            assert.strictEqual(result, null, "Tampered session should fail to restore");
            assert.strictEqual(env.getCurrentAccount(), null);
            assert.strictEqual(env.getSession(), null, "Invalid session should be removed");
        });
        // =========================================================================
        // PART 8: SETTINGS & PREFERENCES MODAL, CURRENCY & VALUE-CONSERVING ROUNDING
        // =========================================================================
        console.log("\n--- PART 8: Settings & Preferences Modal, Currency & Value-Conserving Rounding ---");

        // 1. openSettingsModal / closeSettingsModal
        runTest("openSettingsModal() activates overlay and locks body scroll", () => {
            env.openSettingsModal();
            const overlay = env.getEl("settingsModalOverlay");
            assert.ok(overlay.classList.contains("active"));
            assert.strictEqual(env.sandbox.document.body.style.overflow, "hidden");
        });

        runTest("closeSettingsModal() deactivates overlay and restores body scroll", () => {
            env.closeSettingsModal();
            const overlay = env.getEl("settingsModalOverlay");
            assert.ok(!overlay.classList.contains("active"));
            assert.strictEqual(env.sandbox.document.body.style.overflow, "");
        });

        runTest("handleSettingsBackdropClick() closes modal on backdrop click", () => {
            env.openSettingsModal();
            env.handleSettingsBackdropClick({ target: { id: "settingsModalOverlay" } });
            const overlay = env.getEl("settingsModalOverlay");
            assert.ok(!overlay.classList.contains("active"));
        });

        runTest("Escape keydown event closes settings modal when active", () => {
            env.openSettingsModal();
            const overlay = env.getEl("settingsModalOverlay");
            assert.ok(overlay.classList.contains("active"));
            env.dispatchDocumentEvent({ type: "keydown", key: "Escape" });
            assert.ok(!overlay.classList.contains("active"));
        });

        runTest("switchSettingsTab() switches active tab buttons and panes", () => {
            env.switchSettingsTab("sync");
            assert.ok(env.getEl("tab-btn-set-sync").classList.contains("active"));
            assert.ok(env.getEl("tab-pane-set-sync").classList.contains("active"));
            assert.ok(!env.getEl("tab-btn-set-pref").classList.contains("active"));
            assert.ok(!env.getEl("tab-pane-set-pref").classList.contains("active"));

            env.switchSettingsTab("pref");
            assert.ok(env.getEl("tab-btn-set-pref").classList.contains("active"));
            assert.ok(env.getEl("tab-pane-set-pref").classList.contains("active"));
        });

        runTest("onSettingThemeToggle() updates document theme and localStorage", () => {
            env.onSettingThemeToggle(false); // light
            assert.strictEqual(env.sandbox.localStorage.getItem("rebalancer_theme"), "light");
            env.onSettingThemeToggle(true); // dark
            assert.strictEqual(env.sandbox.localStorage.getItem("rebalancer_theme"), "dark");
        });

        runTest("onSettingCurrencyChange() updates currency symbol across inputs and calculations", () => {
            env.onSettingCurrencyChange("€");
            assert.strictEqual(env.getCurrencySymbol(), "€");
            env.setInputs({ deposit: '100', minBuy: '0', complete: false });
            env.setHoldings([
                { t: 'VOO', v: '1000', w: '50' },
                { t: 'BND', v: '1000', w: '50' }
            ]);
            env.calculateRebalance();
            const initialEl = env.getEl("statInitial");
            assert.ok(initialEl.innerText.includes("€"), `statInitial (${initialEl.innerText}) should include €`);
            // Reset to $
            env.onSettingCurrencyChange("$");
            assert.strictEqual(env.getCurrencySymbol(), "$");
        });

        runTest("applyWholeDollarRounding() strictly preserves total deposit with zero leaked or extra dollars (Dynamic)", () => {
            const assets = [
                { name: 'A', cut: 33.333 },
                { name: 'B', cut: 33.333 },
                { name: 'C', cut: 33.334 }
            ];
            env.applyWholeDollarRounding(assets, 100, false);
            const sumCuts = assets.reduce((s, a) => s + a.cut, 0);
            assert.strictEqual(sumCuts, 100, `Sum of rounded cuts (${sumCuts}) must exactly equal 100`);
            assets.forEach(a => {
                assert.strictEqual(Math.floor(a.cut), a.cut, `Asset ${a.name} cut (${a.cut}) must be whole dollar integer`);
            });
        });

        runTest("applyWholeDollarRounding() strictly preserves net cash balance in Complete Rebalance", () => {
            const assets = [
                { name: 'A', cut: -49.6 }, // Sell 49.6
                { name: 'B', cut: 49.6 }   // Buy 49.6 (Deposit = 0)
            ];
            env.applyWholeDollarRounding(assets, 0, true);
            const sumCuts = assets.reduce((s, a) => s + a.cut, 0);
            assert.strictEqual(sumCuts, 0, `Sum of rounded complete rebalance cuts (${sumCuts}) must equal 0`);
            assets.forEach(a => {
                assert.strictEqual(Math.floor(Math.abs(a.cut)), Math.abs(a.cut), `Asset ${a.name} cut (${a.cut}) must be integer`);
            });
        });

        runTest("handleResetToExample() restores example assets and re-renders", () => {
            env.handleResetToExample();
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 3);
            assert.strictEqual(holdings[0].t, "VOO");
            assert.strictEqual(holdings[1].t, "VXUS");
            assert.strictEqual(holdings[2].t, "BND");
        });

        runTest("handleClearAllHoldings() empties holdings and resets form", () => {
            env.handleClearAllHoldings();
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 1);
            assert.strictEqual(holdings[0].t, "");
        });
    }

    // =========================================================================
    // PART 9: CLEAN SLATE ACCOUNT RESET & BILLING CHALLENGE (OPTION B)
    // =========================================================================
    console.log("\n--- PART 9: Clean Slate Account Reset & Billing Challenge (Option B) ---");
    {
        const env = createTestEnv();

        runTest("toggleRecoverySection() reveals recoverySection and resets nested Clean Slate options when closed", () => {
            const recSec = env.getEl("recoverySection");
            recSec.style.display = "none";
            env.toggleRecoverySection();
            assert.strictEqual(recSec.style.display, "block");

            // Open clean slate section
            env.toggleCleanSlateSection();
            assert.strictEqual(env.getEl("cleanSlateSection").style.display, "block");

            // Toggling recovery section closed also hides and resets clean slate section
            env.toggleRecoverySection();
            assert.strictEqual(recSec.style.display, "none");
            assert.strictEqual(env.getEl("cleanSlateSection").style.display, "none");
        });

        runTest("toggleCleanSlateSection() reveals and hides cleanSlateSection", () => {
            const sec = env.getEl("cleanSlateSection");
            assert.ok(sec.style.display === "none" || !sec.style.display);
            env.toggleCleanSlateSection();
            assert.strictEqual(sec.style.display, "block");
            env.toggleCleanSlateSection();
            assert.strictEqual(sec.style.display, "none");
        });

        runTest("resetCleanSlateForm() resets all fields, hides billing challenge, and restores step 1", () => {
            env.toggleCleanSlateSection();
            env.getEl("cleanSlateStep1").style.display = "none";
            env.getEl("cleanSlateStep2").style.display = "block";
            env.getEl("cleanSlateBillingChallenge").style.display = "block";
            env.getEl("cleanSlateEmail").value = "test@example.com";
            env.getEl("cleanSlateCode").value = "123456";
            env.getEl("cleanSlateCardLast4").value = "4242";
            env.getEl("cleanSlateNewPassword").value = "NewSecret123!";
            env.getEl("cleanSlateConfirmPassword").value = "NewSecret123!";

            env.resetCleanSlateForm();

            assert.strictEqual(env.getEl("cleanSlateSection").style.display, "none");
            assert.strictEqual(env.getEl("cleanSlateStep1").style.display, "block");
            assert.strictEqual(env.getEl("cleanSlateStep2").style.display, "none");
            assert.strictEqual(env.getEl("cleanSlateBillingChallenge").style.display, "none");
            assert.strictEqual(env.getEl("cleanSlateEmail").value, "");
            assert.strictEqual(env.getEl("cleanSlateCode").value, "");
            assert.strictEqual(env.getEl("cleanSlateCardLast4").value, "");
            assert.strictEqual(env.getEl("cleanSlateNewPassword").value, "");
            assert.strictEqual(env.getEl("cleanSlateConfirmPassword").value, "");
        });

        await runTest("handleRequestResetCode() requires valid email and reveals Step 2", async () => {
            env.toggleCleanSlateSection();
            env.getEl("cleanSlateEmail").value = "";
            env.getEl("signInEmail").value = "";
            await env.handleRequestResetCode();
            assert.ok(env.getEl("signInFeedback").innerText.includes("Please enter your account email"));
            assert.ok(env.getEl("cleanSlateFeedback").innerText.includes("Please enter your account email"));

            // With valid email in cleanSlateEmail
            env.getEl("cleanSlateEmail").value = "clean_test@example.com";
            await env.handleRequestResetCode();
            assert.strictEqual(env.getEl("cleanSlateStep1").style.display, "none");
            assert.strictEqual(env.getEl("cleanSlateStep2").style.display, "block");
            assert.ok(env.getEl("signInFeedback").innerText.includes("verification code has been sent"));
            assert.ok(env.getEl("cleanSlateFeedback").innerText.includes("verification code has been sent"));
        });

        await runTest("handleRequestResetCode() conditionally reveals Billing Challenge for Pro accounts", async () => {
            // Create stored account with pro tier and stripeCustomerId
            const stored = env.getStoredAccounts();
            stored["pro_reset@example.com"] = {
                email: "pro_reset@example.com",
                authHash: "x".repeat(32),
                tier: "pro",
                stripeCustomerId: "cus_mock_999",
                vault: { ciphertext: "abc" }
            };
            env.setStoredAccounts(stored);

            env.getEl("cleanSlateEmail").value = "pro_reset@example.com";
            await env.handleRequestResetCode();
            assert.strictEqual(env.getEl("cleanSlateBillingChallenge").style.display, "block");
        });

        await runTest("handleExecuteCleanSlate() validates code, billing card, and password requirements", async () => {
            env.getEl("cleanSlateEmail").value = "pro_reset@example.com";
            env.getEl("cleanSlateBillingChallenge").style.display = "block";

            // Missing/short code
            env.getEl("cleanSlateCode").value = "12";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("6-digit verification code"));
            assert.ok(env.getEl("cleanSlateFeedback").innerText.includes("6-digit verification code"));

            // Valid code, missing card last 4
            env.getEl("cleanSlateCode").value = "123456";
            env.getEl("cleanSlateCardLast4").value = "12";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("last 4 digits"));
            assert.ok(env.getEl("cleanSlateFeedback").innerText.includes("last 4 digits"));

            // Valid card last 4, short password
            env.getEl("cleanSlateCardLast4").value = "4242";
            env.getEl("cleanSlateNewPassword").value = "short";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("at least 8 characters"));
            assert.ok(env.getEl("cleanSlateFeedback").innerText.includes("at least 8 characters"));

            // Password mismatch
            env.getEl("cleanSlateNewPassword").value = "StrongPass123!";
            env.getEl("cleanSlateConfirmPassword").value = "DifferentPass!";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("do not match"));
            assert.ok(env.getEl("cleanSlateFeedback").innerText.includes("do not match"));
        });

        await runTest("handleExecuteCleanSlate() wipes vault, updates credentials, and establishes session", async () => {
            env.getEl("cleanSlateEmail").value = "pro_reset@example.com";
            env.getEl("cleanSlateBillingChallenge").style.display = "none";
            env.getEl("cleanSlateCode").value = "123456";
            env.getEl("cleanSlateNewPassword").value = "FreshPassword123!";
            env.getEl("cleanSlateConfirmPassword").value = "FreshPassword123!";

            await env.handleExecuteCleanSlate();

            // Verify tab switched to status
            assert.strictEqual(env.getEl("tab-pane-acc-status").classList.contains("active"), true);

            // Check account state
            const current = env.getCurrentAccount();
            assert.ok(current);
            assert.strictEqual(current.email, "pro_reset@example.com");
            assert.strictEqual(current.tier, "pro");

            // Check vault wiped in storage
            const accounts = env.getStoredAccounts();
            assert.strictEqual(accounts["pro_reset@example.com"].vault, null);
            assert.strictEqual(accounts["pro_reset@example.com"].recoveryEnvelope, null);
            assert.strictEqual(accounts["pro_reset@example.com"].vaultVersion, 1);
        });
    }

    // =========================================================================
    // PART 10: SHARE PRICE & QUANTITY INPUT MODE
    // =========================================================================
    console.log("\n--- PART 10: Share Price & Quantity Input Mode ---");
    {
        const env = createTestEnv();

        // 1. Default mode is value mode
        runTest("isSharesInputMode() defaults to false for new users", () => {
            assert.strictEqual(env.isSharesInputMode(), false);
        });

        // 2. onSettingInputModeToggle(true) enables shares mode and updates storage
        runTest("onSettingInputModeToggle(true) enables shares mode and persists in localStorage", () => {
            env.onSettingInputModeToggle(true);
            assert.strictEqual(env.isSharesInputMode(), true);
            assert.strictEqual(env.sandbox.localStorage.getItem("rebalancer_input_mode"), "shares");
            const th = env.getEl("tableHeaders");
            assert.strictEqual(th.classList.contains("mode-shares"), true);
            assert.ok(th.innerHTML.includes("Share Price"));
            assert.ok(th.innerHTML.includes("Quantity"));
        });

        // 3. renderTableHeaders switches back to 5-column Value headers when toggled off
        runTest("onSettingInputModeToggle(false) reverts to Current Value header", () => {
            env.onSettingInputModeToggle(false);
            assert.strictEqual(env.isSharesInputMode(), false);
            assert.strictEqual(env.sandbox.localStorage.getItem("rebalancer_input_mode"), "value");
            const th = env.getEl("tableHeaders");
            assert.strictEqual(th.classList.contains("mode-shares"), false);
            assert.ok(th.innerHTML.includes("Current Value"));
            assert.strictEqual(th.innerHTML.includes("Share Price"), false);
        });

        // 4. renderRows in shares mode injects input-price and input-qty fields
        runTest("renderRows() renders price and quantity inputs when in shares mode", () => {
            env.onSettingInputModeToggle(true);
            env.setHoldings([
                { t: "AAPL", p: "180", q: "10", v: "1800", w: "100" }
            ]);
            env.renderRows();

            const container = env.getEl("portfolioContainer");
            assert.strictEqual(container.classList.contains("mode-shares"), true);
            assert.ok(container.innerHTML.includes("input-price"));
            assert.ok(container.innerHTML.includes("input-qty"));
            assert.strictEqual(container.innerHTML.includes("input-value"), false);
        });

        // 5. updateHolding auto-calculates v = p * q
        runTest("updateHolding() dynamically calculates current value (v = p * q)", () => {
            env.onSettingInputModeToggle(true);
            env.setHoldings([
                { t: "MSFT", p: "", q: "", v: "", w: "100" }
            ]);

            env.updateHolding(0, "p", "250.50");
            let holdings = env.getHoldings();
            assert.strictEqual(holdings[0].v, ""); // incomplete until quantity is present

            env.updateHolding(0, "q", "4");
            holdings = env.getHoldings();
            assert.strictEqual(holdings[0].v, "1002"); // 250.50 * 4 = 1002

            // Test fractional shares and decimals
            env.updateHolding(0, "p", "12.50");
            env.updateHolding(0, "q", "2.5");
            holdings = env.getHoldings();
            assert.strictEqual(holdings[0].v, "31.25"); // 12.50 * 2.5 = 31.25
        });

        // 6. Switching back to Value Mode displays calculated v
        runTest("Toggling from Shares Mode to Value Mode retains computed current value", () => {
            env.onSettingInputModeToggle(true);
            env.setHoldings([
                { t: "GOOG", p: "150", q: "10", v: "1500", w: "100" }
            ]);
            env.renderRows();

            // Toggle back to Value mode
            env.onSettingInputModeToggle(false);
            const container = env.getEl("portfolioContainer");
            assert.strictEqual(container.classList.contains("mode-shares"), false);
            assert.ok(container.innerHTML.includes("input-value"));
            assert.ok(container.innerHTML.includes('value="1500"'));
        });

        // 7. Validation in Shares Mode catches missing share price
        runTest("calculateRebalance() validates missing share price in shares mode", () => {
            env.onSettingInputModeToggle(true);
            env.setInputs({ deposit: "500", minBuy: "0", complete: false });
            env.setHoldings([
                { t: "VOO", p: "", q: "10", w: "100" }
            ]);
            env.calculateRebalance();
            assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid share price for holding #1."]);
        });

        // 8. Validation in Shares Mode catches missing quantity
        runTest("calculateRebalance() validates missing quantity in shares mode", () => {
            env.onSettingInputModeToggle(true);
            env.setInputs({ deposit: "500", minBuy: "0", complete: false });
            env.setHoldings([
                { t: "VOO", p: "500", q: "", w: "100" }
            ]);
            env.calculateRebalance();
            assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid quantity for holding #1."]);
        });

        // 9. Validation in Shares Mode catches both missing price and quantity
        runTest("calculateRebalance() validates missing price and quantity together", () => {
            env.onSettingInputModeToggle(true);
            env.setInputs({ deposit: "500", minBuy: "0", complete: false });
            env.setHoldings([
                { t: "VOO", p: "", q: "", w: "100" }
            ]);
            env.calculateRebalance();
            assert.deepStrictEqual(env.getErrorMessages(), ["Please fill in a valid share price and quantity for holding #1."]);
        });

        // 10. calculateRebalance computes allocations using p * q portfolio values
        runTest("calculateRebalance() successfully executes allocation in shares mode", () => {
            env.onSettingInputModeToggle(true);
            env.setInputs({ deposit: "1000", minBuy: "0", complete: false });
            env.setHoldings([
                { t: "VOO", p: "500", q: "10", w: "50" },  // 5000 (50%)
                { t: "VXUS", p: "60", q: "50", w: "30" },  // 3000 (30%)
                { t: "BND", p: "80", q: "25", w: "20" }    // 2000 (20%)
            ]);
            env.calculateRebalance();
            assert.deepStrictEqual(env.getErrorMessages(), []);
            const outEl = env.getEl("outputArea");
            assert.ok(outEl.innerText.includes("VOO"));
            assert.ok(outEl.innerText.includes("VXUS"));
            assert.ok(outEl.innerText.includes("BND"));
        });

        // 11. handleResetToExample sets p, q, and v for example assets
        runTest("handleResetToExample() restores clean example data with prices and quantities", () => {
            env.onSettingInputModeToggle(true);
            env.handleResetToExample();
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 3);
            assert.strictEqual(holdings[0].t, "VOO");
            assert.strictEqual(holdings[0].p, "500");
            assert.strictEqual(holdings[0].q, "10");
            assert.strictEqual(holdings[0].v, "5000");
        });

        // 12. openSettingsModal initializes input mode toggle checkbox
        runTest("openSettingsModal() initializes settingInputModeToggle checkbox state", () => {
            env.onSettingInputModeToggle(true);
            env.openSettingsModal();
            assert.strictEqual(env.getEl("settingInputModeToggle").checked, true);

            env.onSettingInputModeToggle(false);
            env.openSettingsModal();
            assert.strictEqual(env.getEl("settingInputModeToggle").checked, false);
        });

        // 13. saveFormData and loadFormData persist and restore inputMode
        runTest("saveFormData() and loadFormData() persist and restore inputMode state", () => {
            env.onSettingInputModeToggle(true);
            env.setInputs({ deposit: "250", minBuy: "0", complete: false });
            env.setHoldings([
                { t: "VT", p: "100", q: "5", v: "500", w: "100" }
            ]);
            env.sandbox.saveFormData();

            const savedRaw = env.sandbox.localStorage.getItem("rebalancer_state");
            assert.ok(savedRaw);
            const parsed = JSON.parse(savedRaw);
            assert.strictEqual(parsed.inputMode, "shares");

            // Reset mode and reload
            env.sandbox.localStorage.setItem("rebalancer_input_mode", "value");
            env.sandbox.loadFormData();
            assert.strictEqual(env.isSharesInputMode(), true); // restored from payload
        });

        // =========================================================================
        // PART 11: CSV Upload, Broker Adapters & Drag-and-Drop Invariants
        // =========================================================================
        console.log("\n--- PART 11: CSV Upload, Broker Adapters & Drag-and-Drop Invariants ---");

        // 1. parseCsvText handles standard comma-separated and quoted lines
        runTest("parseCsvText() parses standard, quoted, and multiline CSV lines", () => {
            const raw = 'Holding,Quantity,Share Price,Weight\r\n"VOO, S&P 500",10,"$500.50",50%\nBND,25,$80.00,20%';
            const rows = env.parseCsvText(raw);
            assert.strictEqual(rows.length, 3);
            assert.deepStrictEqual([...rows[0]], ["Holding", "Quantity", "Share Price", "Weight"]);
            assert.strictEqual(rows[1][0], "VOO, S&P 500");
            assert.strictEqual(rows[1][1], "10");
            assert.strictEqual(rows[1][2], "$500.50");
            assert.strictEqual(rows[1][3], "50%");
            assert.strictEqual(rows[2][0], "BND");
        });

        // 2. parseCsvText strips UTF-8 BOM
        runTest("parseCsvText() strips UTF-8 BOM and ignores empty rows", () => {
            const raw = '\uFEFFHolding,Value,Weight\nVAS,10000,60\n\n\nVGS,6000,40\n';
            const rows = env.parseCsvText(raw);
            assert.strictEqual(rows.length, 3);
            assert.strictEqual(rows[0][0], "Holding");
            assert.strictEqual(rows[1][0], "VAS");
            assert.strictEqual(rows[2][0], "VGS");
        });

        // 3. sanitizeCsvNumber strips currency signs and thousands commas
        runTest("sanitizeCsvNumber() correctly sanitizes currency and thousands separators", () => {
            assert.strictEqual(env.sanitizeCsvNumber("$1,250.50"), "1250.50");
            assert.strictEqual(env.sanitizeCsvNumber("€500.00"), "500.00");
            assert.strictEqual(env.sanitizeCsvNumber("£10,000"), "10000");
            assert.strictEqual(env.sanitizeCsvNumber("45%"), "45");
            assert.strictEqual(env.sanitizeCsvNumber("CHF 120"), "120");
        });

        // 4. BrokerRegistry manages adapters
        runTest("BrokerRegistry allows registration and retrieval of custom adapters", () => {
            const initialCount = env.BrokerRegistry.getAll().length;
            assert.ok(initialCount >= 2);
            assert.ok(env.BrokerRegistry.get("generic_shares"));
            assert.ok(env.BrokerRegistry.get("generic_value"));

            const testAdapter = new env.DeclarativeCsvAdapter({
                id: "test_broker",
                name: "Test Broker",
                mode: "shares",
                headers: { ticker: ["code"], shares: ["qty"], price: ["price"], weight: ["target"] },
                guideHtml: "<p>Test Guide</p>"
            });
            env.BrokerRegistry.register(testAdapter);
            assert.strictEqual(env.BrokerRegistry.get("test_broker").name, "Test Broker");
        });

        // 5. GenericSharesAdapter parses Share Quantity template
        runTest("GenericSharesAdapter parses template: Holding, Quantity, Share Price, Weight", () => {
            const adapter = env.BrokerRegistry.get("generic_shares");
            const csv = "Holding,Quantity,Share Price,Weight\nVAS,50,95.50,40\nVGS,100,115.00,60";
            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.mode, "shares");
            assert.strictEqual(res.holdings.length, 2);
            assert.strictEqual(res.holdings[0].t, "VAS");
            assert.strictEqual(res.holdings[0].q, "50");
            assert.strictEqual(res.holdings[0].p, "95.50");
            assert.strictEqual(res.holdings[0].v, "4775"); // 50 * 95.50
            assert.strictEqual(res.holdings[0].w, "40");
            assert.strictEqual(res.holdings[1].t, "VGS");
            assert.strictEqual(res.holdings[1].v, "11500");
        });

        // 6. GenericSharesAdapter handles alternative headers: Asset, Number of shares, Shareprice, Weighting
        runTest("GenericSharesAdapter parses alternative headers: Asset, Number of shares, Shareprice, Weighting", () => {
            const adapter = env.BrokerRegistry.get("generic_shares");
            const csv = "Asset,Number of shares,Shareprice,Weighting\nAAPL,10,$150.00,50%\nMSFT,5,$300.00,50%";
            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 2);
            assert.strictEqual(res.holdings[0].t, "AAPL");
            assert.strictEqual(res.holdings[0].q, "10");
            assert.strictEqual(res.holdings[0].p, "150.00");
            assert.strictEqual(res.holdings[0].v, "1500");
            assert.strictEqual(res.holdings[0].w, "50");
        });

        // 7. GenericSharesAdapter handles title row in cell A1 before headers
        runTest("GenericSharesAdapter skips template title in row 1 and detects headers in row 2", () => {
            const adapter = env.BrokerRegistry.get("generic_shares");
            const csv = "Sample Generic CSV Share Quantity Template,,,\nHolding,Quantity,Share Price,Weight\nVOO,10,500,50\nVXUS,50,60,30\nBND,25,80,20";
            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 3);
            assert.strictEqual(res.holdings[0].t, "VOO");
            assert.strictEqual(res.holdings[2].t, "BND");
        });

        // 8. GenericValueAdapter parses template: Holding, Value, Weight
        runTest("GenericValueAdapter parses template: Holding, Value, Weight", () => {
            const adapter = env.BrokerRegistry.get("generic_value");
            const csv = 'Holding,Value,Weight\nVOO,"$5,000.00",50\nVXUS,"$3,000.00",30\nBND,"$2,000.00",20';
            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.mode, "value");
            assert.strictEqual(res.holdings.length, 3);
            assert.strictEqual(res.holdings[0].t, "VOO");
            assert.strictEqual(res.holdings[0].v, "5000.00");
            assert.strictEqual(res.holdings[0].w, "50");
        });

        // 9. GenericValueAdapter parses alternative headers: Asset, Value, Weighting
        runTest("GenericValueAdapter parses alternative headers: Asset, Value, Weighting", () => {
            const adapter = env.BrokerRegistry.get("generic_value");
            const csv = "Asset,Value,Weighting\nIVV,8000,80%\nIXI,2000,20%";
            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 2);
            assert.strictEqual(res.holdings[0].t, "IVV");
            assert.strictEqual(res.holdings[0].v, "8000");
            assert.strictEqual(res.holdings[0].w, "80");
        });

        // 10. openCsvModal initializes overlay and guide
        runTest("openCsvModal() opens overlay, sets overflow hidden, and populates guide", () => {
            env.openCsvModal();
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), true);
            assert.strictEqual(env.sandbox.document.body.style.overflow, "hidden");
            const guide = env.getEl("csvGuideContent");
            assert.ok(guide.innerHTML.includes("Required Columns"));
        });

        // 11. closeCsvModal resets state and restores body scroll
        runTest("closeCsvModal() closes overlay, restores overflow, and resets drop zone", () => {
            env.openCsvModal();
            env.closeCsvModal();
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);
            assert.strictEqual(env.sandbox.document.body.style.overflow, "");
            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), false);
        });

        // 12. handleCsvBackdropClick closes modal on backdrop click
        runTest("handleCsvBackdropClick() closes modal on backdrop click", () => {
            env.openCsvModal();
            env.handleCsvBackdropClick({ target: { id: "csvModalOverlay" } });
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);
        });

        // 13. Escape key closes csvModalOverlay
        runTest("Escape keydown event closes csvModalOverlay when active", () => {
            env.openCsvModal();
            env.sandbox.document.dispatchEvent({ type: "keydown", key: "Escape" });
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);
        });

        // 14. onCsvFormatChange updates guide dynamically
        runTest("onCsvFormatChange() updates guide dynamically based on selected format", () => {
            env.openCsvModal();
            env.onCsvFormatChange("generic_value");
            assert.ok(env.getEl("csvGuideContent").innerHTML.includes("Holding</code>, <code>Value</code>, <code>Weight"));

            env.onCsvFormatChange("generic_shares");
            assert.ok(env.getEl("csvGuideContent").innerHTML.includes("Holding</code>, <code>Quantity</code>, <code>Share Price"));
        });

        // 15. Drag over and leave toggle dragover class
        runTest("handleCsvDragOver() and handleCsvDragLeave() toggle dragover class on drop zone", () => {
            env.handleCsvDragOver({ preventDefault() {}, stopPropagation() {} });
            assert.strictEqual(env.getEl("csvDropZone").classList.contains("dragover"), true);

            env.handleCsvDragLeave({ preventDefault() {}, stopPropagation() {} });
            assert.strictEqual(env.getEl("csvDropZone").classList.contains("dragover"), false);
        });

        // 16. processCsvText loads valid CSV and enables Import button
        runTest("processCsvText() parses valid CSV and displays holding count badge", () => {
            env.openCsvModal();
            const csv = "Holding,Quantity,Share Price,Weight\nVAS,100,95,50\nVGS,100,115,50";
            env.processCsvText(csv, "my_portfolio.csv", 1024);

            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getEl("csvFileName").innerText, "my_portfolio.csv");
            assert.ok(env.getEl("csvHoldingCountText").innerText.includes("2 holdings ready to import"));
            assert.strictEqual(env.getEl("btnImportCsv").disabled, false);
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);
        });

        // 17. processCsvText with invalid format shows error banner
        runTest("processCsvText() shows error banner for mismatched or empty CSV", () => {
            env.openCsvModal();
            env.processCsvText("Unrelated,Columns,Here\n1,2,3", "bad.csv", 500);

            const errBanner = env.getEl("csvErrorBanner");
            assert.strictEqual(errBanner.style.display, "flex");
            assert.ok(errBanner.innerText.includes("Could not identify required columns"));
            assert.strictEqual(env.getEl("btnImportCsv").disabled, true);
        });

        // 18. executeCsvImport sets holdingsData and switches input mode
        runTest("executeCsvImport() applies holdings, switches input mode to shares, and saves state", () => {
            env.openCsvModal();
            env.onCsvFormatChange("generic_shares");
            const csv = "Holding,Quantity,Share Price,Weight\nVOO,10,500,50\nVXUS,50,60,30\nBND,25,80,20";
            env.processCsvText(csv, "three_fund.csv", 2048);
            env.executeCsvImport();

            // Modal closed
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);

            // Input mode switched to shares
            assert.strictEqual(env.isSharesInputMode(), true);

            // Holdings data updated
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 3);
            assert.strictEqual(holdings[0].t, "VOO");
            assert.strictEqual(holdings[0].p, "500");
            assert.strictEqual(holdings[0].q, "10");
            assert.strictEqual(holdings[0].v, "5000");
            assert.strictEqual(holdings[0].w, "50");

            // Feedback notice displayed
            const notice = env.getEl("calcNotice");
            assert.ok(notice.innerText.includes("Successfully imported 3 holdings from CSV"));
        });

        // 19. DeclarativeCsvAdapter supports custom filterRow functions
        runTest("DeclarativeCsvAdapter filterRow ignores unwanted footer or cash lines", () => {
            const adapter = new env.DeclarativeCsvAdapter({
                id: "broker_with_footer",
                name: "Broker With Footer",
                mode: "value",
                headers: { ticker: ["code"], value: ["value"], weight: ["target"] },
                filterRow: (row, map) => {
                    const code = (row[map.ticker] || "").toUpperCase();
                    return code !== "TOTAL" && code !== "CASH";
                }
            });
            const csv = "Code,Value,Target\nVAS,10000,50\nVGS,10000,50\nCASH,500,0\nTOTAL,20500,100";
            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 2);
            assert.strictEqual(res.holdings[0].t, "VAS");
            assert.strictEqual(res.holdings[1].t, "VGS");
        });

        // Helper to construct in-memory test XLSX zip archives
        function createTestXlsx(files) {
            const zlib = require('zlib');
            const crcTable = new Uint32Array(256);
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[i] = c;
            }
            function getCrc32(buf) {
                let crc = 0 ^ (-1);
                for (let i = 0; i < buf.length; i++) {
                    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
                }
                return (crc ^ (-1)) >>> 0;
            }

            const localHeaders = [];
            const cdHeaders = [];
            let offset = 0;

            for (const file of files) {
                const nameBuf = Buffer.from(file.name, 'utf8');
                const uncompressed = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, 'utf8');
                const compressed = zlib.deflateRawSync(uncompressed);
                const crc = getCrc32(uncompressed);

                const lh = Buffer.alloc(30 + nameBuf.length);
                lh.writeUInt32LE(0x04034b50, 0);
                lh.writeUInt16LE(20, 4);
                lh.writeUInt16LE(0, 6);
                lh.writeUInt16LE(8, 8);
                lh.writeUInt16LE(0, 10);
                lh.writeUInt16LE(0, 12);
                lh.writeUInt32LE(crc, 14);
                lh.writeUInt32LE(compressed.length, 18);
                lh.writeUInt32LE(uncompressed.length, 22);
                lh.writeUInt16LE(nameBuf.length, 26);
                lh.writeUInt16LE(0, 28);
                nameBuf.copy(lh, 30);

                localHeaders.push(lh);
                localHeaders.push(compressed);

                const cdh = Buffer.alloc(46 + nameBuf.length);
                cdh.writeUInt32LE(0x02014b50, 0);
                cdh.writeUInt16LE(20, 4);
                cdh.writeUInt16LE(20, 6);
                cdh.writeUInt16LE(0, 8);
                cdh.writeUInt16LE(8, 10);
                cdh.writeUInt16LE(0, 12);
                cdh.writeUInt16LE(0, 14);
                cdh.writeUInt32LE(crc, 16);
                cdh.writeUInt32LE(compressed.length, 20);
                cdh.writeUInt32LE(uncompressed.length, 24);
                cdh.writeUInt16LE(nameBuf.length, 28);
                cdh.writeUInt16LE(0, 30);
                cdh.writeUInt16LE(0, 32);
                cdh.writeUInt16LE(0, 34);
                cdh.writeUInt16LE(0, 36);
                cdh.writeUInt32LE(0, 38);
                cdh.writeUInt32LE(offset, 42);
                nameBuf.copy(cdh, 46);

                cdHeaders.push(cdh);
                offset += lh.length + compressed.length;
            }

            const cdOffset = offset;
            const cdSize = cdHeaders.reduce((sum, h) => sum + h.length, 0);

            const eocd = Buffer.alloc(22);
            eocd.writeUInt32LE(0x06054b50, 0);
            eocd.writeUInt16LE(0, 4);
            eocd.writeUInt16LE(0, 6);
            eocd.writeUInt16LE(files.length, 8);
            eocd.writeUInt16LE(files.length, 10);
            eocd.writeUInt32LE(cdSize, 12);
            eocd.writeUInt32LE(cdOffset, 16);
            eocd.writeUInt16LE(0, 20);

            return Buffer.concat([...localHeaders, ...cdHeaders, eocd]);
        }

        // 20. parseXlsxToCsv parses standard OpenXML workbook with sharedStrings table
        await runTest("parseXlsxToCsv() parses OpenXML workbook with sharedStrings table", async () => {
            const xlsxBuf = createTestXlsx([
                {
                    name: 'xl/sharedStrings.xml',
                    content: '<sst><si><t>Asset</t></si><si><t>Number of shares</t></si><si><t>Shareprice</t></si><si><t>Weighting</t></si><si><t>AAPL</t></si><si><t>MSFT</t></si></sst>'
                },
                {
                    name: 'xl/worksheets/sheet1.xml',
                    content: '<sheetData>' +
                        '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="s"><v>3</v></c></row>' +
                        '<row r="2"><c r="A2" t="s"><v>4</v></c><c r="B2"><v>25</v></c><c r="C2"><v>210.50</v></c><c r="D2"><v>60</v></c></row>' +
                        '<row r="3"><c r="A3" t="s"><v>5</v></c><c r="B3"><v>15</v></c><c r="C3"><v>420.00</v></c><c r="D3"><v>40</v></c></row>' +
                        '</sheetData>'
                }
            ]);
            const ab = xlsxBuf.buffer.slice(xlsxBuf.byteOffset, xlsxBuf.byteOffset + xlsxBuf.byteLength);
            const csv = await env.parseXlsxToCsv(ab);
            assert.ok(csv.includes("Asset,Number of shares,Shareprice,Weighting"));
            assert.ok(csv.includes("AAPL,25,210.50,60"));
            assert.ok(csv.includes("MSFT,15,420.00,40"));
        });

        // 21. parseXlsxToCsv parses workbook with inline strings and rich text
        await runTest("parseXlsxToCsv() parses workbook with inline strings and rich text", async () => {
            const xlsxBuf = createTestXlsx([
                {
                    name: 'xl/sharedStrings.xml',
                    content: '<sst><si><r><t>Global </t></r><r><t>Equities</t></r></si></sst>'
                },
                {
                    name: 'xl/worksheets/sheet1.xml',
                    content: '<sheetData>' +
                        '<row r="1"><c r="A1" t="inlineStr"><is><t>Holding</t></is></c><c r="B1" t="inlineStr"><is><t>Value</t></is></c><c r="C1" t="inlineStr"><is><t>Weight</t></is></c></row>' +
                        '<row r="2"><c r="A2" t="s"><v>0</v></c><c r="B2"><v>75000</v></c><c r="C2"><v>100</v></c></row>' +
                        '</sheetData>'
                }
            ]);
            const ab = xlsxBuf.buffer.slice(xlsxBuf.byteOffset, xlsxBuf.byteOffset + xlsxBuf.byteLength);
            const csv = await env.parseXlsxToCsv(ab);
            assert.ok(csv.includes("Holding,Value,Weight"));
            assert.ok(csv.includes("Global Equities,75000,100"));
        });

        // 22. handleCsvFileSelect accepts and parses .xlsx file
        await runTest("handleCsvFileSelect() accepts and parses an .xlsx file into staged holdings", async () => {
            env.openCsvModal();
            env.onCsvFormatChange("generic_shares");

            const xlsxBuf = createTestXlsx([
                {
                    name: 'xl/sharedStrings.xml',
                    content: '<sst><si><t>Holding</t></si><si><t>Quantity</t></si><si><t>Share Price</t></si><si><t>Weight</t></si><si><t>IVV</t></si><si><t>IOZ</t></si></sst>'
                },
                {
                    name: 'xl/worksheets/sheet1.xml',
                    content: '<sheetData>' +
                        '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="s"><v>3</v></c></row>' +
                        '<row r="2"><c r="A2" t="s"><v>4</v></c><c r="B2"><v>50</v></c><c r="C2"><v>550</v></c><c r="D2"><v>70</v></c></row>' +
                        '<row r="3"><c r="A3" t="s"><v>5</v></c><c r="B3"><v>80</v></c><c r="C3"><v>32</v></c><c r="D3"><v>30</v></c></row>' +
                        '</sheetData>'
                }
            ]);

            const mockFile = {
                name: "portfolio.xlsx",
                size: xlsxBuf.length,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                content: xlsxBuf
            };

            await env.handleCsvFileSelect(mockFile);

            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getEl("csvFileName").innerText, "portfolio.xlsx");
            assert.ok(env.getEl("csvHoldingCountText").innerText.includes("2 holdings ready to import"));
            assert.strictEqual(env.getEl("btnImportCsv").disabled, false);
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);
        });

        // 23. executeCsvImport applies staged .xlsx holdings and displays Excel success feedback
        await runTest("executeCsvImport() applies .xlsx holdings and shows Excel import notice", () => {
            env.executeCsvImport();
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);
            assert.strictEqual(env.isSharesInputMode(), true);

            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);
            assert.strictEqual(holdings[0].t, "IVV");
            assert.strictEqual(holdings[0].q, "50");
            assert.strictEqual(holdings[0].p, "550");
            assert.strictEqual(holdings[0].w, "70");

            const notice = env.getEl("calcNotice");
            assert.ok(notice.innerText.includes("Successfully imported 2 holdings from Excel"));
        });

        // 24. handleCsvFileSelect accepts and parses an .xlsm (macro-enabled workbook) file
        await runTest("handleCsvFileSelect() accepts and parses an .xlsm file into staged holdings", async () => {
            env.openCsvModal();
            env.onCsvFormatChange("generic_shares");

            const xlsmBuf = createTestXlsx([
                {
                    name: 'xl/sharedStrings.xml',
                    content: '<sst><si><t>Holding</t></si><si><t>Quantity</t></si><si><t>Share Price</t></si><si><t>Weight</t></si><si><t>NVDA</t></si></sst>'
                },
                {
                    name: 'xl/worksheets/sheet1.xml',
                    content: '<sheetData>' +
                        '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="s"><v>3</v></c></row>' +
                        '<row r="2"><c r="A2" t="s"><v>4</v></c><c r="B2"><v>100</v></c><c r="C2"><v>125</v></c><c r="D2"><v>100</v></c></row>' +
                        '</sheetData>'
                },
                {
                    name: 'xl/vbaProject.bin',
                    content: Buffer.from([0x01, 0x02, 0x03])
                }
            ]);

            const mockFile = {
                name: "portfolio_macro.xlsm",
                size: xlsmBuf.length,
                type: "application/vnd.ms-excel.sheet.macroEnabled.12",
                content: xlsmBuf
            };

            await env.handleCsvFileSelect(mockFile);

            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getEl("csvFileName").innerText, "portfolio_macro.xlsm");
            assert.ok(env.getEl("csvHoldingCountText").innerText.includes("1 holding ready to import"));
            assert.strictEqual(env.getStagedCsvHoldings().length, 1);
            assert.strictEqual(env.getStagedCsvHoldings()[0].t, "NVDA");

            env.executeCsvImport();
            const notice = env.getEl("calcNotice");
            assert.ok(notice.innerText.includes("Successfully imported 1 holding from Excel"));
        });

        // 25. parseHtmlTableToCsv and handleCsvFileSelect support .xls files
        await runTest("handleCsvFileSelect() accepts and parses an HTML-table .xls file into staged holdings", async () => {
            env.openCsvModal();
            env.onCsvFormatChange("generic_value");

            const htmlXls = "<html><body><table>" +
                "<tr><th>Asset</th><th>Value</th><th>Weighting</th></tr>" +
                "<tr><td>BND</td><td>$25,000</td><td>50%</td></tr>" +
                "<tr><td>VTI</td><td>$25,000</td><td>50%</td></tr>" +
                "</table></body></html>";

            const mockFile = {
                name: "bank_export.xls",
                size: htmlXls.length,
                type: "application/vnd.ms-excel",
                content: htmlXls
            };

            await env.handleCsvFileSelect(mockFile);

            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getEl("csvFileName").innerText, "bank_export.xls");
            assert.ok(env.getEl("csvHoldingCountText").innerText.includes("2 holdings ready to import"));
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);
            assert.strictEqual(env.getStagedCsvHoldings()[0].t, "BND");
            assert.strictEqual(env.getStagedCsvHoldings()[1].t, "VTI");

            env.executeCsvImport();
            const notice = env.getEl("calcNotice");
            assert.ok(notice.innerText.includes("Successfully imported 2 holdings from Excel"));
        });

        // 26. csvSupportedFormats displays supported file formats note
        runTest("csvSupportedFormats note displays supported formats below drop zone", () => {
            const fs = require('fs');
            const { htmlPath } = require('./test_helper');
            const html = fs.readFileSync(htmlPath, 'utf8');
            assert.ok(html.includes('id="csvSupportedFormats"'));
            assert.ok(html.includes('File formats supported: .csv .xlsx .xlsm .xls'));
            assert.ok(html.includes('.csv-supported-formats'));
        });

        // 27. BrokerRegistry includes Nabtrade adapter
        runTest("BrokerRegistry includes Nabtrade adapter as 3rd registered option", () => {
            const adapter = env.BrokerRegistry.get("nabtrade");
            assert.ok(adapter);
            assert.strictEqual(adapter.id, "nabtrade");
            assert.strictEqual(adapter.name, "Nabtrade");
            assert.ok(adapter.guideHtml.includes("Nabtrade Portfolio CSV Export"));
        });

        // 28. NabtradeCsvAdapter in Share Price & Quantity Mode
        runTest("NabtradeCsvAdapter parses Code, Quantity, Mkt.Price in Share Price & Quantity mode", () => {
            env.onSettingInputModeToggle(true);
            const adapter = env.BrokerRegistry.get("nabtrade");
            assert.strictEqual(adapter.mode, "shares");

            const csv = "Code,Description,Quantity,Mkt.Price,Market value,Cost price\n" +
                "VAS,Vanguard Australian Shares Index ETF,50,95.50,$4,775.00,$4,500.00\n" +
                "VGS,Vanguard MSCI Index International Shares ETF,100,115.00,$11,500.00,$10,000.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.mode, "shares");
            assert.strictEqual(res.holdings.length, 2);

            // Holding 1: VAS
            assert.strictEqual(res.holdings[0].t, "VAS");
            assert.strictEqual(res.holdings[0].q, "50");
            assert.strictEqual(res.holdings[0].p, "95.50");
            assert.strictEqual(res.holdings[0].v, "4775");
            assert.strictEqual(res.holdings[0].w, ""); // Weight left for user input

            // Holding 2: VGS
            assert.strictEqual(res.holdings[1].t, "VGS");
            assert.strictEqual(res.holdings[1].q, "100");
            assert.strictEqual(res.holdings[1].p, "115.00");
            assert.strictEqual(res.holdings[1].v, "11500");
            assert.strictEqual(res.holdings[1].w, ""); // Weight left for user input
        });

        // 29. NabtradeCsvAdapter in Value per Holding Mode
        runTest("NabtradeCsvAdapter parses Code, Market value in Value per Holding mode and preserves Price/Quantity", () => {
            env.onSettingInputModeToggle(false);
            const adapter = env.BrokerRegistry.get("nabtrade");
            assert.strictEqual(adapter.mode, "value");

            const csv = 'Code,Description,Quantity,Mkt.Price,Market value,Cost price\n' +
                'VAS,Vanguard Australian Shares Index ETF,50,95.50,"$4,775.00","$4,500.00"\n' +
                'VGS,Vanguard MSCI Index International Shares ETF,100,115.00,"$11,500.00","$10,000.00"';

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.mode, "value");
            assert.strictEqual(res.holdings.length, 2);

            // Holding 1: VAS
            assert.strictEqual(res.holdings[0].t, "VAS");
            assert.strictEqual(res.holdings[0].v, "4775.00");
            assert.strictEqual(res.holdings[0].p, "95.50");
            assert.strictEqual(res.holdings[0].q, "50");
            assert.strictEqual(res.holdings[0].w, "");

            // Holding 2: VGS
            assert.strictEqual(res.holdings[1].t, "VGS");
            assert.strictEqual(res.holdings[1].v, "11500.00");
            assert.strictEqual(res.holdings[1].p, "115.00");
            assert.strictEqual(res.holdings[1].q, "100");
            assert.strictEqual(res.holdings[1].w, "");
        });

        // 30. NabtradeCsvAdapter automatically excludes Cash Account and Total summary rows
        runTest("NabtradeCsvAdapter automatically excludes Cash Account and Total summary rows", () => {
            env.onSettingInputModeToggle(true);
            const adapter = env.BrokerRegistry.get("nabtrade");

            const csv = 'Code,Description,Quantity,Mkt.Price,Market value\n' +
                'VAS,Vanguard Australian Shares,50,95.50,"$4,775.00"\n' +
                'CASH,Nabtrade AUD Cash Account,,,1500.00\n' +
                'TOTAL,Portfolio Total,,,6275.00';

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 1);
            assert.strictEqual(res.holdings[0].t, "VAS");
        });

        // 31. Nabtrade CSV end-to-end import via processCsvText and executeCsvImport
        runTest("Nabtrade CSV end-to-end import applies holdings and preserves input mode", () => {
            env.onSettingInputModeToggle(true);
            env.openCsvModal();
            env.onCsvFormatChange("nabtrade");

            const guide = env.getEl("csvGuideContent");
            assert.ok(guide.innerHTML.includes("Nabtrade Portfolio CSV Export"));

            const csv = "Code,Description,Quantity,Mkt.Price,Market value\n" +
                "BHP,BHP Group Ltd,20,45.00,900.00\n" +
                "CBA,Commonwealth Bank of Australia,10,120.00,1200.00";

            env.processCsvText(csv, "nabtrade_export.csv", 1024);

            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getEl("csvFileName").innerText, "nabtrade_export.csv");
            assert.ok(env.getEl("csvHoldingCountText").innerText.includes("2 holdings ready to import"));
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);

            env.executeCsvImport();

            // Modal closed
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);

            // Input mode preserved
            assert.strictEqual(env.isSharesInputMode(), true);

            // Holdings data updated
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);
            assert.strictEqual(holdings[0].t, "BHP");
            assert.strictEqual(holdings[0].q, "20");
            assert.strictEqual(holdings[0].p, "45.00");
            assert.strictEqual(holdings[0].w, ""); // blank for user input
            assert.strictEqual(holdings[1].t, "CBA");
            assert.strictEqual(holdings[1].q, "10");
            assert.strictEqual(holdings[1].p, "120.00");
            assert.strictEqual(holdings[1].w, "");

            // Notice displayed
            const notice = env.getEl("calcNotice");
            assert.ok(notice.innerText.includes("Successfully imported 2 holdings from CSV"));
        });

        // 32. executeCsvImport preserves target weights of existing holdings when imported CSV lacks weights
        runTest("executeCsvImport() preserves target weights of existing holdings when imported CSV lacks weights", () => {
            env.onSettingInputModeToggle(true);

            // Establish existing portfolio with user-configured target weights
            env.setHoldings([
                { t: "VAS", v: "4000", p: "80.00", q: "50", w: "40" },
                { t: "VGS", v: "6000", p: "100.00", q: "60", w: "60" }
            ]);

            env.openCsvModal();
            env.onCsvFormatChange("nabtrade");

            // Fresh export from Nabtrade has updated prices/quantities, no weights, plus a new holding (BND)
            const csv = "Code,Description,Quantity,Mkt.Price,Market value\n" +
                "VAS,Vanguard Australian Shares,60,95.00,5700.00\n" +
                "VGS,Vanguard MSCI International,75,120.00,9000.00\n" +
                "BND,Vanguard Total Bond Market,10,85.00,850.00";

            env.processCsvText(csv, "monthly_update.csv", 1024);
            env.executeCsvImport();

            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 3);

            // VAS: updated qty & price, preserved existing weight (40)
            assert.strictEqual(holdings[0].t, "VAS");
            assert.strictEqual(holdings[0].q, "60");
            assert.strictEqual(holdings[0].p, "95.00");
            assert.strictEqual(holdings[0].w, "40");

            // VGS: updated qty & price, preserved existing weight (60)
            assert.strictEqual(holdings[1].t, "VGS");
            assert.strictEqual(holdings[1].q, "75");
            assert.strictEqual(holdings[1].p, "120.00");
            assert.strictEqual(holdings[1].w, "60");

            // BND: brand new holding -> blank weight for user to input
            assert.strictEqual(holdings[2].t, "BND");
            assert.strictEqual(holdings[2].q, "10");
            assert.strictEqual(holdings[2].p, "85.00");
            assert.strictEqual(holdings[2].w, "");
        });

        // 33. executeCsvImport overwrites target weights when imported CSV explicitly provides weights
        runTest("executeCsvImport() overwrites target weights when imported CSV explicitly provides weights", () => {
            env.onSettingInputModeToggle(true);

            // Existing portfolio with 40/60 allocation
            env.setHoldings([
                { t: "VAS", v: "4000", p: "80.00", q: "50", w: "40" },
                { t: "VGS", v: "6000", p: "100.00", q: "60", w: "60" }
            ]);

            env.openCsvModal();
            env.onCsvFormatChange("generic_shares");

            // Generic template explicitly specifies 50 / 50 weights
            const csv = "Holding,Quantity,Share Price,Weight\n" +
                "VAS,50,90.00,50\n" +
                "VGS,60,110.00,50";

            env.processCsvText(csv, "explicit_weights.csv", 1024);
            env.executeCsvImport();

            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);
            assert.strictEqual(holdings[0].t, "VAS");
            assert.strictEqual(holdings[0].w, "50"); // Explicitly updated to 50
            assert.strictEqual(holdings[1].t, "VGS");
            assert.strictEqual(holdings[1].w, "50"); // Explicitly updated to 50
        });

        // 34. BrokerRegistry includes Betashares Direct adapter implementing TransactionLedgerAdapter
        runTest("BrokerRegistry includes Betashares Direct adapter as 4th registered option", () => {
            const adapter = env.BrokerRegistry.get("betashares_direct");
            assert.ok(adapter);
            assert.strictEqual(adapter.id, "betashares_direct");
            assert.strictEqual(adapter.name, "Betashares Direct");
            assert.strictEqual(adapter.isTransactionStrategy, true);
            assert.strictEqual(adapter.mode, "shares");
            assert.ok(adapter.guideHtml.includes("Betashares Direct Activity CSV Export"));
        });

        // 35. TransactionLedgerAdapter extensible strategy pattern can register custom brokers
        runTest("TransactionLedgerAdapter extensible strategy pattern allows registering custom broker", () => {
            const customAdapter = new env.TransactionLedgerAdapter({
                id: "custom_crypto",
                name: "Custom Crypto Ledger",
                isDescendingOrder: false, // Ascending order
                priceStrategy: "latest",
                headers: {
                    ticker: ["asset"],
                    action: ["side"],
                    units: ["amount"],
                    price: ["rate"]
                },
                actionMap: {
                    "B": 1,
                    "S": -1
                }
            });

            // Ascending order: first buy at 50, second buy at 60 (60 is latest price)
            const csv = "Asset,Side,Amount,Rate\n" +
                "BTC,B,0.500000,50000\n" +
                "ETH,B,5.000000,3000\n" +
                "BTC,B,0.250000,60000\n" +
                "ETH,S,2.000000,3500";

            const res = customAdapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 2);

            // BTC: 0.5 + 0.25 = 0.75, latest rate 60000
            const btc = res.holdings.find(h => h.t === "BTC");
            assert.ok(btc);
            assert.strictEqual(btc.q, "0.75");
            assert.strictEqual(btc.p, "60000");

            // ETH: 5 - 2 = 3, latest rate 3500
            const eth = res.holdings.find(h => h.t === "ETH");
            assert.ok(eth);
            assert.strictEqual(eth.q, "3");
            assert.strictEqual(eth.p, "3500");
        });

        // 36. Betashares Direct aggregates multiple Buy and Auto-Invest transactions
        runTest("Betashares Direct aggregates multiple Buy and Auto-Invest transactions", () => {
            const adapter = env.BrokerRegistry.get("betashares_direct");

            const csv = "Date,Activity Type,Symbol,Quantity,Price,Amount\n" +
                "15/03/2026,Auto-Invest,DHHF,5.5000,35.00,192.50\n" +
                "01/03/2026,Buy,DHHF,20.0000,34.00,680.00\n" +
                "15/02/2026,Auto-Invest,DHHF,5.0000,33.50,167.50";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 1);
            assert.strictEqual(res.holdings[0].t, "DHHF");
            assert.strictEqual(res.holdings[0].q, "30.5");
            // Descending order: top row (15/03/2026) has latest price 35.00
            assert.strictEqual(res.holdings[0].p, "35");
        });

        // 37. Betashares Direct treats Distribution Reinvestment as positive buy and ignores cash Distribution
        runTest("Betashares Direct treats Distribution Reinvestment as buy and ignores cash Distribution", () => {
            const adapter = env.BrokerRegistry.get("betashares_direct");

            const csv = "Date,Activity Type,Symbol,Quantity,Price,Amount\n" +
                "20/03/2026,Distribution,VAS,0,,50.00\n" +
                "15/03/2026,Distribution Reinvestment,VAS,0.4852,103.00,50.00\n" +
                "01/01/2026,Buy,VAS,50.0000,95.00,4750.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 1);
            assert.strictEqual(res.holdings[0].t, "VAS");
            // 50 + 0.4852 = 50.4852
            assert.strictEqual(res.holdings[0].q, "50.4852");
            // Latest trade price was distribution reinvestment at 103
            assert.strictEqual(res.holdings[0].p, "103");
        });

        // 38. Betashares Direct subtracts Sell orders and accurately tracks fractional units
        runTest("Betashares Direct subtracts Sell orders and accurately tracks fractional units", () => {
            const adapter = env.BrokerRegistry.get("betashares_direct");

            const csv = "Date,Activity Type,Symbol,Quantity,Price,Amount\n" +
                "15/03/2026,Sell,BGBL,2.1234,75.00,159.25\n" +
                "01/02/2026,Buy,BGBL,12.3456,70.00,864.19";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 1);
            assert.strictEqual(res.holdings[0].t, "BGBL");
            // 12.3456 - 2.1234 = 10.2222
            assert.strictEqual(res.holdings[0].q, "10.2222");
            assert.strictEqual(res.holdings[0].p, "75");
        });

        // 39. Betashares Direct excludes closed positions where net quantity <= 0
        runTest("Betashares Direct excludes closed positions where net quantity is zero or closed", () => {
            const adapter = env.BrokerRegistry.get("betashares_direct");

            const csv = "Date,Activity Type,Symbol,Quantity,Price,Amount\n" +
                "15/03/2026,Sell,NDQ,10.0000,42.00,420.00\n" +
                "01/03/2026,Buy,A200,15.0000,130.00,1950.00\n" +
                "01/01/2026,Buy,NDQ,10.0000,38.00,380.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            // NDQ was completely closed (10 bought, 10 sold), only A200 remains
            assert.strictEqual(res.holdings.length, 1);
            assert.strictEqual(res.holdings[0].t, "A200");
            assert.strictEqual(res.holdings[0].q, "15");
        });

        // 40. Betashares Direct captures latest trade execution price in descending order file
        runTest("Betashares Direct captures latest trade execution price from descending order file", () => {
            const adapter = env.BrokerRegistry.get("betashares_direct");

            // Row 1 is a sell at 110.5, Row 2 is buy at 100, Row 3 is buy at 90
            const csv = "Date,Activity Type,Symbol,Quantity,Price,Amount\n" +
                "20/03/2026,Sell,IVV,2.0000,110.50,221.00\n" +
                "10/02/2026,Buy,IVV,5.0000,100.00,500.00\n" +
                "01/01/2026,Buy,IVV,10.0000,90.00,900.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings[0].t, "IVV");
            assert.strictEqual(res.holdings[0].q, "13");
            // Must capture latest trade price 110.5, not 100 or 90
            assert.strictEqual(res.holdings[0].p, "110.5");
        });

        // 41. updateCsvGuide toggles #csvStrategyNote for transaction strategy formats
        runTest("updateCsvGuide() displays #csvStrategyNote for Betashares Direct and hides for snapshot formats", () => {
            // Betashares Direct: strategy note should be visible
            env.updateCsvGuide("betashares_direct");
            let noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "block");

            // Generic Shares: note should be hidden
            env.updateCsvGuide("generic_shares");
            noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "none");

            // Nabtrade: note should be hidden
            env.updateCsvGuide("nabtrade");
            noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "none");

            // Switch back to Betashares Direct: note appears again
            env.onCsvFormatChange("betashares_direct");
            noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "block");
        });

        // 42. Betashares Direct end-to-end import applies holdings, switches to shares mode, and preserves target weights
        runTest("Betashares Direct end-to-end import applies holdings, switches to shares mode, and preserves target weights", () => {
            // Existing portfolio configured in Value mode with 60/40 allocation
            env.onSettingInputModeToggle(false);
            env.setHoldings([
                { t: "DHHF", v: "6000", w: "60" },
                { t: "BGBL", v: "4000", w: "40" }
            ]);

            env.openCsvModal();
            env.onCsvFormatChange("betashares_direct");

            const guide = env.getEl("csvGuideContent");
            assert.ok(guide.innerHTML.includes("Betashares Direct Activity CSV Export"));

            const noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "block");

            const csv = "Date,Activity Type,Symbol,Quantity,Price,Amount\n" +
                "15/03/2026,Auto-Invest,DHHF,10.2500,35.00,358.75\n" +
                "10/03/2026,Buy,BGBL,5.5000,72.00,396.00\n" +
                "01/03/2026,Buy,DHHF,50.0000,34.00,1700.00";

            env.processCsvText(csv, "betashares_activity.csv", 2048);

            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);
            assert.strictEqual(env.getStagedCsvMode(), "shares");

            env.executeCsvImport();

            // Modal closed
            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);

            // Mode switched to shares automatically
            assert.strictEqual(env.isSharesInputMode(), true);

            // Check imported holdings and preserved weights
            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);

            // DHHF: 50 + 10.25 = 60.25, price 35.00, weight preserved at 60
            const dhhf = holdings.find(h => h.t === "DHHF");
            assert.ok(dhhf);
            assert.strictEqual(dhhf.q, "60.25");
            assert.strictEqual(dhhf.p, "35");
            assert.strictEqual(dhhf.w, "60");

            // BGBL: 5.5, price 72.00, weight preserved at 40
            const bgbl = holdings.find(h => h.t === "BGBL");
            assert.ok(bgbl);
            assert.strictEqual(bgbl.q, "5.5");
            assert.strictEqual(bgbl.p, "72");
            assert.strictEqual(bgbl.w, "40");
        });

        // 43. BrokerRegistry includes CommSec adapter as 5th registered option
        runTest("BrokerRegistry includes CommSec adapter as 5th registered option", () => {
            const adapter = env.BrokerRegistry.get("commsec");
            assert.ok(adapter);
            assert.strictEqual(adapter.id, "commsec");
            assert.strictEqual(adapter.name, "CommSec");
            assert.strictEqual(adapter.isTransactionStrategy, true);
            assert.strictEqual(adapter.mode, "shares");
            assert.ok(adapter.guideHtml.includes("CommSec Confirmations / Transactions CSV Export"));
        });

        // 44. CommSec adapter parses Security, Buy/Sell, Units, and Average Price
        runTest("CommSec adapter parses Security, Buy/Sell, Units, and Average Price", () => {
            const adapter = env.BrokerRegistry.get("commsec");

            const csv = "Date,Confirmation,Security,Buy/Sell,Units,Average Price,Brokerage,Total\n" +
                "15/03/2026,C1003,VAS,Buy,50,95.50,$10.00,$4785.00\n" +
                "10/02/2026,C1002,CBA,Buy,20,120.00,$10.00,$2410.00\n" +
                "01/02/2026,C1001,VAS,Sell,10,94.00,$10.00,$930.00\n" +
                "15/01/2026,C1000,VAS,Buy,20,90.00,$10.00,$1810.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 2);

            // VAS: 50 - 10 + 20 = 60 units. Latest trade price (from top row) is 95.50
            const vas = res.holdings.find(h => h.t === "VAS");
            assert.ok(vas);
            assert.strictEqual(vas.q, "60");
            assert.strictEqual(vas.p, "95.5");
            assert.strictEqual(vas.v, "5730");

            // CBA: 20 units @ 120.00
            const cba = res.holdings.find(h => h.t === "CBA");
            assert.ok(cba);
            assert.strictEqual(cba.q, "20");
            assert.strictEqual(cba.p, "120");
            assert.strictEqual(cba.v, "2400");
        });

        // 45. CommSec adapter handles shorthand B/S and alternative price headers
        runTest("CommSec adapter handles shorthand B/S codes and Average Price ($) header", () => {
            const adapter = env.BrokerRegistry.get("commsec");

            const csv = "Date,Security,Buy / Sell,Units,Average Price ($)\n" +
                "15/03/2026,BHP,S,15,$42.50\n" +
                "01/02/2026,BHP,B,40,$40.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 1);

            const bhp = res.holdings[0];
            assert.strictEqual(bhp.t, "BHP");
            // 40 - 15 = 25 units
            assert.strictEqual(bhp.q, "25");
            // Latest trade price was the sell at 42.50
            assert.strictEqual(bhp.p, "42.5");
        });

        // 46. updateCsvGuide displays #csvStrategyNote for CommSec
        runTest("updateCsvGuide() displays #csvStrategyNote for CommSec", () => {
            env.updateCsvGuide("commsec");
            const noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "block");
        });

        // 47. CommSec end-to-end import applies holdings, switches to shares mode, and preserves target weights
        runTest("CommSec end-to-end import applies holdings, switches to shares mode, and preserves target weights", () => {
            env.onSettingInputModeToggle(false);
            env.setHoldings([
                { t: "VAS", v: "5000", w: "70" },
                { t: "CBA", v: "2000", w: "30" }
            ]);

            env.openCsvModal();
            env.onCsvFormatChange("commsec");

            const guide = env.getEl("csvGuideContent");
            assert.ok(guide.innerHTML.includes("CommSec Confirmations / Transactions CSV Export"));

            const csv = "Date,Confirmation,Security,Buy/Sell,Units,Average Price\n" +
                "15/03/2026,C2001,VAS,Buy,30,96.00\n" +
                "10/03/2026,C2000,CBA,Buy,15,122.50";

            env.processCsvText(csv, "commsec_transactions.csv", 1024);
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);
            assert.strictEqual(env.getStagedCsvMode(), "shares");

            env.executeCsvImport();

            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);
            assert.strictEqual(env.isSharesInputMode(), true);

            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);

            const vas = holdings.find(h => h.t === "VAS");
            assert.ok(vas);
            assert.strictEqual(vas.q, "30");
            assert.strictEqual(vas.p, "96");
            assert.strictEqual(vas.w, "70"); // Preserved existing weight

            const cba = holdings.find(h => h.t === "CBA");
            assert.ok(cba);
            assert.strictEqual(cba.q, "15");
            assert.strictEqual(cba.p, "122.5");
            assert.strictEqual(cba.w, "30"); // Preserved existing weight
        });

        // 48. BrokerRegistry includes Pearler adapter as 6th registered option
        runTest("BrokerRegistry includes Pearler adapter as 6th registered option", () => {
            const adapter = env.BrokerRegistry.get("pearler");
            assert.ok(adapter);
            assert.strictEqual(adapter.id, "pearler");
            assert.strictEqual(adapter.name, "Pearler");
            assert.strictEqual(adapter.isTransactionStrategy, true);
            assert.strictEqual(adapter.isDescendingOrder, false); // Ascending order
            assert.strictEqual(adapter.mode, "shares");
            assert.ok(adapter.guideHtml.includes("Pearler Transactions CSV Export"));
        });

        // 49. Pearler adapter parses Symbol, Trade Type, Quantity, Price with ascending chronological order
        runTest("Pearler adapter correctly resolves latest price from ascending chronological order", () => {
            const adapter = env.BrokerRegistry.get("pearler");

            // Ascending order: earliest transactions first, newest transactions last
            const csv = "Date,Symbol,Trade Type,Quantity,Price\n" +
                "01/01/2026,DHHF,Buy,10,32.00\n" +
                "01/02/2026,VGS,Buy,15,110.00\n" +
                "15/02/2026,DHHF,Buy,20,33.50\n" +
                "01/03/2026,DHHF,Sell,5,34.00\n" +
                "15/03/2026,DHHF,Buy,10,35.50";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 2);

            // DHHF: 10 + 20 - 5 + 10 = 35 units.
            // Latest trade price must be 35.50 (from the bottom row on 15/03/2026)
            const dhhf = res.holdings.find(h => h.t === "DHHF");
            assert.ok(dhhf);
            assert.strictEqual(dhhf.q, "35");
            assert.strictEqual(dhhf.p, "35.5");
            assert.strictEqual(dhhf.v, "1242.5");

            // VGS: 15 units @ 110.00
            const vgs = res.holdings.find(h => h.t === "VGS");
            assert.ok(vgs);
            assert.strictEqual(vgs.q, "15");
            assert.strictEqual(vgs.p, "110");
            assert.strictEqual(vgs.v, "1650");
        });

        // 50. Pearler adapter handles fractional quantities and closed positions
        runTest("Pearler adapter handles fractional quantities and excludes closed positions", () => {
            const adapter = env.BrokerRegistry.get("pearler");

            const csv = "Date,Symbol,Trade Type,Quantity,Price\n" +
                "01/01/2026,NDQ,Buy,10,40.00\n" +
                "15/01/2026,A200,Buy,12.3456,125.00\n" +
                "01/02/2026,NDQ,Sell,10,42.00\n" +
                "15/02/2026,A200,Sell,2.1234,130.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            // NDQ was closed (10 buy, 10 sell), only A200 remains
            assert.strictEqual(res.holdings.length, 1);

            const a200 = res.holdings[0];
            assert.strictEqual(a200.t, "A200");
            // 12.3456 - 2.1234 = 10.2222
            assert.strictEqual(a200.q, "10.2222");
            // Latest price is the sell at 130
            assert.strictEqual(a200.p, "130");
        });

        // 51. updateCsvGuide displays #csvStrategyNote for Pearler
        runTest("updateCsvGuide() displays #csvStrategyNote for Pearler", () => {
            env.updateCsvGuide("pearler");
            const noteState = env.getCsvStrategyNoteState();
            assert.strictEqual(noteState.display, "block");
        });

        // 52. Pearler end-to-end import applies holdings, switches to shares mode, and preserves target weights
        runTest("Pearler end-to-end import applies holdings, switches to shares mode, and preserves target weights", () => {
            env.onSettingInputModeToggle(false);
            env.setHoldings([
                { t: "DHHF", v: "8000", w: "80" },
                { t: "VGS", v: "2000", w: "20" }
            ]);

            env.openCsvModal();
            env.onCsvFormatChange("pearler");

            const guide = env.getEl("csvGuideContent");
            assert.ok(guide.innerHTML.includes("Pearler Transactions CSV Export"));

            const csv = "Date,Symbol,Trade Type,Quantity,Price\n" +
                "01/01/2026,DHHF,Buy,50,33.00\n" +
                "15/01/2026,VGS,Buy,20,115.00\n" +
                "01/02/2026,DHHF,Buy,25,35.00";

            env.processCsvText(csv, "pearler_trades.csv", 1024);
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);
            assert.strictEqual(env.getStagedCsvMode(), "shares");

            env.executeCsvImport();

            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);
            assert.strictEqual(env.isSharesInputMode(), true);

            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);

            const dhhf = holdings.find(h => h.t === "DHHF");
            assert.ok(dhhf);
            assert.strictEqual(dhhf.q, "75");
            assert.strictEqual(dhhf.p, "35"); // Latest price from bottom row
            assert.strictEqual(dhhf.w, "80"); // Preserved existing target weight

            const vgs = holdings.find(h => h.t === "VGS");
            assert.ok(vgs);
            assert.strictEqual(vgs.q, "20");
            assert.strictEqual(vgs.p, "115");
            assert.strictEqual(vgs.w, "20"); // Preserved existing target weight
        });

        // 53. BrokerRegistry includes Vanguard adapter as 7th registered option
        runTest("BrokerRegistry includes Vanguard adapter as 7th registered option", () => {
            const adapter = env.BrokerRegistry.get("vanguard");
            assert.ok(adapter);
            assert.strictEqual(adapter.id, "vanguard");
            assert.strictEqual(adapter.name, "Vanguard");
            assert.ok(adapter.guideHtml.includes("Vanguard Portfolio CSV Export"));
        });

        // 54. VanguardCsvAdapter in Share Price & Quantity Mode
        runTest("VanguardCsvAdapter parses Product ID, Quantity, Price in Share Price & Quantity mode", () => {
            env.onSettingInputModeToggle(true);
            const adapter = env.BrokerRegistry.get("vanguard");
            assert.strictEqual(adapter.mode, "shares");

            const csv = "Product ID,Product Name,Quantity,Price,Value\n" +
                "VAS,Vanguard Australian Shares Index ETF,60,96.50,$5790.00\n" +
                "VGS,Vanguard MSCI Index International Shares ETF,120,118.00,$14160.00";

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.mode, "shares");
            assert.strictEqual(res.holdings.length, 2);

            // Holding 1: VAS
            assert.strictEqual(res.holdings[0].t, "VAS");
            assert.strictEqual(res.holdings[0].q, "60");
            assert.strictEqual(res.holdings[0].p, "96.50");
            assert.strictEqual(res.holdings[0].v, "5790.00");
            assert.strictEqual(res.holdings[0].w, "");

            // Holding 2: VGS
            assert.strictEqual(res.holdings[1].t, "VGS");
            assert.strictEqual(res.holdings[1].q, "120");
            assert.strictEqual(res.holdings[1].p, "118.00");
            assert.strictEqual(res.holdings[1].v, "14160.00");
            assert.strictEqual(res.holdings[1].w, "");

            // Also parses when Value column is omitted, computing v = p * q
            const csvNoVal = "Product ID,Quantity,Price\nVAS,60,96.50\nVGS,120,118.00";
            const resNoVal = adapter.parse(csvNoVal);
            assert.strictEqual(resNoVal.success, true);
            assert.strictEqual(resNoVal.holdings[0].v, "5790");
            assert.strictEqual(resNoVal.holdings[1].v, "14160");
        });

        // 55. VanguardCsvAdapter in Value per Holding Mode
        runTest("VanguardCsvAdapter parses Product ID, Value in Value per Holding mode and preserves Price/Quantity", () => {
            env.onSettingInputModeToggle(false);
            const adapter = env.BrokerRegistry.get("vanguard");
            assert.strictEqual(adapter.mode, "value");

            const csv = 'Product ID,Product Name,Quantity,Price,Value\n' +
                'VAS,Vanguard Australian Shares Index ETF,60,96.50,"$5,790.00"\n' +
                'VGS,Vanguard MSCI Index International Shares ETF,120,118.00,"$14,160.00"';

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.mode, "value");
            assert.strictEqual(res.holdings.length, 2);

            // Holding 1: VAS
            assert.strictEqual(res.holdings[0].t, "VAS");
            assert.strictEqual(res.holdings[0].v, "5790.00");
            assert.strictEqual(res.holdings[0].p, "96.50");
            assert.strictEqual(res.holdings[0].q, "60");
            assert.strictEqual(res.holdings[0].w, "");

            // Holding 2: VGS
            assert.strictEqual(res.holdings[1].t, "VGS");
            assert.strictEqual(res.holdings[1].v, "14160.00");
            assert.strictEqual(res.holdings[1].p, "118.00");
            assert.strictEqual(res.holdings[1].q, "120");
            assert.strictEqual(res.holdings[1].w, "");
        });

        // 56. Toggling from Value Mode to Shares Mode retains pre-filled price and quantity from import
        runTest("Toggling from Value Mode to Shares Mode cleanly pre-fills price and quantity inputs", () => {
            env.onSettingInputModeToggle(false);
            env.openCsvModal();
            env.onCsvFormatChange("vanguard");

            const csv = 'Product ID,Quantity,Price,Value\n' +
                'A200,40,125.00,5000.00\n' +
                'NDQ,50,42.00,2100.00';

            env.processCsvText(csv, "vanguard_holdings.csv", 1024);
            env.executeCsvImport();

            // Value mode active
            assert.strictEqual(env.isSharesInputMode(), false);
            const containerVal = env.getEl("portfolioContainer");
            assert.ok(containerVal.innerHTML.includes('value="5000.00"'));
            assert.ok(containerVal.innerHTML.includes('value="2100.00"'));

            // Check holdingsData internally has p and q preserved
            const holdings = env.getHoldings();
            assert.strictEqual(holdings[0].t, "A200");
            assert.strictEqual(holdings[0].p, "125.00");
            assert.strictEqual(holdings[0].q, "40");
            assert.strictEqual(holdings[0].v, "5000.00");

            // User switches setting to Share Price & Quantity Input
            env.onSettingInputModeToggle(true);
            assert.strictEqual(env.isSharesInputMode(), true);

            // Price and Quantity inputs are cleanly populated without manual re-entry
            const containerShares = env.getEl("portfolioContainer");
            assert.strictEqual(containerShares.classList.contains("mode-shares"), true);
            assert.ok(containerShares.innerHTML.includes('value="125.00"'));
            assert.ok(containerShares.innerHTML.includes('value="40"'));
            assert.ok(containerShares.innerHTML.includes('value="42.00"'));
            assert.ok(containerShares.innerHTML.includes('value="50"'));
        });

        // 57. VanguardCsvAdapter automatically excludes Cash Account and Total summary rows
        runTest("VanguardCsvAdapter automatically excludes Cash Account and Total summary rows", () => {
            env.onSettingInputModeToggle(true);
            const adapter = env.BrokerRegistry.get("vanguard");

            const csv = 'Product ID,Quantity,Price,Value\n' +
                'VAS,50,95.50,"$4,775.00"\n' +
                'VANGUARD CASH ACCOUNT,,,2500.00\n' +
                'TOTAL,,,7275.00';

            const res = adapter.parse(csv);
            assert.strictEqual(res.success, true);
            assert.strictEqual(res.holdings.length, 1);
            assert.strictEqual(res.holdings[0].t, "VAS");
        });

        // 58. Vanguard CSV end-to-end import applies holdings and preserves target weights
        runTest("Vanguard CSV end-to-end import applies holdings and preserves target weights", () => {
            env.onSettingInputModeToggle(true);
            env.setHoldings([
                { t: "VAS", p: "90", q: "40", w: "60" },
                { t: "VGS", p: "110", q: "80", w: "40" }
            ]);

            env.openCsvModal();
            env.onCsvFormatChange("vanguard");

            const guide = env.getEl("csvGuideContent");
            assert.ok(guide.innerHTML.includes("Vanguard Portfolio CSV Export"));

            const csv = "Product ID,Product Name,Quantity,Price,Value\n" +
                "VAS,Vanguard Australian Shares,70,97.00,6790.00\n" +
                "VGS,Vanguard International Shares,100,120.00,12000.00";

            env.processCsvText(csv, "vanguard_export.csv", 1024);
            assert.strictEqual(env.getStagedCsvHoldings().length, 2);

            env.executeCsvImport();

            assert.strictEqual(env.getEl("csvModalOverlay").classList.contains("active"), false);

            const holdings = env.getHoldings();
            assert.strictEqual(holdings.length, 2);

            const vas = holdings.find(h => h.t === "VAS");
            assert.ok(vas);
            assert.strictEqual(vas.q, "70");
            assert.strictEqual(vas.p, "97.00");
            assert.strictEqual(vas.w, "60"); // Weight preserved

            const vgs = holdings.find(h => h.t === "VGS");
            assert.ok(vgs);
            assert.strictEqual(vgs.q, "100");
            assert.strictEqual(vgs.p, "120.00");
            assert.strictEqual(vgs.w, "40"); // Weight preserved
        });

        // 59. processCsvText auto-detects Vanguard CSV when dropdown is on generic_shares
        runTest("processCsvText() auto-detects Vanguard CSV when dropdown is on generic_shares", () => {
            env.openCsvModal();
            env.onCsvFormatChange("generic_shares");
            assert.strictEqual(env.getEl("csvFormatSelect").value, "generic_shares");

            // User uploads the Vanguard export format from screenshot
            const csv = 'Account name,Account number,Investment name,Product ID,Price date,Price,Quantity,Value\n' +
                'William Tu,79944112,holdings.export.csv.v,,28-Sep-26,,,\n' +
                ',,,,,,holdings.e,0\n' +
                ',,,SOP,28-Sep-26,0.1,5000,500\n';

            env.processCsvText(csv, "holdings.export.csv", 1024);

            // Auto-detection should have switched format to vanguard and succeeded!
            assert.strictEqual(env.getEl("csvFormatSelect").value, "vanguard");
            assert.strictEqual(env.getEl("csvDropZone").classList.contains("has-file"), true);
            assert.strictEqual(env.getStagedCsvHoldings().length, 1);
            assert.strictEqual(env.getStagedCsvHoldings()[0].t, "SOP");
            assert.strictEqual(env.getStagedCsvHoldings()[0].p, "0.1");
            assert.strictEqual(env.getStagedCsvHoldings()[0].q, "5000");
            assert.strictEqual(env.getStagedCsvHoldings()[0].v, "500");

            // Supported formats text displays 'Vanguard Format Detected'
            assert.strictEqual(env.getEl("csvSupportedFormats").textContent, "Vanguard Format Detected");
            assert.strictEqual(env.getEl("csvSupportedFormats").classList.contains("detected"), true);

            // Resetting drop state restores default note
            env.resetCsvDropState();
            assert.strictEqual(env.getEl("csvSupportedFormats").textContent, "File formats supported: .csv .xlsx .xlsm .xls");
            assert.strictEqual(env.getEl("csvSupportedFormats").classList.contains("detected"), false);
        });

        // 60. Explicit broker selection never auto-switches on parse error
        runTest("processCsvText() never auto-switches format when an explicit broker is selected", () => {
            env.openCsvModal();
            env.onCsvFormatChange("betashares_direct");
            assert.strictEqual(env.getEl("csvFormatSelect").value, "betashares_direct");

            // Upload a Vanguard CSV while Betashares Direct is selected
            const csv = 'Account name,Account number,Investment name,Product ID,Price date,Price,Quantity,Value\n' +
                'William Tu,79944112,holdings.export.csv.v,,28-Sep-26,,,\n' +
                ',,,SOP,28-Sep-26,0.1,5000,500\n';

            env.processCsvText(csv, "vanguard_on_betashares.csv", 1024);

            // Format must remain strictly on Betashares Direct
            assert.strictEqual(env.getEl("csvFormatSelect").value, "betashares_direct");
            // Must not stage holdings
            assert.strictEqual(env.getStagedCsvHoldings(), null);
            // Error banner must be shown with Betashares error message
            assert.ok(env.getEl("csvErrorBanner").innerText.includes("Betashares Direct"));
            // Supported formats text must remain default
            assert.strictEqual(env.getEl("csvSupportedFormats").textContent, "File formats supported: .csv .xlsx .xlsm .xls");
        });
    }

    console.log(`\n=================================================`);
    console.log(` MASTER TEST SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log(`=================================================\n`);
}

runAllMasterTests().catch(err => {
    console.error("Master test suite execution error:", err);
    process.exit(1);
});
