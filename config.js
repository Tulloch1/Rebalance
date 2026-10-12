/**
 * =========================================================================
 * Rebalance Application Configuration & Brand Identifiers
 * =========================================================================
 * Centralizes all customer-facing branding, support channels, API endpoints,
 * and environment settings for turn-key deployment and institutional handover.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node.js CommonJS environment (for automated test runners & CLI scripts)
        module.exports = factory();
    } else {
        // Browser global environment
        root.REBALANCE_CONFIG = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    return {
        // --- Brand & Customer Support ---
        brand: {
            appName: "Rebalance",
            version: "v1.2.2",
            supportEmail: "rebalancecalculator@gmail.com",
            feedbackEmail: "rebalancecalculator@gmail.com",
            companyName: "Rebalance",
            websiteUrl: "https://rebalance-calculator.pages.dev/",
            disclaimerTitle: "Disclaimers",
            disclaimerText: "Rebalance is a portfolio calculation tool for informational purposes only and does not provide financial advice."
        },

        // --- API & Cloud Infrastructure ---
        api: {
            // Default production edge backend for encrypted vault persistence & auth
            productionUrl: "https://rebalance-api.portfolio-calculator.workers.dev",
            
            // Staging or development endpoint (optional override)
            stagingUrl: "",

            // Legacy endpoints that should be purged/ignored from localStorage migration
            legacyEndpoints: [
                "https://portfolio-rebalancer.wbtulloch.workers.dev"
            ],

            // Timeout in milliseconds for edge requests
            timeoutMs: 10000
        },

        // --- Cryptographic Engine Defaults ---
        // Internal domain salts for offline/guest key derivation (DO NOT CHANGE without migration plan)
        crypto: {
            defaultGuestSalt: "guest_backup@rebalance.local",
            defaultBackupSalt: "backup@rebalance.local",
            pbkdf2Iterations: 100000
        },

        // --- Feature Flags & Environment ---
        features: {
            enableCloudSync: true,
            enableEmergencyRecovery: true,
            enableCsvBrokerAdapters: true,
            enableNativePdfParser: true
        }
    };
}));

