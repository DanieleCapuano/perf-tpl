/* tslint:disable */
/* eslint-disable */

/**
 * Simple computation example
 */
export function add(a: number, b: number): number;

/**
 * Image processing: Adjust brightness
 */
export function adjust_brightness(data: Uint8Array, factor: number): void;

/**
 * Calculate prime numbers up to n (sieve of Eratosthenes)
 */
export function calculate_primes(n: number): Uint32Array;

/**
 * Complex computation with result object
 */
export function compute_complex(iterations: number): any;

/**
 * Heavy computation: Calculate Fibonacci number
 */
export function fibonacci(n: number): bigint;

/**
 * Image processing: Apply grayscale filter
 */
export function grayscale(data: Uint8Array): void;

/**
 * Initialize panic hook for better error messages
 */
export function main(): void;

/**
 * Matrix multiplication (example of heavy computation)
 */
export function matrix_multiply(a: Float64Array, b: Float64Array, n: number): Float64Array;

/**
 * Sort array using quicksort (fast implementation)
 */
export function quicksort(arr: Float64Array): void;

/**
 * Process large array: Sum all elements
 */
export function sum_array(data: Float64Array): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly add: (a: number, b: number) => number;
    readonly adjust_brightness: (a: number, b: number, c: number, d: number) => void;
    readonly calculate_primes: (a: number, b: number) => void;
    readonly compute_complex: (a: number) => number;
    readonly fibonacci: (a: number) => bigint;
    readonly grayscale: (a: number, b: number, c: number) => void;
    readonly main: () => void;
    readonly matrix_multiply: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly quicksort: (a: number, b: number, c: number) => void;
    readonly sum_array: (a: number, b: number) => number;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
