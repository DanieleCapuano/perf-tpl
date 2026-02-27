/**
 * Critical initialization script - Inlined in HTML
 * Runs before React loads for instant setup
 */

// Feature detection
(function () {
    const features = {
        wasm: typeof WebAssembly === 'object',
        worker: typeof Worker !== 'undefined',
        sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
    };

    // Store in sessionStorage for quick access
    try {
        sessionStorage.setItem('features', JSON.stringify(features));
    } catch (e) {
        // Private mode or storage disabled
    }

    // Log features in dev mode
    if (import.meta.env.DEV) {
        console.log('[Critical] Features:', features);
    }

    // Capture performance metrics
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                // Log or send to analytics
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
                if (entry.entryType === 'first-input') {
                    const eventTiming = entry;
                    console.log('FID:', eventTiming.processingStart - eventTiming.startTime);
                }
            }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    // Report Web Vitals
    if ('performance' in window) {
        window.addEventListener('load', () => {
            // Core Web Vitals
            const paintEntries = performance.getEntriesByType('paint');
            const navigation = performance.getEntriesByType('navigation')[0];

            console.log('Paint Metrics:', paintEntries);
            console.log('Navigation:', navigation);
        });
    }
})();

// Performance mark for measuring
if ('performance' in window && performance.mark) {
    performance.mark('critical-script-end');
}
