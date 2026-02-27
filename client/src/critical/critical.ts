/**
 * Critical initialization script - Inlined in HTML
 * Runs before React loads for instant setup
 * 
 * This file is built by Vite before being inlined, so you can use:
 * - TypeScript syntax
 * - Import statements
 * - Environment variables (import.meta.env)
 */

interface BrowserFeatures {
  wasm: boolean;
  worker: boolean;
  sharedArrayBuffer: boolean;
  serviceWorker: boolean;
}

// Feature detection
(function detectFeatures() {
  const features: BrowserFeatures = {
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
    console.log('[Critical] Browser features:', features);
  }
})();

// Performance monitoring
(function setupPerformanceMonitoring() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('[Critical] LCP:', entry.startTime.toFixed(2), 'ms');
      }
      if (entry.entryType === 'first-input') {
        const eventTiming = entry as PerformanceEventTiming;
        const fid = eventTiming.processingStart - eventTiming.startTime;
        console.log('[Critical] FID:', fid.toFixed(2), 'ms');
      }
    }
  });

  try {
    observer.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    });
  } catch (e) {
    // Browser doesn't support these entry types
  }
})();

// Performance mark
if ('performance' in window && performance.mark) {
  performance.mark('critical-script-end');
}
