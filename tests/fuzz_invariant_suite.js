const assert = require('assert');
const { createTestEnv } = require('./test_helper');

const env = createTestEnv();

console.log("=================================================");
console.log("   RUNNING PROPERTY-BASED FUZZ INVARIANT SUITE   ");
console.log("=================================================\n");

// Pseudo-random number generator with seed for reproducibility
function createRng(seed = 123456789) {
    let s = seed;
    return function() {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}

const rng = createRng(42);

function randBetween(min, max) {
    return min + rng() * (max - min);
}

function randInt(min, max) {
    return Math.floor(randBetween(min, max + 1));
}

function generateRandomHoldings(count) {
    // Generate weights that strictly sum to 100%
    const rawWeights = [];
    for (let i = 0; i < count; i++) {
        rawWeights.push(randBetween(1, 100));
    }
    const sumRaw = rawWeights.reduce((a, b) => a + b, 0);
    const weights = rawWeights.map(w => w / sumRaw);

    // Ensure sum is exactly 1.0 (fix minor floating point in last asset)
    const sumExceptLast = weights.slice(0, count - 1).reduce((a, b) => a + b, 0);
    weights[count - 1] = Math.max(0.001, 1.0 - sumExceptLast);

    const holdings = [];
    for (let i = 0; i < count; i++) {
        const val = Math.round(randBetween(10, 100000) * 100) / 100;
        holdings.push({
            name: `A${i + 1}`,
            value: val,
            targ_weight: weights[i]
        });
    }
    return holdings;
}

let totalIterations = 0;
let totalChecks = 0;

// -------------------------------------------------------------------------
// FUZZ TEST CATEGORY 1: Dynamic Rebalance (Deposits > 0)
// -------------------------------------------------------------------------
console.log("Running Category 1: Dynamic Rebalance (Deposit) Fuzzing [1,000 runs]...");
for (let iter = 0; iter < 1000; iter++) {
    totalIterations++;
    const count = randInt(2, 8);
    const holdings = generateRandomHoldings(count);
    const initialPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);

    const deposit = Math.round(randBetween(1, 20000) * 100) / 100;
    const minBuyChoices = [0, 10, 25, 50, 100, 250];
    const minBuy = minBuyChoices[randInt(0, minBuyChoices.length - 1)];

    const res = env.runDynaRebAlgorithm(deposit, holdings, minBuy);

    // Invariant 1: Cash Conservation (final portfolio value == initial + deposit)
    const finalPortfolioValue = res.assets.reduce((sum, a) => sum + a.value + a.cut, 0);
    assert.ok(
        Math.abs(finalPortfolioValue - (initialPortfolioValue + deposit)) < 0.05,
        `Iter ${iter}: Final portfolio value (${finalPortfolioValue}) != Initial (${initialPortfolioValue}) + Deposit (${deposit})`
    );
    totalChecks++;

    // Invariant 2: Transaction Net Conservation (sum of cuts == deposit)
    const sumCuts = res.assets.reduce((sum, a) => sum + a.cut, 0);
    assert.ok(
        Math.abs(sumCuts - deposit) < 0.05,
        `Iter ${iter}: Sum of cuts (${sumCuts}) != Deposit (${deposit})`
    );
    totalChecks++;

    // Invariant 3: Directional Rebalance (no negative cuts allowed in deposit mode)
    for (const a of res.assets) {
        assert.ok(
            a.cut >= -0.0001,
            `Iter ${iter}: Negative cut found on asset ${a.name} during deposit: ${a.cut}`
        );
        assert.ok(
            a.value + a.cut >= -0.0001,
            `Iter ${iter}: Negative final value found on asset ${a.name}: ${a.value + a.cut}`
        );
        totalChecks += 2;
    }

    // Invariant 4: Minimum Transaction Compliance
    if (minBuy > 0) {
        if (deposit >= minBuy) {
            for (const a of res.assets) {
                if (a.cut > 0.005) {
                    assert.ok(
                        a.cut >= minBuy - 0.05,
                        `Iter ${iter}: Cut for ${a.name} (${a.cut}) is below minBuy (${minBuy}) when deposit (${deposit}) >= minBuy`
                    );
                    totalChecks++;
                }
            }
        } else {
            // When deposit < minBuy, threshold warning should be active and only 1 asset receives deposit
            assert.strictEqual(
                res.isThresholdWarning,
                true,
                `Iter ${iter}: Expected threshold warning when deposit (${deposit}) < minBuy (${minBuy})`
            );
            const activeCuts = res.assets.filter(a => a.cut > 0.005);
            assert.strictEqual(
                activeCuts.length,
                1,
                `Iter ${iter}: Expected exactly 1 active cut when deposit < minBuy, found ${activeCuts.length}`
            );
            totalChecks += 2;
        }
    }
}
console.log("  ✓ Category 1 passed all invariant assertions (1,000 runs)\n");

