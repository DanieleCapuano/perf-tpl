export function registerSWCritical() {
    // Register service worker ASAP to catch early network requests
    (function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('[Critical] Service Worker not supported');
            return;
        }

        // Register immediately to intercept requests as soon as possible
        window.addEventListener('load', () => {
            // Use /sw.js for both dev and prod with injectManifest strategy
            const swPath = '/sw.js';
            const swOptions = { scope: '/' } as RegistrationOptions;
            
            navigator.serviceWorker
                .register(swPath, swOptions)
                .then(registration => {
                    console.log('[Critical] Service Worker registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('[Critical] New content available, please refresh.');
                                }
                            });
                        }
                    });

                    // Auto-update check
                    if (registration.waiting) {
                        console.log('[Critical] Service Worker update available');
                    }

                    if (registration.active && !navigator.serviceWorker.controller) {
                        console.log('[Critical] App ready to work offline');
                    }
                })
                .catch((error) => {
                    console.error('[Critical] Service Worker registration failed:', error);
                });
        });
    })();
}
