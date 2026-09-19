const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log("=================================================");
console.log("   PORTFOLIO REBALANCER - MASTER TEST RUNNER     ");
console.log("=================================================\n");

const startTime = Date.now();

// 1. Check file synchronization between root index.html and GitHub\Rebalance\index.html
console.log("[1/4] Verifying file synchronization...");
const rootHtmlPath = path.resolve(__dirname, '..', 'index.html');
const gitHubHtmlPath = path.resolve(__dirname, '..', 'GitHub', 'Rebalance', 'index.html');

if (fs.existsSync(gitHubHtmlPath)) {
    const rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');
    const gitHubHtml = fs.readFileSync(gitHubHtmlPath, 'utf8');
    if (rootHtml !== gitHubHtml) {
        console.error("  ✗ Synchronization Mismatch: index.html and GitHub/Rebalance/index.html differ!");
        process.exit(1);
    } else {
        console.log("  ✓ Files 100% in sync: root and GitHub copies are identical.\n");
    }
} else {
    console.log("  ℹ GitHub/Rebalance/index.html not found, skipping sync check.\n");
}

// 2. Run Deterministic Master Test Suite
console.log("[2/4] Launching Master Deterministic Test Suite...");
const masterProc = spawnSync(process.execPath, [path.join(__dirname, 'master_test_suite.js')], {
    stdio: 'inherit'
});
if (masterProc.status !== 0) {
    console.error("  ✗ Master Test Suite failed!");
    process.exit(masterProc.status || 1);
}

// 3. Run Property-Based Fuzz Invariant Suite
console.log("[3/4] Launching Fuzz Invariant Test Suite (3,000 simulations)...");
const fuzzProc = spawnSync(process.execPath, [path.join(__dirname, 'fuzz_invariant_suite.js')], {
    stdio: 'inherit'
});
if (fuzzProc.status !== 0) {
    console.error("  ✗ Fuzz Invariant Suite failed!");
    process.exit(fuzzProc.status || 1);
}

// 4. Run Cloudflare Worker & D1 Integration Suite
console.log("[4/4] Launching Cloudflare Worker & D1 Integration Suite...");
const backendProc = spawnSync(process.execPath, [path.join(__dirname, 'backend_test_suite.js')], {
    stdio: 'inherit'
});
if (backendProc.status !== 0) {
    console.error("  ✗ Backend Test Suite failed!");
    process.exit(backendProc.status || 1);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log("=================================================");
console.log(` ALL TEST SUITES PASSED CLEANLY in ${duration}s!`);
console.log("=================================================\n");

