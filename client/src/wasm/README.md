# WebAssembly Module

This directory contains Rust code that compiles to WebAssembly for high-performance computations.

**⚠️ Note:** WASM is **optional**. The app runs without it - WASM features are gracefully disabled if not built.

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Install wasm-bindgen-cli
cargo install wasm-bindgen-cli
```

## Building

From the **client** directory:

```bash
pnpm run build:wasm
```

Or manually from this wasm directory:

```bash
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_compute.wasm \
  --out-dir ../../public/wasm \
  --target web
```

## Available Functions

- `add(a, b)` - Simple addition
- `fibonacci(n)` - Calculate Fibonacci number
- `sum_array(data)` - Sum all elements in an array
- `matrix_multiply(a, b, n)` - Matrix multiplication
- `compute_complex(iterations)` - Complex computation benchmark
- `grayscale(data)` - Apply grayscale filter to image data
- `adjust_brightness(data, factor)` - Adjust image brightness
- `quicksort(arr)` - Fast quicksort implementation
- `calculate_primes(n)` - Calculate prime numbers using Sieve of Eratosthenes

## Usage in TypeScript

```typescript
import { loadWasmModule, wasmFibonacci } from '@utils/wasm-loader';

// Initialize
await loadWasmModule();

// Use
const result = await wasmFibonacci(40);
console.log('Fibonacci(40):', result);
```

## Optimization

The release build is optimized for size and speed:
- `opt-level = "z"` - Optimize for size
- `lto = true` - Link Time Optimization
- `codegen-units = 1` - Better optimization
- `strip = true` - Remove debug symbols
