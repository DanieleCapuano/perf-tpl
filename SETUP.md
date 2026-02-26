# Setup Guide

This guide will help you get the performance template up and running.

## Why pnpm?

This project uses **pnpm** instead of npm because:

- **Speed** - Installations are 2x faster on average
- **Disk efficiency** - Saves GBs by using hard links and content-addressable storage
- **Monorepo support** - Excellent workspace management out of the box
- **Deterministic** - `pnpm-lock.yaml` ensures reproducible installs
- **Strict** - Better at catching dependency issues early

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   pnpm --version
   ```

2. **pnpm** (Package manager)
   ```bash
   # Install pnpm globally via npm
   npm install -g pnpm
   
   # Or via PowerShell (Windows)
   iwr https://get.pnpm.io/install.ps1 -useb | iex
   
   # Or via curl (Linux/macOS)
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   
   # Or via Homebrew (macOS)
   brew install pnpm
   
   # Or via Corepack (Node.js 16.13+)
   corepack enable
   corepack prepare pnpm@latest --activate
   
   # Verify installation
   pnpm --version
   ```

3. **Rust** (for WebAssembly features)
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Verify installation
   rustc --version
   cargo --version
   ```

3. **wasm-pack** or **wasm-bindgen-cli**
   ```bash
   # Add wasm32 target
   rustup target add wasm32-unknown-unknown
   
   # Install wasm-bindgen-cli
   cargo install wasm-bindgen-cli
   ```

4. **(Optional) FFmpeg** for video optimization
   - Windows: Download from https://ffmpeg.org/download.html
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

## Installation

### 1. Install Dependencies

From the project root:

```bash
# Install all dependencies (root, client, and server)
pnpm run install:all
```

Or manually:

```bash
# Root dependencies
pnpm install

# Client dependencies
cd client
pnpm install

# Server dependencies
cd ../server
pnpm install
cd ..
```

### 2. Build WebAssembly Module

```bash
pnpm run build:wasm
```

This will:
- Compile Rust code to WebAssembly
- Generate JavaScript bindings
- Output files to `client/public/wasm/`

If you encounter errors, ensure:
- Rust toolchain is installed
- wasm32-unknown-unknown target is added
- wasm-bindgen-cli is installed

### 3. Configure Environment

Create environment files:

```bash
# Server environment
cp server/.env.example server/.env
```

Edit `server/.env` as needed:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Update SEO Configuration

Update the following files with your site's information:

- `client/public/robots.txt` - Update sitemap URL
- `client/public/sitemap.xml` - Add your URLs
- `client/public/manifest.json` - Update app name and icons
- `client/scripts/generate-sitemap.js` - Add your routes
- `client/src/utils/structured-data.ts` - Update organization info
- `client/index.html` - Update meta tags

## Development

### Start Development Servers

Run both client and server in development mode:

```bash
pnpm run dev
```

This will start:
- Frontend dev server: http://localhost:5173
- Backend server: http://localhost:3000

Or run separately:

```bash
# Terminal 1 - Client
pnpm run dev:client

# Terminal 2 - Server
pnpm run dev:server
```

### Development Features

- ⚡ Hot Module Replacement (HMR)
- 🔄 Auto-restart on server changes
- 🎨 CSS hot reload
- 📦 Fast WASM reloading

## Building for Production

### 1. Build WebAssembly

```bash
pnpm run build:wasm
```

### 2. Build Client

```bash
pnpm run build:client
```

Output will be in `client/dist/`

### 3. Build Server

```bash
pnpm run build:server
```

Output will be in `server/dist/`

### 4. Build Everything

```bash
pnpm run build
```

## Production Deployment

### Option 1: Node.js Server

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   cd server
   pnpm start
   ```

The server will:
- Serve the built client from `client/dist/`
- Handle API requests on `/api`
- Provide WebSocket on `/ws`
- Apply gzip compression
- Set appropriate cache headers

### Option 2: Static Hosting + Separate API

1. Deploy client to static hosting (Netlify, Vercel, etc.):
   - Upload `client/dist/` contents
   - Configure redirects for SPA routing

2. Deploy server separately:
   - Use services like Heroku, Railway, or DigitalOcean
   - Update CORS settings in server configuration
   - Update API URLs in client code

### Production Checklist

- [ ] Update `SITE_URL` in sitemap generator
- [ ] Generate sitemap: `pnpm run seo:sitemap`
  - [ ] Optimize images in `public/` folder
  - [ ] Update manifest.json with production icons
  - [ ] Configure CDN for static assets
  - [ ] Set up HTTPS
  - [ ] Configure monitoring and analytics
  - [ ] Test Core Web Vitals
  - [ ] Run SEO analysis: `pnpm run seo:analyze`
- [ ] Test Service Worker caching
- [ ] Verify WebAssembly loading
- [ ] Test WebSocket connections
- [ ] Configure rate limiting
- [ ] Set up error tracking (Sentry, etc.)

## Testing

### Lint Code

```bash
# Lint all
pnpm run lint

