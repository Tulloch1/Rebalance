const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.resolve(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    throw new Error("Could not find <script> tag in index.html");
}
const scriptCode = scriptMatch[1];

function createTestEnv() {
    const elements = {};

    function getOrCreateElement(id) {
        if (!elements[id]) {
            elements[id] = {
                id,
                value: '',
                innerText: '',
                innerHTML: '',
                style: {},
                classList: {
                    classes: new Set(),
                    add(c) { this.classes.add(c); },
                    remove(c) { this.classes.delete(c); },
                    toggle(c, force) {
                        if (force !== undefined) {
                            if (force) this.classes.add(c);
                            else this.classes.delete(c);
                        } else {
                            if (this.classes.has(c)) this.classes.delete(c);
                            else this.classes.add(c);
                        }
                    },
                    contains(c) { return this.classes.has(c); }
                },
                disabled: false,
                checked: false,
                setAttribute(attr, val) { this[attr] = val; },
                getAttribute(attr) { return this[attr] || null; },
                appendChild(child) {
                    this.children = this.children || [];
                    this.children.push(child);
                    if (child.innerHTML) this.innerHTML += child.innerHTML;
                },
                scrollIntoView() {},
                reset() {}
            };
        }
        return elements[id];
    }

    const documentListeners = {};
    const sandbox = {
        console,
        Math,
        parseFloat,
        parseInt,
        isNaN,
        isFinite,
        String,
        Array,
        JSON,
        Promise,
        Uint8Array,
        ArrayBuffer,
        btoa,
        atob,
        TextEncoder,
        TextDecoder,
        crypto: globalThis.crypto,
        document: {
            body: { style: {} },
            getElementById: (id) => getOrCreateElement(id),
            documentElement: { setAttribute() {} },
            addEventListener() {},
            querySelector: (sel) => getOrCreateElement(sel.replace(/^[.#]/, '')),
            querySelectorAll: (sel) => [getOrCreateElement(sel.replace(/^[.#]/, ''))],
            documentElement: {
                _attrs: { "data-theme": "dark" },
                setAttribute(attr, val) { this._attrs[attr] = val; },
                getAttribute(attr) { return this._attrs[attr] || null; }
            },
            addEventListener(event, fn) {
                if (!documentListeners[event]) documentListeners[event] = [];
                documentListeners[event].push(fn);
            },
            dispatchEvent(event) {
                const fns = documentListeners[event.type] || [];
                fns.forEach(fn => fn(event));
            },
            createElement: () => getOrCreateElement('temp_' + Math.random())
        },
        window: {
            crypto: globalThis.crypto,
            addEventListener() {},
            getSelection: () => ({ removeAllRanges() {}, addRange() {} })
        },
        localStorage: {
            _store: {},
            getItem(key) { return this._store[key] || null; },
            setItem(key, val) { this._store[key] = String(val); },
            removeItem(key) { delete this._store[key]; }
        },
        navigator: {
            clipboard: { writeText: () => Promise.resolve() }
        },
        setTimeout: (fn) => fn(),
        clearTimeout: () => {}
    };

    vm.createContext(sandbox);
    vm.runInContext(scriptCode, sandbox);

    return {
        sandbox,
        elements,
        getEl: getOrCreateElement,
        runDynaRebAlgorithm: sandbox.runDynaRebAlgorithm,
        runCompleteRebalanceAlgorithm: sandbox.runCompleteRebalanceAlgorithm,
        updateMinBuyState: sandbox.updateMinBuyState,
        calculateRebalance: sandbox.calculateRebalance,
        openInfoModal: sandbox.openInfoModal,
        closeInfoModal: sandbox.closeInfoModal,
        handleModalBackdropClick: sandbox.handleModalBackdropClick,
        switchInfoTab: sandbox.switchInfoTab,
        openAccountModal: sandbox.openAccountModal,
        closeAccountModal: sandbox.closeAccountModal,
        handleAccountBackdropClick: sandbox.handleAccountBackdropClick,
        switchAccountTab: sandbox.switchAccountTab,
        handleSignInSubmit: sandbox.handleSignInSubmit,
        handleSignUpSubmit: sandbox.handleSignUpSubmit,
        handleSignOut: sandbox.handleSignOut,
        saveSession: sandbox.saveSession,
        clearSession: sandbox.clearSession,
        getSession: sandbox.getSession,
        restoreSession: sandbox.restoreSession,
        updateAccountUI: sandbox.updateAccountUI,
        exportEncryptedBackupData: sandbox.exportEncryptedBackupData,
        importEncryptedBackupData: sandbox.importEncryptedBackupData,
        getCurrentAccount: () => vm.runInContext('currentAccount', sandbox),
        setCurrentAccount: (val) => { vm.runInContext(`currentAccount = ${val ? JSON.stringify(val) : 'null'};`, sandbox); },
        getCurrentPortfolioState: sandbox.getCurrentPortfolioState,
        loadPortfolioFromState: sandbox.loadPortfolioFromState,
        RebalanceCrypto: vm.runInContext('RebalanceCrypto', sandbox),
        RebalanceSync: vm.runInContext('RebalanceSync', sandbox),
        handleGenerateRecoveryKey: sandbox.handleGenerateRecoveryKey,
        copyRecoveryKey: sandbox.copyRecoveryKey,
        downloadRecoveryKit: sandbox.downloadRecoveryKit,
        toggleRecoverySection: sandbox.toggleRecoverySection,
        handleRecoverAccount: sandbox.handleRecoverAccount,
        getStoredAccounts: sandbox.getStoredAccounts,
        setStoredAccounts: sandbox.setStoredAccounts,
        openSettingsModal: sandbox.openSettingsModal,
        closeSettingsModal: sandbox.closeSettingsModal,
        switchSettingsTab: sandbox.switchSettingsTab,
        handleSettingsBackdropClick: sandbox.handleSettingsBackdropClick,
        onSettingThemeToggle: sandbox.onSettingThemeToggle,
        onSettingCurrencyChange: sandbox.onSettingCurrencyChange,
        onSettingRoundingToggle: sandbox.onSettingRoundingToggle,
        saveSyncEndpoint: sandbox.saveSyncEndpoint,
        pingSyncServer: sandbox.pingSyncServer,
        onSettingAutoSyncToggle: sandbox.onSettingAutoSyncToggle,
        handleManualSyncNow: sandbox.handleManualSyncNow,
        handleResetToExample: sandbox.handleResetToExample,
        handleClearAllHoldings: sandbox.handleClearAllHoldings,
        getCurrencySymbol: sandbox.getCurrencySymbol,
        updateCurrencySymbols: sandbox.updateCurrencySymbols,
        isWholeRoundingEnabled: sandbox.isWholeRoundingEnabled,
        formatMoney: sandbox.formatMoney,
        applyWholeDollarRounding: sandbox.applyWholeDollarRounding,
        dispatchDocumentEvent: (event) => sandbox.document.dispatchEvent(event),
        setHoldings(holdings) {
            const formatted = holdings.map(h => ({
                t: h.t !== undefined ? h.t : (h.name || ""),
                v: h.v !== undefined ? h.v : (h.value !== undefined ? String(h.value) : ""),
                w: h.w !== undefined ? h.w : (h.weight !== undefined ? String(h.weight) : (h.targ_weight !== undefined ? String(h.targ_weight * 100) : ""))
            }));
            vm.runInContext(`holdingsData = ${JSON.stringify(formatted)};`, sandbox);
        },
        getHoldings() {
            return vm.runInContext(`holdingsData;`, sandbox);
        },
        setInputs({ deposit = "", minBuy = "", complete = false }) {
            getOrCreateElement("deposit").value = String(deposit);
            getOrCreateElement("minBuy").value = String(minBuy);
            getOrCreateElement("completeRebalance").checked = Boolean(complete);
            sandbox.updateMinBuyState();
        },
        getCalcButtonState() {
            const btn = getOrCreateElement("btnCalc");
            const notice = getOrCreateElement("calcNotice");
            return {
                disabled: Boolean(btn.disabled || btn.classList.contains("disabled")),
                noticeText: notice.innerText || "",
                noticeVisible: notice.style.display !== "none" && Boolean(notice.innerText)
            };
        },
        getErrorMessages() {
            const errEl = getOrCreateElement("errorMessage");
            if (errEl.style.display === "none" || (!errEl.innerHTML && !errEl.innerText)) {
                return [];
            }
            if (errEl.innerHTML.includes("<div>")) {
                const matches = errEl.innerHTML.match(/<div>(.*?)<\/div>/g);
                if (matches) {
                    return matches.map(m => m.replace(/<\/?div>/g, ''));
                }
            }
            return errEl.innerText ? [errEl.innerText] : [];
        }
    };
}

module.exports = {
    createTestEnv,
    htmlPath
};
