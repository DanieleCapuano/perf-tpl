# Quick Reference Guide

## � About pnpm

This project uses **pnpm** as the package manager for:
- ⚡ **Fast installations** - Up to 2x faster than npm
- 💾 **Disk space efficiency** - Uses content-addressable storage
- 🔒 **Strict dependencies** - Better dependency management
- 🌲 **Monorepo support** - Built-in workspace support

Install pnpm:
```bash
npm install -g pnpm
# or
corepack enable && corepack prepare pnpm@latest --activate
```

## �🚀 Quick Start

```bash
# Install all dependencies
pnpm run install:all

# Build WebAssembly
pnpm run build:wasm

# Start development
pnpm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- WebSocket: ws://localhost:3000/ws

## 📁 Project Structure

```
perf-tpl/
├── client/                     # Frontend (Vite + React)
│   ├── public/                # Static assets
│   │   ├── wasm/             # Compiled WASM modules
│   │   ├── manifest.json     # PWA manifest
│   │   ├── robots.txt        # SEO robots file
│   │   ├── sitemap.xml       # SEO sitemap
│   │   └── sw.js            # Service Worker
│   ├── scripts/              # Build/utility scripts
│   │   ├── generate-sitemap.js
│   │   └── seo-analyzer.js
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── styles/           # CSS with layers & @scope
│   │   ├── utils/            # Utilities
│   │   │   ├── wasm-loader.ts
│   │   │   ├── storage-manager.ts
│   │   │   ├── meta-tags.ts
│   │   │   └── structured-data.ts
│   │   ├── wasm/             # Rust source
│   │   │   ├── src/lib.rs
│   │   │   └── Cargo.toml
│   │   ├── workers/          # Web Workers
│   │   │   ├── data-worker.ts
│   │   │   └── compute-worker.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html            # Optimized HTML
│   ├── vite.config.ts        # Vite configuration
│   └── package.json
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/           # API routes
│   │   │   ├── api.ts
│   │   │   └── streaming.ts
│   │   ├── websocket/        # WebSocket handlers
│   │   │   └── ws-handler.ts
│   │   ├── config.ts         # Server configuration
│   │   └── server.ts         # Main server file
│   ├── tools/                # Optimization tools
│   │   ├── optimize-images.js
│   │   └── optimize-videos.js
│   └── package.json
│
├── README.md                  # Project overview
├── SETUP.md                   # Setup instructions
├── PERFORMANCE.md             # Performance guide
├── CONTRIBUTING.md            # Contribution guidelines
└── package.json               # Root package.json
```

## 💻 Common Commands

### Development
```bash
pnpm run dev              # Start both client & server
pnpm run dev:client       # Start client only
pnpm run dev:server       # Start server only
```

### Building
```bash
pnpm run build            # Build everything
pnpm run build:client     # Build client only
pnpm run build:server     # Build server only
pnpm run build:wasm       # Build WebAssembly
```

### Code Quality
```bash
pnpm run lint             # Lint all code
pnpm run lint:client      # Lint client
pnpm run lint:server      # Lint server
```

### SEO
```bash
pnpm run seo:analyze      # Run SEO analysis
pnpm run seo:sitemap      # Generate sitemap
```

### Media Optimization
```bash
# Optimize images
node server/tools/optimize-images.js ./input ./output

# Optimize videos
node server/tools/optimize-videos.js input.mp4 output.mp4

# Generate responsive images
node server/tools/optimize-images.js photo.jpg ./out --responsive
```

## 🎯 Key Features

### Frontend
- ⚡ **Vite**: Fast builds and HMR
- ⚛️ **React**: UI framework
- 👷 **Web Workers**: Background processing
- 🦀 **WebAssembly**: High-performance computing
- 📦 **Service Worker**: Offline support
- 🎨 **CSS Layers**: Organized styling
- 🚀 **Optimized Loading**: Async, prefetch, preconnect

### Backend
- 🌐 **Express**: Web framework
- 🗜️ **Gzip**: Compression
- 🔌 **WebSocket**: Real-time communication
- 📡 **Streaming**: Efficient data delivery
- 🖼️ **Sharp**: Image optimization
- 🎬 **FFmpeg**: Video optimization

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `client/vite.config.ts` | Vite build configuration |
| `client/.eslintrc.json` | Frontend linting rules |
| `client/tsconfig.json` | TypeScript configuration |
| `server/src/config.ts` | Server settings |
| `server/.env` | Environment variables |
| `client/public/manifest.json` | PWA configuration |

## 📚 API Endpoints

### REST API
```
GET  /health              - Health check
GET  /api/data           - Sample data
POST /api/data           - Create data
GET  /api/large-dataset  - Large dataset (for testing)
GET  /api/compute        - CPU-intensive task
```

### Streaming
```
GET /stream/video/:filename  - Stream video with range support
GET /stream/data            - Stream large JSON data
GET /stream/events          - Server-Sent Events
GET /stream/download/:file  - Download with progress
```

### WebSocket
```
ws://localhost:3000/ws

