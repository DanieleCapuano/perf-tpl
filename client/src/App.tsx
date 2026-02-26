import { useState, useMemo, useCallback, useEffect } from 'react';
import { StorageManager } from '@utils/storage-manager';
import { checkSharedArrayBufferSupport, logSharedBufferCapabilities, createSharedBuffer } from '@utils/shared-buffer-test';
import './App.css';

function App() {
  const [data, setData] = useState<any>(null);
  const [workerResult, setWorkerResult] = useState<string>('');
  const [sabSupport, setSabSupport] = useState<any>(null);
  const [sabResult, setSabResult] = useState<string>('');
  const [wasmResult, setWasmResult] = useState<string>('');
  const [wasmLoading, setWasmLoading] = useState<boolean>(false);

  // Check SharedArrayBuffer support on mount
  useEffect(() => {
    const support = checkSharedArrayBufferSupport();
    setSabSupport(support);
    logSharedBufferCapabilities();
  }, []);

  // Initialize Web Worker
  const dataWorker = useMemo(() => {
    const w = new Worker(new URL('@workers/data-worker', import.meta.url), { type: 'module' });

    w.onmessage = (e: MessageEvent) => {
      console.log('Data Worker message:', e.data);
      setWorkerResult(JSON.stringify(e.data, null, 2));
    };

    w.onerror = (error: ErrorEvent) => {
      console.error('Data Worker error:', error);
    };

    return w;
  }, []);

  const computeWorker = useMemo(() => {
    const w = new Worker(new URL('@workers/compute-worker', import.meta.url), { type: 'module' });

    w.onmessage = (e: MessageEvent) => {
      console.log('Compute Worker message:', e.data);
      setWorkerResult(JSON.stringify(e.data, null, 2));
    };

    w.onerror = (error: ErrorEvent) => {
      console.error('Compute Worker error:', error);
    };

    return w;
  }, []);

  const sharedBufferWorker = useMemo(() => {
    const w = new Worker(new URL('@workers/shared-buffer-worker', import.meta.url), { type: 'module' });

    w.onmessage = (e: MessageEvent) => {
      console.log('Shared Buffer Worker message:', e.data);
      setSabResult(JSON.stringify(e.data, null, 2));
    };

    w.onerror = (error: ErrorEvent) => {
      console.error('Shared Buffer Worker error:', error);
      setSabResult(`Error: ${error.message}`);
    };

    return w;
  }, []);

  // Fetch data using worker
  const handleFetchData = useCallback(() => {
    dataWorker.postMessage({
      action: 'fetch',
      url: '/api/data'
    });
  }, [dataWorker]);

  // Test WASM functions
  const handleWasmTest = useCallback((fn: string, params: any[], label: string) => {
    setWasmLoading(true);
    setWasmResult(`Running ${label}...`);
    
    const startTime = performance.now();
    computeWorker.postMessage({
      action: 'calculate',
      data: fn,
      params
    });

    // Store the function name for result display
    computeWorker.onmessage = (e: MessageEvent) => {
      const duration = performance.now() - startTime;
      const { success, result, error } = e.data;
      
      if (success) {
        let res;
        try {
          res = JSON.stringify(result);
        }
        catch(e) {
          res = result.toString();
        }
        setWasmResult(`${label}: ${res}\nDuration: ${duration.toFixed(2)}ms`);
      } else {
        setWasmResult(`${label} failed: ${error}\nDuration: ${duration.toFixed(2)}ms`);
      }
      setWasmLoading(false);
    };
  }, [computeWorker]);

  // Test IndexedDB storage
  const handleTestStorage = useCallback(async () => {
    const storage = StorageManager.getInstance();

    // Store data
    await storage.set('test-key', { message: 'Hello from IndexedDB!', timestamp: Date.now() });

    // Retrieve data
    const stored = await storage.get('test-key');
    console.log('Stored data:', stored);
    setData(stored);
  }, []);

  // Test SharedArrayBuffer
  const handleTestSharedBuffer = useCallback(() => {
    if (!sabSupport?.available) {
      setSabResult('SharedArrayBuffer not available. Check console for details.');
      return;
    }

    try {
      // Create a shared buffer with 1024 integers
      const { buffer, int32View } = createSharedBuffer(1024 * Int32Array.BYTES_PER_ELEMENT);
      
      // Fill with test data
      for (let i = 0; i < 100; i++) {
        int32View[i] = i;
      }

      // Initialize worker with shared buffer
      sharedBufferWorker.postMessage({ action: 'init', buffer });

      // Process data in worker after initialization
      setTimeout(() => {
        sharedBufferWorker.postMessage({
          action: 'process',
          offset: 0,
          length: 100,
        });

        // Read results after processing
        setTimeout(() => {
          const results = [];
          for (let i = 0; i < 10; i++) {
            results.push(`[${i}]: ${int32View[i]}`);
          }
          setSabResult(`Worker processed data (first 10 values):\n${results.join('\n')}`);
        }, 100);
      }, 100);

    } catch (error) {
      setSabResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [sabSupport, sharedBufferWorker]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>High-Performance Template</h1>
        <p className="subtitle">Vite + React + WebAssembly + Workers</p>
      </header>

      <main className="app-main">
        <section className="feature-section">
          <h2>Web Workers</h2>
          <button onClick={handleFetchData} className="btn">
            Fetch Data (via Worker)
          </button>
          {workerResult && (
            <pre className="result-box">{workerResult}</pre>
          )}
        </section>

        <section className="feature-section">
          <h2>WebAssembly</h2>
          <p>Status: {computeWorker !== null ? '✅ Ready' : '⏳ Loading...'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => handleWasmTest('fibonacci', [30], 'Fibonacci(30)')}
              disabled={wasmLoading}
              className="btn"
              style={{ fontSize: '0.9em', padding: '8px 12px' }}
            >
              Fibonacci
            </button>
            <button
              onClick={() => handleWasmTest('add', [42, 58], 'Add(42, 58)')}
              disabled={wasmLoading}
              className="btn"
              style={{ fontSize: '0.9em', padding: '8px 12px' }}
            >
              Add Numbers
            </button>
            <button
              onClick={() => handleWasmTest('sum_array', [[1, 2, 3, 4, 5, 10, 20, 30]], 'Sum Array')}
              disabled={wasmLoading}
              className="btn"
              style={{ fontSize: '0.9em', padding: '8px 12px' }}
            >
              Sum Array
            </button>
            <button
              onClick={() => handleWasmTest('calculate_primes', [1000], 'Primes up to 1000')}
              disabled={wasmLoading}
              className="btn"
              style={{ fontSize: '0.9em', padding: '8px 12px' }}
            >
              Calculate Primes
            </button>
          </div>
          {wasmResult && (
            <pre className="result-box">{wasmResult}</pre>
          )}
        </section>

        <section className="feature-section">
          <h2>IndexedDB Storage</h2>
          <button onClick={handleTestStorage} className="btn">
            Test Storage
          </button>
          {data && (
            <pre className="result-box">{JSON.stringify(data, null, 2)}</pre>
          )}
        </section>

        <section className="feature-section">
          <h2>SharedArrayBuffer</h2>
          <p>
            Status: {sabSupport?.available ? '✅ Available' : '❌ Not Available'}
            {sabSupport?.error && <span> - {sabSupport.error}</span>}
          </p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Zero-copy data sharing between threads
          </p>
          <button
            onClick={handleTestSharedBuffer}
            disabled={!sabSupport?.available}
            className="btn"
          >
            Test Shared Buffer
          </button>
          {sabResult && (
            <pre className="result-box">{sabResult}</pre>
          )}
        </section>

        <section className="feature-section">
          <h2>Features</h2>
          <ul className="feature-list">
            <li>⚡ Optimized bundle splitting</li>
            <li>👷 Web Workers for background tasks</li>
            <li>🔒 SharedArrayBuffer for zero-copy data transfer</li>
            <li>🦀 WebAssembly for heavy computations</li>
            <li>💾 IndexedDB for local storage</li>
            <li>📦 Service Worker for offline support</li>
            <li>🎨 Modern CSS with layers & @scope</li>
            <li>🚀 Async resource loading</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with performance in mind</p>
      </footer>
    </div>
  );
}

export default App;
