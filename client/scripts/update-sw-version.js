/**
 * Update Service Worker cache version for dev builds
 * Automatically bumps the version to bust cache during development
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swPath = join(__dirname, '../src/sw/sw.ts');
const isProduction = process.env.NODE_ENV === 'production';

try {
  let swContent = readFileSync(swPath, 'utf-8');
  
  if (!isProduction) {
    // Use timestamp for dev builds to always bust cache
    const version = `dev-${Date.now()}`;
    swContent = swContent.replace(
      /const CACHE_VERSION = ['"].*?['"];/,
      `const CACHE_VERSION = '${version}';`
    );
    console.log(`✓ Service Worker cache version updated: ${version}`);
  } else {
    // For production, increment semantic version
    const currentVersion = swContent.match(/const CACHE_VERSION = ['"]v?(\d+)['"];/);
    if (currentVersion) {
      const newVersion = `v${parseInt(currentVersion[1]) + 1}`;
      swContent = swContent.replace(
        /const CACHE_VERSION = ['"].*?['"];/,
        `const CACHE_VERSION = '${newVersion}';`
      );
      console.log(`✓ Service Worker cache version updated: ${newVersion}`);
    }
  }
  
  writeFileSync(swPath, swContent, 'utf-8');
} catch (error) {
  console.error('✗ Failed to update Service Worker version:', error.message);
  process.exit(0); // Don't fail the build
}
