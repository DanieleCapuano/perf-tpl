/**
 * High-Performance Express Server
 * 
 * Features:
 * - Gzip compression
 * - WebSocket support
 * - Streaming for large files
 * - Security headers
 * - CORS support
 * - Request logging
 */

import express, { Request, Response, NextFunction, type Express } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config.js';
import apiRoutes from './routes/api.js';
import streamingRoutes from './routes/streaming.js';
import { setupWebSocket } from './websocket/ws-handler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app: Express = express();
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Customize as needed
  crossOriginEmbedderPolicy: false,
}));

// SharedArrayBuffer support headers (required for SAB in browsers)
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Gzip compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses larger than 1KB
}));

// Request logging
app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for production)
if (!config.isDevelopment) {
  const clientPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Set cache headers based on file type
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (path.match(/\.(js|css|woff2?)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
      }
    },
  }));
}

// ============================================
// Routes
// ============================================

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API routes
app.use('/api', apiRoutes);

// Streaming routes
app.use('/stream', streamingRoutes);

// Catch 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: config.isDevelopment ? err.message : 'Internal server error',
    ...(config.isDevelopment && { stack: err.stack }),
  });
});

// ============================================
// WebSocket Setup
// ============================================

setupWebSocket(wss);

// ============================================
// Start Server
// ============================================

server.listen(config.port, () => {
  console.log(`
🚀 Server running on http://localhost:${config.port}
📡 WebSocket available at ws://localhost:${config.port}/ws
🌍 Environment: ${config.isDevelopment ? 'development' : 'production'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
