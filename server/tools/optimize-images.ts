/**
 * Image Optimization Tool
 * 
 * Uses Sharp to optimize images for web delivery
 * Run with: node tools/optimize-images.js <input-dir> <output-dir>
 */

import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

interface OptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  progressive?: boolean;
}

/**
 * Optimize a single image
 */
async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizationOptions = {}
): Promise<void> {
  const {
    quality = 80,
    width,
    height,
    format,
    progressive = true,
  } = options;

  try {
    let pipeline = sharp(inputPath);

    // Resize if dimensions specified
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert format if specified
    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, progressive });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality, progressive });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'avif') {
      pipeline = pipeline.avif({ quality });
    }

    await pipeline.toFile(outputPath);
    
    console.log(`✓ Optimized: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`✗ Failed to optimize ${inputPath}:`, error);
  }
}

/**
 * Optimize all images in a directory
 */
async function optimizeDirectory(
  inputDir: string,
  outputDir: string,
  options: OptimizationOptions = {}
): Promise<void> {
  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const files = readdirSync(inputDir);

  for (const file of files) {
    const inputPath = join(inputDir, file);
    const stat = statSync(inputPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subOutputDir = join(outputDir, file);
      await optimizeDirectory(inputPath, subOutputDir, options);
    } else {
      // Check if file is a supported image format
      const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
      
      if (SUPPORTED_FORMATS.includes(ext)) {
        const outputPath = join(outputDir, file);
        await optimizeImage(inputPath, outputPath, options);
      }
    }
  }
}

/**
 * Generate multiple image sizes (responsive images)
 */
async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  sizes: number[] = [640, 768, 1024, 1280, 1920]
): Promise<void> {
  const filename = inputPath.substring(inputPath.lastIndexOf('/') + 1);
  const name = filename.substring(0, filename.lastIndexOf('.'));
  const ext = filename.substring(filename.lastIndexOf('.'));

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const size of sizes) {
    const outputPath = join(outputDir, `${name}-${size}w${ext}`);
    await optimizeImage(inputPath, outputPath, { width: size });
  }

  // Generate WebP versions
  for (const size of sizes) {
    const outputPath = join(outputDir, `${name}-${size}w.webp`);
    await optimizeImage(inputPath, outputPath, { width: size, format: 'webp' });
  }

  console.log(`✓ Generated responsive images for: ${filename}`);
}

/**
 * CLI interface
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Usage: node optimize-images.js <input-dir> <output-dir> [options]

Options:
  --quality=<number>   Quality (1-100, default: 80)
  --width=<number>     Max width
  --height=<number>    Max height
  --format=<format>    Output format (jpeg, png, webp, avif)
  --responsive         Generate responsive image sizes

Examples:
  node optimize-images.js ./images ./optimized
  node optimize-images.js ./images ./optimized --quality=90 --format=webp
  node optimize-images.js ./photo.jpg ./responsive --responsive
    `);
    process.exit(1);
  }

  const [inputPath, outputPath] = args;
  const options: OptimizationOptions = {};

  // Parse options
  args.slice(2).forEach(arg => {
    if (arg.startsWith('--quality=')) {
      options.quality = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--width=')) {
      options.width = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--height=')) {
      options.height = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1] as any;
    }
  });

  const isResponsive = args.includes('--responsive');

  console.log('Starting image optimization...');
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Options:`, options);

  const stat = statSync(inputPath);

  if (isResponsive) {
    if (stat.isFile()) {
      generateResponsiveImages(inputPath, outputPath)
        .then(() => console.log('✓ Done!'))
        .catch(err => console.error('Error:', err));
    } else {
      console.error('--responsive requires a single image file as input');
      process.exit(1);
    }
  } else {
    if (stat.isDirectory()) {
      optimizeDirectory(inputPath, outputPath, options)
        .then(() => console.log('✓ Done!'))
        .catch(err => console.error('Error:', err));
    } else {
      optimizeImage(inputPath, outputPath, options)
        .then(() => console.log('✓ Done!'))
        .catch(err => console.error('Error:', err));
    }
  }
}

export { optimizeImage, optimizeDirectory, generateResponsiveImages };
