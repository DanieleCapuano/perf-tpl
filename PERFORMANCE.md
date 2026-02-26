# Performance Optimization Guide

This guide covers performance best practices for the template.

## Table of Contents

1. [Frontend Optimizations](#frontend-optimizations)
2. [Backend Optimizations](#backend-optimizations)
3. [WebAssembly Performance](#webassembly-performance)
4. [Worker Performance](#worker-performance)
5. [Network Optimization](#network-optimization)
6. [Rendering Performance](#rendering-performance)
7. [Monitoring & Debugging](#monitoring--debugging)

## Frontend Optimizations

### Code Splitting

Use dynamic imports for route-based code splitting:

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Lazy Loading Images

```typescript
<img 
  src="placeholder.jpg"
  data-src="actual-image.jpg"
  loading="lazy"
  alt="Description"
/>
```

### Memoization

Prevent unnecessary re-renders:

```typescript
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    expensiveOperation(data),
    [data]
  );
  
  const handleClick = useCallback(() => {
    doSomething();
  }, []);
  
  return <div>{processedData}</div>;
});
```

### Virtual Scrolling

For large lists, use virtual scrolling:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
```

## Backend Optimizations

### Caching

Implement Redis or in-memory caching:

```typescript
const cache = new Map();

app.get('/api/data', async (req, res) => {
  const cacheKey = 'data-key';
  
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  
  const data = await fetchData();
  cache.set(cacheKey, data);
  res.json(data);
});
```

### Database Optimization

- Use connection pooling
- Add proper indexes
- Use prepared statements
- Implement query caching
- Consider read replicas

### Response Compression

Already enabled in the template:

```typescript
app.use(compression({
  level: 6,
  threshold: 1024,
}));
```

## WebAssembly Performance

### When to Use WASM

Use WebAssembly for:
- Heavy mathematical computations
- Image/video processing
- Data compression/decompression
- Cryptography
- Game engines
- Scientific computing

### Optimization Tips

1. **Use release builds**:
   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```

2. **Minimize allocations**: Reuse buffers when possible

3. **Use appropriate data types**: Match JavaScript types

4. **Batch operations**: Reduce JS ↔ WASM calls

5. **Profile with DevTools**: Use Performance tab

### Example: Optimized WASM Function

```rust
// Good: Minimal allocations
#[wasm_bindgen]
pub fn process_array(data: &[f64]) -> f64 {
    data.iter().sum()
}

// Bad: Creates new Vec
#[wasm_bindgen]
pub fn process_array_bad(data: &[f64]) -> Vec<f64> {
    data.iter().map(|&x| x * 2.0).collect()
}
```

## Worker Performance

### Best Practices

1. **Minimize message size**: Send only necessary data

2. **Use Transferable objects** for large data:
   ```typescript
   const buffer = new ArrayBuffer(1024);
   worker.postMessage(buffer, [buffer]);
   ```

3. **Batch operations**: Process multiple items per message

4. **Reuse workers**: Don't create new workers repeatedly

5. **Handle errors gracefully**:
   ```typescript
   worker.onerror = (error) => {
     console.error('Worker error:', error);
     // Fallback to main thread
   };
   ```

## Network Optimization

### HTTP/2 & HTTP/3

Configure your server for HTTP/2:
- Multiplexing
- Server push
- Header compression

### Resource Prioritization

In HTML:
```html
<!-- Critical CSS -->
<link rel="preload" href="critical.css" as="style">

<!-- Preconnect to APIs -->
<link rel="preconnect" href="https://api.example.com">

<!-- Prefetch next page -->
<link rel="prefetch" href="/next-page.html">
```

### API Optimization

1. **Use GraphQL** for flexible queries
2. **Implement pagination** for large datasets
3. **Use ETags** for conditional requests
4. **Enable CORS caching**
5. **Batch API requests**

### Service Worker Strategies

```javascript
// Network-first for API
if (url.pathname.startsWith('/api')) {
  return networkFirst(request);
}

// Cache-first for static assets
if (request.destination === 'script') {
  return cacheFirst(request);
}

// Stale-while-revalidate for images
if (request.destination === 'image') {
  return staleWhileRevalidate(request);
}
```

## Rendering Performance

### Avoid Layout Thrashing

Bad:
```typescript
// Causes multiple reflows
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.height = height + 10 + 'px'; // Write
});
```

Good:
```typescript
// Batch reads, then writes
const heights = elements.map(el => el.offsetHeight);
heights.forEach((height, i) => {
  elements[i].style.height = height + 10 + 'px';
});
```

### Use CSS Containment

```css
.independent-component {
  contain: layout style paint;
}

.scrollable-list {
  contain: strict;
  overflow: auto;
}
```

### Optimize Animations

Use CSS transforms and opacity:

```css
/* Good: GPU-accelerated */
.animated {
  transform: translateX(100px);
  opacity: 0.5;
  will-change: transform, opacity;
}

/* Bad: Triggers layout */
.animated-bad {
  left: 100px;
  width: 200px;
}
```

### Debounce/Throttle Events

```typescript
import { debounce, throttle } from 'lodash';

// Debounce: Wait until user stops typing
const handleSearch = debounce((query) => {
  searchAPI(query);
}, 300);

// Throttle: Execute at most once per interval
const handleScroll = throttle(() => {
  checkScrollPosition();
}, 100);
```

## Monitoring & Debugging

### Core Web Vitals

Monitor these metrics:

1. **LCP (Largest Contentful Paint)**: < 2.5s
   - Optimize largest element
   - Remove render-blocking resources
   - Preload critical resources

2. **FID (First Input Delay)**: < 100ms
   - Break up long tasks
   - Use web workers
   - Minimize JavaScript

3. **CLS (Cumulative Layout Shift)**: < 0.1
   - Set image dimensions
   - Reserve space for ads
   - Avoid inserting content above existing

### Performance API

```typescript
// Measure custom timing
performance.mark('fetch-start');
await fetchData();
performance.mark('fetch-end');
performance.measure('fetch-duration', 'fetch-start', 'fetch-end');

// Get measurements
const measures = performance.getEntriesByType('measure');
console.log(measures);
```

### Chrome DevTools

1. **Performance Tab**:
   - Record page load
   - Identify bottlenecks
   - Check frame rate

2. **Coverage Tab**:
   - Find unused CSS/JS
   - Remove dead code

3. **Network Tab**:
   - Check waterfall
   - Identify slow requests
   - Verify compression

4. **Lighthouse**:
   - Run audits
   - Check Core Web Vitals
   - Follow recommendations

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### Bundle Analysis

```bash
# Generate bundle analysis
ANALYZE=true pnpm run build

# Opens stats.html in browser
```

## Performance Checklist

### Initial Load
- [ ] Minimize bundle size (< 200KB initial)
- [ ] Enable code splitting
- [ ] Compress with Gzip/Brotli
- [ ] Use CDN for static assets
- [ ] Optimize images (WebP, responsive)
- [ ] Lazy load below-the-fold content
- [ ] Preload critical resources
- [ ] Remove unused CSS/JS

### Runtime
- [ ] Memoize expensive computations
- [ ] Debounce/throttle events
- [ ] Use virtual scrolling for long lists
- [ ] Implement pagination
- [ ] Avoid layout thrashing
- [ ] Use CSS containment
- [ ] Optimize animations
- [ ] Profile with DevTools

### API/Network
- [ ] Implement caching
- [ ] Use HTTP/2
- [ ] Enable compression
- [ ] Batch requests
- [ ] Use CDN
- [ ] Implement retry logic
- [ ] Set proper cache headers
- [ ] Use ETags

### Database
- [ ] Add indexes
- [ ] Use connection pooling
- [ ] Implement query caching
- [ ] Optimize queries
- [ ] Use read replicas
- [ ] Implement pagination
- [ ] Use prepared statements

### Monitoring
- [ ] Set up performance monitoring
- [ ] Track Core Web Vitals
- [ ] Monitor bundle size
- [ ] Track error rates
- [ ] Set performance budgets
- [ ] Regular Lighthouse audits
- [ ] Monitor API latency

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance Guide](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [React Performance](https://react.dev/learn/render-and-commit)
- [WebAssembly Performance](https://hacks.mozilla.org/2018/10/calls-between-javascript-and-webassembly-are-finally-fast/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
