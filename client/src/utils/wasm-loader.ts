/**
 * WebAssembly Module Loader
 * 
 * Handles loading and initializing WASM modules
 * Uses runtime path construction to avoid Vite build-time analysis
 */

let wasmModule: any = null;
let wasmLoadPromise: Promise<any> | null = null;

/**
 * Load and initialize the WASM module
 * Uses Function constructor to prevent Vite from analyzing imports at build time
 */
export async function loadWasmModule(): Promise<any> {
  if (wasmLoadPromise) {
    return wasmLoadPromise;
  }

  wasmLoadPromise = (async () => {
    try {
      // Construct import path at runtime to avoid static analysis
      // Using public directory (/wasm/) because --target web expects to fetch .wasm file
      const basePath = '/wasm/';
      const moduleName = 'wasm_compute';
      const fullPath = basePath + moduleName + '.js';
      
      // Use Function constructor to create dynamic import
      // This prevents Vite from analyzing the import at build time
      const dynamicImport = new Function('path', 'return import(path)');
      const module = await dynamicImport(fullPath);
      
      // For --target web, we need to call the default init function
      // which fetches and instantiates the .wasm file
      if (typeof module.default === 'function') {
        await module.default();
      }
      
      wasmModule = module;
      console.log('✓ WASM module loaded successfully');
      return module;
    } catch (error) {
      console.warn('⚠ Failed to load WASM module:', error);
      console.warn('  WASM features will use JavaScript fallbacks');
      console.warn('  To enable WASM, run: pnpm run build:wasm');
      return null;
    }
  })();

  return wasmLoadPromise;
}

/**
 * Get the loaded WASM module (if already loaded)
 * Returns null if not yet loaded
 */
export function getWasmModule(): any {
  return wasmModule;
}

/**
 * Check if WASM is supported in the browser
 */
export function isWasmSupported(): boolean {
  try {
    if (typeof WebAssembly === 'object' &&
        typeof WebAssembly.instantiate === 'function' &&
        typeof WebAssembly.Module === 'function') {
      
      // Test with a simple module
      const module = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      );
      
      if (module instanceof WebAssembly.Module) {
        return true;
      }
    }
  } catch (_e) {
    return false;
  }
  
  return false;
}

/**
 * Example WASM function wrappers
 * These should match the functions exported from your Rust code
 */

export async function wasmAdd(a: number, b: number): Promise<number> {
  const module = await loadWasmModule();
  if (!module || !module.add) {
    throw new Error('WASM add function not available');
  }
  return module.add(a, b);
}

export async function wasmFibonacci(n: number): Promise<number> {
  const module = await loadWasmModule();
  if (!module || !module.fibonacci) {
    throw new Error('WASM fibonacci function not available');
  }
  return module.fibonacci(n);
}

export async function wasmSumArray(data: Float64Array): Promise<number> {
  const module = await loadWasmModule();
  if (!module || !module.sum_array) {
    throw new Error('WASM sum_array function not available');
  }
  return module.sum_array(data);
}

export async function wasmMatrixMultiply(
  a: Float64Array,
  b: Float64Array,
  n: number
): Promise<Float64Array> {
  const module = await loadWasmModule();
  if (!module || !module.matrix_multiply) {
    throw new Error('WASM matrix_multiply function not available');
  }
  return module.matrix_multiply(a, b, n);
}
