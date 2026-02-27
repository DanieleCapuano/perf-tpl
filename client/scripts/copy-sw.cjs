/**
 * Copy built service worker to public folder for dev mode
 * This ensures /sw.js is available during development
 */
const fs = require('fs');
const path = require('path');

const swSource = path.join(__dirname, '../dist/sw.js');
const swDest = path.join(__dirname, '../public/sw.js');

// Check if dist/sw.js exists
if (fs.existsSync(swSource)) {
  // Copy to public folder
  fs.copyFileSync(swSource, swDest);
  console.log('✓ Service Worker copied to public folder for dev mode');
} else {
  console.warn('⚠ dist/sw.js not found. Run production build first.');
  process.exit(1);
}
