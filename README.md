# High-Performance Web Application Template

A production-ready template featuring **Vite + React + WebAssembly (Rust) + Web Workers + Service Workers + Node.js backend**, optimized for performance, SEO, and developer experience. ⚡

**Built to get 100% score on lighthouse**
![100-100-lighthouse-score](/client/public/img/lighthouse-report.png)


----

> 🔥 **Powered by pnpm** - Up to 2x faster installations and significantly reduced disk space usage!

## ⚡ Why pnpm?

This template uses **pnpm** as the package manager because:

- **Fast** - Up to 2x faster installations than npm
- **Efficient** - Saves gigabytes of disk space using content-addressable storage  
- **Strict** - Creates non-flat node_modules by default, preventing dependency hell
- **Monorepo-ready** - Built-in workspace support for managing multiple packages
- **Compatible** - Drop-in replacement for npm with similar commands

[Learn more about pnpm](https://pnpm.io/)

## Features

### Frontend
- ⚡ **Vite + React** - Lightning-fast HMR and optimized production builds
- � **pnpm** - Fast, disk space efficient package manager
- �👷 **Web Workers** - Offload data fetching and parsing to background threads
- 🦀 **WebAssembly (Rust)** - High-performance computations
- 📦 **Service Worker** - Smart caching with IndexedDB/LocalStorage support
- 🎨 **Modern CSS** - CSS Layers and @scope for maintainable styles
- 🚀 **Optimized Loading** - Async resources, DNS prefetch, preconnect
- 🔍 **SEO Ready** - Sitemap generation and SEO analysis tools

### Backend
- 🌐 **Node.js + Express** - High-performance server
- 🗜️ **Gzip Compression** - Reduced bandwidth usage
- 🔌 **WebSocket Support** - Real-time bidirectional communication
- 📡 **Streaming** - Efficient delivery of large resources
- 🖼️ **Media Optimization** - Image and video processing tools

### Code Quality
- ✅ **ESLint Configuration** - Prevent React re-render issues
- 🎯 **Performance Linting** - Catch layout thrashing and reflow issues
- 📊 **Bundle Analysis** - Optimize chunk sizes

## Project Structure

```
perf-tpl/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   │   ├── wasm/         # Compiled WebAssembly modules
│   │   └── robots.txt    # SEO robots file
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── workers/      # Web Workers
│   │   ├── wasm/         # Rust source code
│   │   ├── styles/       # CSS with layers & @scope
│   │   ├── utils/        # Utility functions
│   │   └── App.tsx       # Main React component
│   ├── sw.js            # Service Worker
│   └── vite.config.ts   # Vite configuration
├── server/               # Backend application
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── websocket/   # WebSocket handlers
│   │   ├── streaming/   # Streaming utilities
│   │   └── server.ts    # Main server file
│   └── tools/           # Media optimization tools
└── package.json         # Root package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Rust and wasm-pack (for WebAssembly features)

```bash
# Install pnpm globally
npm install -g pnpm

# Or using other methods:
# Via Homebrew (macOS)
brew install pnpm

# Via PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Via Corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Install wasm-bindgen-cli
cargo install wasm-bindgen-cli
```

### Installation

```bash
# Install all dependencies (root, client, and server)
pnpm run install:all

# Or manually
pnpm install
cd client && pnpm install
cd ../server && pnpm install
```

### Development

```bash
# Run both client and server in development mode
pnpm run dev

# Or run separately
pnpm run dev:client  # Frontend on http://localhost:5173
pnpm run dev:server  # Backend on http://localhost:3000
```

### Building

```bash
# Build WebAssembly modules
pnpm run build:wasm

# Build entire project
pnpm run build

# Preview production build
pnpm run preview
```

### Linting

```bash
# Lint all code
pnpm run lint

# Lint client only
pnpm run lint:client

# Lint server only
pnpm run lint:server
```

### SEO Analysis

```bash
# Run SEO analysis
pnpm run seo:analyze
```

## Configuration

### Vite Configuration
The Vite config (`client/vite.config.ts`) includes:
- Web Worker bundling with module support
- Code splitting optimization
- Compression plugins
- Performance budgets
- Bundle analysis

### ESLint Configuration
Custom rules to prevent:
- Excessive React re-renders
- Layout thrashing
- Unnecessary reflows/repaints
- Common performance anti-patterns

### Service Worker
Configurable caching strategies in `client/sw.js`:
- Cache-first for static assets
- Network-first for API calls
- Stale-while-revalidate for images
- IndexedDB for large data sets

## Usage Examples

### Using Web Workers

```typescript
import DataWorker from './workers/data-worker?worker';

const worker = new DataWorker();
worker.postMessage({ action: 'fetch', url: '/api/data' });
worker.onmessage = (e) => {
  console.log('Worker result:', e.data);
};
```

### Using WebAssembly

```typescript
import init, { compute_heavy_task } from './wasm/wasm_module';

await init();
const result = compute_heavy_task(data);
```

### WebSocket Communication

```typescript
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  console.log('Received:', event.data);
};
ws.send(JSON.stringify({ type: 'message', data: 'Hello' }));
```

## Performance Optimizations

### Frontend
- Async script loading
- DNS prefetch for external resources
- Resource preconnect
- CSS containment and layers
- Code splitting by route
- Tree shaking
- Minification

### Backend
- Gzip compression
- HTTP/2 support
- Efficient streaming
- Connection pooling
- Caching headers

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

## Documentation

- 📖 [Setup Guide](SETUP.md) - Detailed installation and configuration
- ⚡ [Quick Start](QUICKSTART.md) - Quick reference for common tasks
- 🚀 [Performance Guide](PERFORMANCE.md) - Optimization tips and best practices
- 🤝 [Contributing](CONTRIBUTING.md) - How to contribute to the project
- 📦 [pnpm Migration](PNPM_MIGRATION.md) - Why we use pnpm and how to migrate

## License

MIT
