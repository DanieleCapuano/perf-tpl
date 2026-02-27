/**
 * Vite plugin to inline critical CSS and JS into HTML
 * Eliminates render-blocking requests for critical resources
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function inlineCritical(): Plugin {
  return {
    name: 'inline-critical',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        try {
          const criticalCss = readFileSync(
            resolve(__dirname, '../src/critical/critical.css'),
            'utf-8'
          );

          const criticalJs = readFileSync(
            resolve(__dirname, '../src/critical/critical.js'),
            'utf-8'
          )
            // Remove TypeScript-specific syntax for inline use
            .replace(/import\.meta\.env\.DEV/g, 'false')
            .replace(/\/\*\*[\s\S]*?\*\//g, '') // Remove JSDoc comments
            .replace(/\/\/.*$/gm, '') // Remove single-line comments
            .trim();

          // Inject critical CSS in <head>
          html = html.replace(
            '</head>',
            `  <style id="critical-css">${criticalCss}</style>\n  </head>`
          );

          // Inject critical JS at start of <body>
          html = html.replace(
            '</body>',
            `<script id="critical-js">${criticalJs}</script>\n</body>`
          );

          return html;
        } catch (error) {
          console.error('Failed to inline critical resources:', error);
          return html;
        }
      },
    },
  };
}
