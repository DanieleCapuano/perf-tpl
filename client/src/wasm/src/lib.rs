use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

/// Initialize panic hook for better error messages
#[wasm_bindgen(start)]
pub fn main() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Log to browser console
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

/// Simple computation example
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// Heavy computation: Calculate Fibonacci number
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a = 0u64;
            let mut b = 1u64;
            for _ in 2..=n {
                let temp = a + b;
                a = b;
                b = temp;
            }
            b
        }
    }
}

/// Process large array: Sum all elements
#[wasm_bindgen]
pub fn sum_array(data: &[f64]) -> f64 {
    data.iter().sum()
}

/// Matrix multiplication (example of heavy computation)
#[wasm_bindgen]
pub fn matrix_multiply(a: Vec<f64>, b: Vec<f64>, n: usize) -> Vec<f64> {
    let mut result = vec![0.0; n * n];
    
    for i in 0..n {
        for j in 0..n {
            let mut sum = 0.0;
            for k in 0..n {
                sum += a[i * n + k] * b[k * n + j];
            }
            result[i * n + j] = sum;
        }
    }
    
    result
}

/// Data structure for complex computations
#[derive(Serialize, Deserialize)]
pub struct ComputeResult {
    pub success: bool,
    pub value: f64,
    pub duration_ms: f64,
}

/// Complex computation with result object
#[wasm_bindgen]
pub fn compute_complex(iterations: u32) -> JsValue {
    let start = js_sys::Date::now();
    
    // Simulate complex computation
    let mut result = 0.0;
    for i in 0..iterations {
        result += (i as f64).sin() * (i as f64).cos();
    }
    
    let duration = js_sys::Date::now() - start;
    
    let compute_result = ComputeResult {
        success: true,
        value: result,
        duration_ms: duration,
    };
    
    serde_wasm_bindgen::to_value(&compute_result).unwrap()
}

/// Image processing: Apply grayscale filter
#[wasm_bindgen]
pub fn grayscale(data: &mut [u8]) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() == 4 {
            let r = chunk[0] as f64;
            let g = chunk[1] as f64;
            let b = chunk[2] as f64;
            
            // Using luminosity method
            let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;
            
            chunk[0] = gray;
            chunk[1] = gray;
            chunk[2] = gray;
        }
    }
}

/// Image processing: Adjust brightness
#[wasm_bindgen]
pub fn adjust_brightness(data: &mut [u8], factor: f64) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() == 4 {
            chunk[0] = ((chunk[0] as f64 * factor).min(255.0)) as u8;
            chunk[1] = ((chunk[1] as f64 * factor).min(255.0)) as u8;
            chunk[2] = ((chunk[2] as f64 * factor).min(255.0)) as u8;
        }
    }
}

/// Sort array using quicksort (fast implementation)
#[wasm_bindgen]
pub fn quicksort(arr: &mut [f64]) {
    if arr.len() <= 1 {
        return;
    }
    quicksort_recursive(arr, 0, arr.len() - 1);
}

fn quicksort_recursive(arr: &mut [f64], low: usize, high: usize) {
    if low < high {
        let pi = partition(arr, low, high);
        if pi > 0 {
            quicksort_recursive(arr, low, pi - 1);
        }
        quicksort_recursive(arr, pi + 1, high);
    }
}

fn partition(arr: &mut [f64], low: usize, high: usize) -> usize {
    let pivot = arr[high];
    let mut i = low;
    
    for j in low..high {
        if arr[j] < pivot {
            arr.swap(i, j);
            i += 1;
        }
    }
    
    arr.swap(i, high);
    i
}

/// Calculate prime numbers up to n (sieve of Eratosthenes)
#[wasm_bindgen]
pub fn calculate_primes(n: u32) -> Vec<u32> {
    if n < 2 {
        return vec![];
    }
    
    let mut is_prime = vec![true; (n + 1) as usize];
    is_prime[0] = false;
    is_prime[1] = false;
    
    for i in 2..=((n as f64).sqrt() as u32) {
        if is_prime[i as usize] {
            let mut j = i * i;
            while j <= n {
                is_prime[j as usize] = false;
                j += i;
            }
        }
    }
    
    is_prime
        .iter()
        .enumerate()
        .filter_map(|(i, &prime)| if prime { Some(i as u32) } else { None })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_fibonacci() {
        assert_eq!(fibonacci(0), 0);
        assert_eq!(fibonacci(1), 1);
        assert_eq!(fibonacci(10), 55);
    }

    #[test]
    fn test_sum_array() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        assert_eq!(sum_array(&data), 15.0);
    }
}
