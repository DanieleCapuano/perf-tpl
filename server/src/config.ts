/**
 * Server configuration
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  streaming: {
    chunkSize: 64 * 1024, // 64KB chunks
  },
  
  websocket: {
    heartbeatInterval: 30000, // 30 seconds
  },
};
