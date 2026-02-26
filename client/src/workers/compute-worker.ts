/**
 * Compute Worker - Handles CPU-intensive computations
 * 
 * This worker can:
 * - Perform complex calculations
 * - Process large arrays
 * - Run algorithms without blocking UI
 * - Use WebAssembly for performance-critical operations
 */

import { loadWasmModule } from '@/utils/wasm-loader';

interface ComputeMessage {
  action: 'calculate' | 'sort' | 'search' | 'transform';
  data: any;
  params?: any;
}

interface ComputeResponse {
  success: boolean;
  result?: any;
  duration?: number;
  error?: string;
}

// WASM PRELOAD
let wasmModule: { [k: string]: any } = {};
const wasmPromise = new Promise(res => {
  loadWasmModule().then(mod => {
    wasmModule = mod;
    res(mod);
  });
});

self.onmessage = async (e: MessageEvent<ComputeMessage>) => {
  const startTime = performance.now();
  const { action, data, params } = e.data;

  try {
    let result: any;

    switch (action) {
      case 'calculate':
        result = await performCalculation(data, params);
        break;

      case 'sort':
        result = performSort(data, params);
        break;

      case 'search':
        result = performSearch(data, params);
        break;

      case 'transform':
        result = performTransform(data, params);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const duration = performance.now() - startTime;

    const response: ComputeResponse = {
      success: true,
      result,
      duration
    };

    self.postMessage(response);

  } catch (error) {
    const response: ComputeResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: performance.now() - startTime
    };

    self.postMessage(response);
  }
};

async function wasmCalculation(fn: string, opts: any) {
  return wasmPromise.then(() => {
    if (!wasmModule) {
      console.warn('WASM not available, using JavaScript fallback');
      return null;
    }

    try {
      // Check if the requested function exists in WASM module
      if (typeof wasmModule[fn] !== 'function') {
        console.warn(`WASM function '${fn}' not found`);
        return null;
      }

      // Call the WASM function with provided arguments
      const result = wasmModule[fn](...(Array.isArray(opts) ? opts : [opts]));
      return result;
    } catch (error) {
      console.error('WASM computation failed:', error);
      return null;
    }
  });
}

/**
 * Perform mathematical calculations
 * Uses WASM when available, falls back to JavaScript
 */
async function performCalculation(fn: string, opts: any): Promise<any> {
  // Try WASM first
  const wasmResult = await wasmCalculation(fn, opts);

  if (wasmResult !== null) {
    return wasmResult;
  }

  // Fallback to JavaScript implementations
  switch (fn) {
    case 'fibonacci':
      return jsFibonacci(opts[0] || 10);

    case 'sum_array':
      return jsSumArray(opts[0] || []);

    case 'add':
      return (opts[0] || 0) + (opts[1] || 0);

    case 'calculate_primes':
      return jsCalculatePrimes(opts[0] || 10);

    default:
      throw new Error(`Unknown calculation function: ${fn}`);
  }
}

// JavaScript fallback implementations
function jsFibonacci(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

function jsSumArray(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0);
}

function jsCalculatePrimes(max: number): number[] {
  const primes: number[] = [];
  for (let n = 2; n <= max; n++) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(n);
  }
  return primes;
}

/**
 * Sort large datasets
 */
function performSort(data: any[], params?: any): any[] {
  const { key, order = 'asc' } = params || {};

  const sorted = [...data].sort((a, b) => {
    const valA = key ? a[key] : a;
    const valB = key ? b[key] : b;

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Search in large datasets
 */
function performSearch(data: any[], params?: any): any[] {
  const { query, fields } = params || {};

  if (!query) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter(item => {
    if (fields && Array.isArray(fields)) {
      return fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(lowerQuery);
      });
    }

    return String(item).toLowerCase().includes(lowerQuery);
  });
}

/**
 * Transform data structures
 */
function performTransform(data: any[], params?: any): any {
  const { operation } = params || {};

  switch (operation) {
    case 'group':
      return groupBy(data, params.key);

    case 'pivot':
      return pivot(data, params);

    case 'aggregate':
      return aggregate(data, params);

    default:
      return data;
  }
}

function groupBy(data: any[], key: string): Record<string, any[]> {
  return data.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

function pivot(data: any[], _params: any): any {
  // Simple pivot implementation
  return data;
}

function aggregate(data: any[], params: any): any {
  const { groupBy: groupKey, aggregations } = params;

  const grouped = groupBy(data, groupKey);

  return Object.entries(grouped).map(([key, items]) => {
    const result: any = { [groupKey]: key };

    aggregations?.forEach((agg: any) => {
      const values = items.map(item => item[agg.field]);

      switch (agg.operation) {
        case 'sum':
          result[agg.name || `${agg.field}_sum`] = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          result[agg.name || `${agg.field}_avg`] = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'count':
          result[agg.name || `${agg.field}_count`] = values.length;
          break;
      }
    });

    return result;
  });
}

export { };
