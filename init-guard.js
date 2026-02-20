(function () {

    // ─────────────────────────────────────────────────────────────────────────
    // 1. iOS / Instagram IAB WebKit Polyfill (Hardened)
    // ─────────────────────────────────────────────────────────────────────────
    // Analytics SDKs (GTM, Clarity, Cordova, etc.) call patterns like:
    //   window.webkit.messageHandlers.cordova_iab.postMessage(...)
    //   window.webkit.messageHandlers['myHandler'].postMessage(...)
    // On non-native browsers these sub-keys are undefined → TypeError crash.
    // Solution: use a Proxy that returns a no-op object for ANY handler access.

    var _noopHandler = {
        postMessage: function () { },
        addEventListener: function () { },
        removeEventListener: function () { }
    };

    var _handlersProxy = (typeof Proxy !== 'undefined')
        ? new Proxy({}, {
            get: function (target, prop) {
                // Return a no-op handler for every named handler
                return _noopHandler;
            }
        })
        : _noopHandler; // Proxy not available (very old Safari) — safe fallback

    if (typeof window.webkit === 'undefined' || !window.webkit.messageHandlers) {
        window.webkit = { messageHandlers: _handlersProxy };
    } else if (!window.webkit.messageHandlers) {
        window.webkit.messageHandlers = _handlersProxy;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Targeted WebKit Error Suppressor
    // ─────────────────────────────────────────────────────────────────────────
    // Suppress the specific WebKit/Instagram error pattern without swallowing
    // real application errors. This acts as a safety net for third-party
    // scripts that bypass the polyfill.

    var _prevOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
        if (message && typeof message === 'string' &&
            (message.indexOf('webkit') !== -1 ||
                message.indexOf('messageHandlers') !== -1 ||
                message.indexOf('cordova_iab') !== -1)) {
            // Swallow WebKit-specific errors silently
            return true; // prevents default browser error handling
        }
        // Delegate everything else to the previous handler (or default)
        if (typeof _prevOnError === 'function') {
            return _prevOnError.apply(this, arguments);
        }
        return false;
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Instagram / Facebook In-App Browser (IAB) Compatibility
    // ─────────────────────────────────────────────────────────────────────────
    // Instagram IAB blocks window.open() — external links silently fail.
    // Patch: detect IAB and redirect via location.href instead.

    var ua = navigator.userAgent || '';
    var isInstagramIAB = (ua.indexOf('Instagram') !== -1 ||
        ua.indexOf('FBAN') !== -1 ||
        ua.indexOf('FBAV') !== -1);

    if (isInstagramIAB) {
        var _origOpen = window.open;
        window.open = function (url) {
            if (url && typeof url === 'string') {
                try {
                    window.location.href = url;
                } catch (e) { /* fail silently */ }
            } else {
                return _origOpen.apply(this, arguments);
            }
        };
    }

    // 2. Dead Click Prevention (Interaction Guard)
    // Queue clicks on critical buttons until the main app loads.

    window._interactionQueue = [];
    const criticalFunctions = [
        'selectPackage',
        'openPricingModal',
        'closePricingModal',
        'handleCostCalculatorClick',
        'openSyncMatchGate',
        'openCollaborationModal',
        'initializeQuizShell',
        'startQuizWithName',
        'redirectToRazorpay',
        'downloadReport',
        'sharePDF',
        'copyReportLink',
        'shareToWhatsApp',
        'shareViaEmail'
    ];

    // Create temporary stubs
    criticalFunctions.forEach(fnName => {
        if (!window[fnName]) {
            window[fnName] = function (...args) {
                console.log(`[InitGuard] Queued ${fnName}`, args);

                // Show immediate feedback
                const toast = document.createElement('div');
                toast.innerText = "Initializing... Please wait.";
                Object.assign(toast.style, {
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#0F172A',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    zIndex: '99999',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'opacity 0.5s ease'
                });
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 500);
                }, 2000);

                // Queue the action
                window._interactionQueue.push({ fn: fnName, args: args });
            };
        }
    });

    // 3. Replay Queue when App Loads
    window.addEventListener('load', function () {
        // Small delay to ensure core-app.js has executed and overwritten the stubs
        setTimeout(() => {
            console.log(`[InitGuard] Replaying ${window._interactionQueue.length} queued actions.`);

            // We need to check if the function has been replaced by the real one.
            // Since we defined the stub on window, the real script (if deferred) *should* overwrite it 
            // IF it is defined as `window.fn = ...` or `function fn() {}` at standard scope.

            // However, verify if core-app.js functions are exposed correctly.
            // Based on core-app.js analysis, they are `window.selectPackage = ...` or pure function declarations.
            // Function declarations in core-app.js might NOT overwrite window properties if they are configurable=false (rare)
            // OR if the stub was defined with `const` (it wasn't).

            // A safer way is to rely on the fact that core-app.js runs. 
            // BUT, if core-app.js assigns `window.selectPackage = ...`, it WILL overwrite our stub.

            // PROBLEM: If core-app.js uses `function selectPackage() {}`, that declaration is hoisted 
            // within the script's scope. If it's global, it overwrites.

            // To be absolutely sure, we can dispatch the events again or manually call the new functions
            // IF we can get a reference to them. 
            // But since we overwrote the global name, the "Real" function might have trouble initializing 
            // if it was a simple `function selectPackage() {}` declaration that got shadowed?
            // Actually, `var` or `function` declarations usually overwrite properties.

            // Let's assume standard behavior: deferred script overwrites global property.

            const queue = window._interactionQueue;
            window._interactionQueue = []; // Clear

            queue.forEach(item => {
                const realFn = window[item.fn];
                // Check if it's still our stub (checking existing property or toString match is hacky)
                // Better: check if `realFn` is different from the stub we made? 
                // We'll just try to execute it. If it's still the stub, it will queue again (loop).
                // To prevent loop, we can flag the stub.

                if (realFn && !realFn._isStub) {
                    console.log(`[InitGuard] Executing real ${item.fn}`);
                    realFn.apply(window, item.args);
                } else {
                    console.warn(`[InitGuard] Function ${item.fn} still not ready.`);
                }
            });

        }, 100); // 100ms buffer after load
    });

    // Mark our stubs
    criticalFunctions.forEach(fnName => {
        if (window[fnName]) {
            window[fnName]._isStub = true;
        }
    });

})();