# Lint client only
pnpm run lint:client

# Lint server only
pnpm run lint:server
```

### Run SEO Analysis

```bash
# Make sure dev server is running
pnpm run dev:client

# In another terminal
cd client
pnpm run seo:analyze
```

This will:
- Run Lighthouse tests
- Generate performance report
- Show Core Web Vitals
- List SEO issues

### Test WebAssembly

1. Ensure WASM is built: `pnpm run build:wasm`
2. Start dev server: `pnpm run dev:client`
3. Open browser console
4. Check for WASM loading messages

### Test WebWorkers

Workers are automatically bundled by Vite. To test:

1. Open the app in browser
2. Click "Fetch Data (via Worker)"
3. Check browser console for worker messages

## Common Issues

### WebAssembly Not Loading

**Problem**: "WASM module not found" error

**Solution**:
```bash
# Rebuild WASM module
pnpm run build:wasm

# Verify files exist
ls client/public/wasm/
```

### Port Already in Use

**Problem**: "Port 3000 already in use"

**Solution**:
```bash
# Change port in server/.env
PORT=3001
```

### CORS Errors

**Problem**: Cross-origin request blocked

**Solution**: Update `server/src/config.ts`:
```typescript
cors: {
  origin: 'http://localhost:5173', // Your frontend URL
}
```

### Service Worker Not Updating

**Problem**: Old service worker still active

**Solution**:
1. Open DevTools
2. Go to Application → Service Workers
3. Click "Unregister"
4. Hard refresh (Ctrl+Shift+R)

### Build Errors

**Problem**: TypeScript errors during build

**Solution**:
```bash
# Clean node_modules
rm -rf node_modules
rm -rf client/node_modules
rm -rf server/node_modules

# Reinstall
pnpm run install:all
```

### pnpm Store Corruption

**Problem**: "Unexpected end of JSON input" or store errors

**Solution**:
```bash
# Clear pnpm store
pnpm store prune

# Or completely reset
rm -rf ~/.pnpm-store  # Linux/macOS
# or
rmdir /s %LOCALAPPDATA%\pnpm\store  # Windows

# Reinstall
pnpm run install:all
```

### Peer Dependency Warnings

**Problem**: pnpm warns about peer dependencies

**Solution**: These are usually safe to ignore, but if needed:
```bash
# Auto-install peer dependencies (already configured in .npmrc)
# Or manually install the suggested peer dependency
pnpm add <package>@<version>
```

### Module Resolution Issues

**Problem**: "Cannot find module" despite installation

**Solution**:
```bash
# pnpm creates strict node_modules, try shamefully-hoisting
# Edit .npmrc and set:
# shamefully-hoist=true

# Then reinstall
pnpm install
```

## Advanced Configuration

### Custom Vite Plugins

Edit `client/vite.config.ts` to add plugins:

```typescript
import myPlugin from 'vite-plugin-something';

export default defineConfig({
  plugins: [
    react(),
    myPlugin(),
    // ... other plugins
  ],
});
```

### Custom Express Middleware

Edit `server/src/server.ts`:

```typescript
// Add custom middleware
app.use((req, res, next) => {
  // Your middleware logic
  next();
});
```

### WebSocket Custom Handlers

Edit `server/src/websocket/ws-handler.ts`:

```typescript
case 'custom-action':
  handleCustomAction(ws, message.data);
  break;
```

## Performance Tips

1. **Lazy Load Routes**: Use React.lazy() for code splitting
2. **Optimize Images**: Use WebP format and responsive images
3. **Cache API Responses**: Implement caching in service worker
4. **Minimize Dependencies**: Keep bundle size small
5. **Use Web Workers**: Offload heavy computations
6. **Leverage WebAssembly**: Use for CPU-intensive tasks
7. **Enable Compression**: Gzip/Brotli in production
8. **Use CDN**: Serve static assets from CDN
9. **Monitor Performance**: Use Lighthouse regularly
10. **Optimize CSS**: Remove unused styles

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [WebAssembly Guide](https://webassembly.org/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Web Vitals](https://web.dev/vitals/)

## Support

For issues and questions:
1. Check this setup guide
2. Review the code comments
3. Check browser console for errors
4. Review Lighthouse report for insights

Happy coding! 🚀