// -------------------------------------------------------------------------
// FUZZ TEST CATEGORY 2: Dynamic Rebalance (Withdrawals < 0)
// -------------------------------------------------------------------------
console.log("Running Category 2: Dynamic Rebalance (Withdrawal) Fuzzing [1,000 runs]...");
for (let iter = 0; iter < 1000; iter++) {
    totalIterations++;
    const count = randInt(2, 8);
    const holdings = generateRandomHoldings(count);
    const initialPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);

    // Withdrawal amount between $1 and 80% of total portfolio
    const maxWithdrawal = initialPortfolioValue * 0.8;
    const withdrawalAmount = Math.max(1, Math.round(randBetween(1, maxWithdrawal) * 100) / 100);
    const added = -withdrawalAmount;

    const minBuyChoices = [0, 10, 25, 50, 100];
    const minBuy = minBuyChoices[randInt(0, minBuyChoices.length - 1)];

    const res = env.runDynaRebAlgorithm(added, holdings, minBuy);

    // Invariant 1: Cash Conservation
    const finalPortfolioValue = res.assets.reduce((sum, a) => sum + a.value + a.cut, 0);
    assert.ok(
        Math.abs(finalPortfolioValue - (initialPortfolioValue + added)) < 0.05,
        `Iter ${iter}: Final portfolio value (${finalPortfolioValue}) != Initial (${initialPortfolioValue}) + Withdrawal (${added})`
    );
    totalChecks++;

    // Invariant 2: Transaction Net Conservation (sum of cuts == added)
    const sumCuts = res.assets.reduce((sum, a) => sum + a.cut, 0);
    assert.ok(
        Math.abs(sumCuts - added) < 0.05,
        `Iter ${iter}: Sum of cuts (${sumCuts}) != Withdrawal (${added})`
    );
    totalChecks++;

    // Invariant 3: Directional Rebalance (no positive cuts allowed in withdrawal mode)
    for (const a of res.assets) {
        assert.ok(
            a.cut <= 0.0001,
            `Iter ${iter}: Positive cut found on asset ${a.name} during withdrawal: ${a.cut}`
        );
        assert.ok(
            a.value + a.cut >= -0.0001,
            `Iter ${iter}: Final value of ${a.name} became negative (${a.value + a.cut})`
        );
        totalChecks += 2;
    }

    // Invariant 4: Minimum Transaction Compliance
    if (minBuy > 0) {
        if (withdrawalAmount >= minBuy) {
            for (const a of res.assets) {
                if (Math.abs(a.cut) > 0.005) {
                    assert.ok(
                        Math.abs(a.cut) >= minBuy - 0.05,
                        `Iter ${iter}: Sell order for ${a.name} (${a.cut}) is below minBuy (${minBuy})`
                    );
                    totalChecks++;
                }
            }
        }
    }
}
console.log("  ✓ Category 2 passed all invariant assertions (1,000 runs)\n");

// -------------------------------------------------------------------------
// FUZZ TEST CATEGORY 3: Complete Rebalance (Buys + Sells, Deposit / Withdrawal / Zero)
// -------------------------------------------------------------------------
console.log("Running Category 3: Complete Rebalance Fuzzing [1,000 runs]...");
for (let iter = 0; iter < 1000; iter++) {
    totalIterations++;
    const count = randInt(2, 8);
    const holdings = generateRandomHoldings(count);
    const initialPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);

    // Decide cash flow type: 40% positive deposit, 40% withdrawal, 20% zero cash flow
    const typeRoll = rng();
    let added = 0;
    if (typeRoll < 0.4) {
        added = Math.round(randBetween(10, 10000) * 100) / 100;
    } else if (typeRoll < 0.8) {
        const maxWithdrawal = initialPortfolioValue * 0.75;
        added = -Math.max(1, Math.round(randBetween(10, maxWithdrawal) * 100) / 100);
    } else {
        added = 0; // zero cash flow
    }

    const minBuyChoices = [0, 10, 25, 50, 100];
    const minBuy = minBuyChoices[randInt(0, minBuyChoices.length - 1)];

    const res = env.runCompleteRebalanceAlgorithm(added, holdings, minBuy);

    // Invariant 1: Cash Conservation (final == initial + added)
    const finalPortfolioValue = res.assets.reduce((sum, a) => sum + a.value + a.cut, 0);
    assert.ok(
        Math.abs(finalPortfolioValue - (initialPortfolioValue + added)) < 0.05,
        `Iter ${iter}: Final portfolio value (${finalPortfolioValue}) != Initial (${initialPortfolioValue}) + Added (${added})`
    );
    totalChecks++;

    // Invariant 2: Net Flow Conservation (buys - sells == added)
    let totalBought = 0;
    let totalSold = 0;
    for (const a of res.assets) {
        if (a.cut > 0) totalBought += a.cut;
        if (a.cut < 0) totalSold += Math.abs(a.cut);
    }
    assert.ok(
        Math.abs((totalBought - totalSold) - added) < 0.05,
        `Iter ${iter}: Net cash flow (bought: ${totalBought}, sold: ${totalSold}) != Added (${added})`
    );
    totalChecks++;

    // Invariant 3: Non-negativity
    for (const a of res.assets) {
        assert.ok(
            a.value + a.cut >= -0.001,
            `Iter ${iter}: Final value of ${a.name} is negative (${a.value + a.cut})`
        );
        totalChecks++;
    }

    // Invariant 4: Minimum Transaction Compliance
    if (minBuy > 0) {
        for (const a of res.assets) {
            if (Math.abs(a.cut) > 0.005) {
                assert.ok(
                    Math.abs(a.cut) >= minBuy - 0.05,
                    `Iter ${iter}: Complete Rebalance order for ${a.name} (${a.cut}) is below minBuy (${minBuy})`
                );
                totalChecks++;
            }
        }
    }
}
console.log("  ✓ Category 3 passed all invariant assertions (1,000 runs)\n");

console.log("=================================================");
console.log(` FUZZ SUITE COMPLETE: ${totalIterations} PORTFOLIO SIMULATIONS`);
console.log(` TOTAL INVARIANT CHECKS PASSED: ${totalChecks}`);
console.log("=================================================\n");