Messages:
  { type: 'ping' }           - Ping server
  { type: 'echo', data: {} } - Echo data back
  { type: 'broadcast' }      - Broadcast to all clients
  { type: 'subscribe' }      - Subscribe to channel
```

## 🔍 SEO Checklist

- [x] Title & meta tags
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Robots.txt
- [x] Sitemap.xml
- [x] Manifest.json
- [x] Structured data ready
- [x] SEO analyzer script
- [x] Performance optimizations

## 🎨 CSS Architecture

Using CSS Layers (in order):
1. **reset** - Base resets
2. **theme** - Variables and tokens
3. **layout** - Layout components
4. **components** - UI components (with @scope)
5. **utilities** - Utility classes
6. **overrides** - Specific overrides

## 🌊 Web Workers

### Data Worker
```typescript
import DataWorker from '@workers/data-worker?worker';

const worker = new DataWorker();
worker.postMessage({
  action: 'fetch',
  url: '/api/data'
});
```

### Compute Worker
```typescript
import ComputeWorker from '@workers/compute-worker?worker';

const worker = new ComputeWorker();
worker.postMessage({
  action: 'calculate',
  data: [1, 2, 3, 4, 5]
});
```

## 🦀 WebAssembly

### Loading WASM
```typescript
import { loadWasmModule, wasmFibonacci } from '@utils/wasm-loader';

await loadWasmModule();
const result = await wasmFibonacci(40);
```

### Building WASM
```bash
cd client/src/wasm
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/*.wasm \
  --out-dir ../../public/wasm --target web
```

## 💾 Storage

### IndexedDB/LocalStorage
```typescript
import { StorageManager } from '@utils/storage-manager';

const storage = StorageManager.getInstance();

// Set data
await storage.set('key', { data: 'value' });

// Get data
const data = await storage.get('key');

// Delete data
await storage.delete('key');

// Check usage
const usage = await storage.getUsage();
```

## 🔌 WebSocket (Client)

```typescript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'ping' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Message:', data);
};
```

## 📊 Performance Monitoring

### Web Vitals
```typescript
// Already implemented in index.html
// Check console for:
// - LCP (Largest Contentful Paint)
// - FID (First Input Delay)
// - CLS (Cumulative Layout Shift)
```

### Lighthouse
```bash
cd client
pnpm run seo:analyze
```

## 🐛 Debugging Tips

### WASM not loading?
```bash
pnpm run build:wasm
ls client/public/wasm/  # Check files exist
```

### Service Worker issues?
1. Open DevTools
2. Application → Service Workers
3. Unregister
4. Hard refresh (Ctrl+Shift+R)

### CORS errors?
Update `server/src/config.ts`:
```typescript
cors: {
  origin: 'http://localhost:5173'
}
```

### Port in use?
Change in `server/.env`:
```env
PORT=3001
```

## 🔗 Useful Links

- [Full Setup Guide](SETUP.md)
- [Performance Guide](PERFORMANCE.md)
- [Contributing](CONTRIBUTING.md)
- [pnpm Migration Guide](PNPM_MIGRATION.md)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [WASM Docs](https://webassembly.org/)

## 📈 Performance Targets

| Metric | Target | How to Check |
|--------|--------|--------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Bundle Size | < 200KB | Build output |
| API Response | < 200ms | Network tab |
| SEO Score | > 90 | Lighthouse |

## 🎯 Next Steps

1. ✅ Complete setup (see [SETUP.md](SETUP.md))
2. 🎨 Customize styles in `client/src/styles/`
3. ⚛️ Build components in `client/src/components/`
4. 🦀 Add WASM functions in `client/src/wasm/src/lib.rs`
5. 🔌 Extend API in `server/src/routes/`
6. 📊 Monitor performance with Lighthouse
7. 🚀 Deploy to production!

---

**Need help?** Check the documentation or open an issue!
