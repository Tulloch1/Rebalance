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

            // With valid email in cleanSlateEmail
            env.getEl("cleanSlateEmail").value = "clean_test@example.com";
            await env.handleRequestResetCode();
            assert.strictEqual(env.getEl("cleanSlateStep1").style.display, "none");
            assert.strictEqual(env.getEl("cleanSlateStep2").style.display, "block");
            assert.ok(env.getEl("signInFeedback").innerText.includes("verification code has been sent"));
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

            // Valid code, missing card last 4
            env.getEl("cleanSlateCode").value = "123456";
            env.getEl("cleanSlateCardLast4").value = "12";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("last 4 digits"));

            // Valid card last 4, short password
            env.getEl("cleanSlateCardLast4").value = "4242";
            env.getEl("cleanSlateNewPassword").value = "short";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("at least 8 characters"));

            // Password mismatch
            env.getEl("cleanSlateNewPassword").value = "StrongPass123!";
            env.getEl("cleanSlateConfirmPassword").value = "DifferentPass!";
            await env.handleExecuteCleanSlate();
            assert.ok(env.getEl("signInFeedback").innerText.includes("do not match"));
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

    console.log(`\n=================================================`);
    console.log(` MASTER TEST SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log(`=================================================\n`);
}

runAllMasterTests().catch(err => {
    console.error("Master test suite execution error:", err);
    process.exit(1);
});
