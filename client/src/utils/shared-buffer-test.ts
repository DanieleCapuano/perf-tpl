/**
 * SharedArrayBuffer Test Utility
 * 
 * Tests if SharedArrayBuffer is available in the current context.
 * Requires these HTTP headers:
 * - Cross-Origin-Opener-Policy: same-origin
 * - Cross-Origin-Embedder-Policy: require-corp
 */

export interface SharedBufferCapabilities {
  available: boolean;
  atomicsAvailable: boolean;
  error?: string;
}

/**
 * Check if SharedArrayBuffer is available
 */
export function checkSharedArrayBufferSupport(): SharedBufferCapabilities {
  try {
    // Check if SharedArrayBuffer is defined
    if (typeof SharedArrayBuffer === 'undefined') {
      return {
        available: false,
        atomicsAvailable: false,
        error: 'SharedArrayBuffer is not defined. Check COOP/COEP headers.',
      };
    }

    // Try to create a small SharedArrayBuffer
    const sab = new SharedArrayBuffer(16);
    
    // Check if Atomics is available (required for SAB operations)
    if (typeof Atomics === 'undefined') {
      return {
        available: true,
        atomicsAvailable: false,
        error: 'Atomics is not available',
      };
    }

    // Test basic Atomics operations
    const view = new Int32Array(sab);
    Atomics.store(view, 0, 42);
    const value = Atomics.load(view, 0);

    if (value !== 42) {
      return {
        available: true,
        atomicsAvailable: true,
        error: 'Atomics operations failed verification',
      };
    }

    return {
      available: true,
      atomicsAvailable: true,
    };
  } catch (error) {
    return {
      available: false,
      atomicsAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a SharedArrayBuffer with typed array view
 */
export function createSharedBuffer(byteLength: number): {
  buffer: SharedArrayBuffer;
  int32View: Int32Array;
  uint8View: Uint8Array;
  float64View: Float64Array;
} {
  if (typeof SharedArrayBuffer === 'undefined') {
    throw new Error('SharedArrayBuffer is not available');
  }

  const buffer = new SharedArrayBuffer(byteLength);

  return {
    buffer,
    int32View: new Int32Array(buffer),
    uint8View: new Uint8Array(buffer),
    float64View: new Float64Array(buffer),
  };
}

/**
 * Log SharedArrayBuffer capabilities to console
 */
export function logSharedBufferCapabilities(): void {
  const caps = checkSharedArrayBufferSupport();
  
  console.group('🔒 SharedArrayBuffer Support');
  console.log('Available:', caps.available ? '✅' : '❌');
  console.log('Atomics Available:', caps.atomicsAvailable ? '✅' : '❌');
  
  if (caps.error) {
    console.error('Error:', caps.error);
    console.log('\n📋 Required HTTP Headers:');
    console.log('  Cross-Origin-Opener-Policy: same-origin');
    console.log('  Cross-Origin-Embedder-Policy: require-corp');
  } else {
    console.log('✅ All checks passed! SharedArrayBuffer is ready to use.');
  }
  
  console.groupEnd();
}

/**
 * Example: Simple counter using SharedArrayBuffer
 */
export class SharedCounter {
  private buffer: SharedArrayBuffer;
  private view: Int32Array;
  private index: number;

  constructor(sharedBuffer?: SharedArrayBuffer, index = 0) {
    if (sharedBuffer) {
      this.buffer = sharedBuffer;
      this.view = new Int32Array(this.buffer);
      this.index = index;
    } else {
      this.buffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
      this.view = new Int32Array(this.buffer);
      this.index = 0;
      Atomics.store(this.view, 0, 0);
    }
  }

  getBuffer(): SharedArrayBuffer {
    return this.buffer;
  }

  getValue(): number {
    return Atomics.load(this.view, this.index);
  }

  increment(): number {
    return Atomics.add(this.view, this.index, 1);
  }

  decrement(): number {
    return Atomics.sub(this.view, this.index, 1);
  }

  compareAndSwap(expected: number, replacement: number): number {
    return Atomics.compareExchange(this.view, this.index, expected, replacement);
  }
}
