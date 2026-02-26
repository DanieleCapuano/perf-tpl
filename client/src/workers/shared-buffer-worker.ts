/**
 * Shared Buffer Worker
 * 
 * Demonstrates SharedArrayBuffer usage for efficient data transfer
 * between main thread and worker without copying.
 */

/// <reference lib="webworker" />

interface SharedBufferMessage {
  action: 'init' | 'process' | 'status';
  buffer?: SharedArrayBuffer;
  offset?: number;
  length?: number;
}

let sharedBuffer: SharedArrayBuffer | null = null;
let dataView: Int32Array | null = null;

self.onmessage = (e: MessageEvent<SharedBufferMessage>) => {
  const { action, buffer, offset = 0, length = 0 } = e.data;

  try {
    switch (action) {
      case 'init':
        if (!buffer) {
          throw new Error('Buffer is required for init action');
        }
        
        sharedBuffer = buffer;
        dataView = new Int32Array(sharedBuffer);
        
        self.postMessage({
          action: 'init',
          success: true,
          bufferSize: sharedBuffer.byteLength,
        });
        break;

      case 'process':
        if (!dataView) {
          throw new Error('Buffer not initialized. Call init first.');
        }

        // Example: Process data in the shared buffer
        // Increment all values in the specified range
        const endIndex = offset + length;
        let processed = 0;

        for (let i = offset; i < endIndex && i < dataView.length; i++) {
          // Use Atomics for thread-safe operations
          const oldValue = Atomics.load(dataView, i);
          Atomics.store(dataView, i, oldValue * 2);
          processed++;
        }

        self.postMessage({
          action: 'process',
          success: true,
          processed,
          offset,
        });
        break;

      case 'status':
        self.postMessage({
          action: 'status',
          initialized: sharedBuffer !== null,
          bufferSize: sharedBuffer?.byteLength || 0,
          supportsSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
          supportsAtomics: typeof Atomics !== 'undefined',
        });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    self.postMessage({
      action: e.data.action,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Log worker initialization
console.log('[Shared Buffer Worker] Initialized');
console.log('[Shared Buffer Worker] SharedArrayBuffer support:', typeof SharedArrayBuffer !== 'undefined');
console.log('[Shared Buffer Worker] Atomics support:', typeof Atomics !== 'undefined');
