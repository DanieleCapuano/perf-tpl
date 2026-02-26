/**
 * Video Optimization Tool
 * 
 * Uses FFmpeg CLI to optimize videos for web delivery
 * Run with: node tools/optimize-videos.js <input-file> <output-file>
 */

import { execa } from 'execa';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

interface VideoOptions {
  codec?: string;
  bitrate?: string;
  resolution?: string;
  fps?: number;
  format?: string;
}

/**
 * Optimize video for web
 */
export async function optimizeVideo(
  inputPath: string,
  outputPath: string,
  options: VideoOptions = {}
): Promise<void> {
  const {
    codec = 'libx264',
    bitrate = '1000k',
    resolution,
    fps,
  } = options;

  // Ensure output directory exists
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const args = [
    '-i', inputPath,
    '-c:v', codec,
    '-b:v', bitrate,
  ];

  if (resolution) {
    args.push('-s', resolution);
  }

  if (fps) {
    args.push('-r', fps.toString());
  }

  // Overwrite output file
  args.push('-y', outputPath);

  console.log('FFmpeg command:', ffmpegPath.path, args.join(' '));

  try {
    const { stdout } = await execa(ffmpegPath.path, args);
    console.log(stdout);
    console.log(`✓ Video optimized: ${outputPath}`);
  } catch (error) {
    console.error('✗ Error optimizing video:', error.message);
    throw error;
  }
}

/**
 * Generate video thumbnail
 */
export async function generateThumbnail(
  inputPath: string,
  outputPath: string,
  timeInSeconds: number = 1
): Promise<void> {
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const args = [
    '-i', inputPath,
    '-ss', timeInSeconds.toString(),
    '-vframes', '1',
    '-s', '1280x720',
    '-y', outputPath
  ];

  console.log('FFmpeg thumbnail command:', ffmpegPath.path, args.join(' '));

  try {
    await execa(ffmpegPath.path, args);
    console.log(`✓ Thumbnail generated: ${outputPath}`);
  } catch (error) {
    console.error('✗ Error generating thumbnail:', error.message);
    throw error;
  }
}

/**
 * CLI interface
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Usage: node optimize-videos.js <input-file> <output-file> [options]

Options:
  --codec=<codec>          Video codec (default: libx264)
  --bitrate=<bitrate>      Video bitrate (default: 1000k)
  --resolution=<res>       Resolution (e.g., 1280x720)
  --fps=<number>           Frames per second
  --format=<format>        Output format (default: mp4)
  --thumbnail              Generate thumbnail instead

Examples:
  node optimize-videos.js input.mp4 output.mp4
  node optimize-videos.js input.mp4 output.mp4 --bitrate=2000k --resolution=1920x1080
  node optimize-videos.js input.mp4 thumb.jpg --thumbnail
    `);
    process.exit(1);
  }

  const [inputPath, outputPath] = args;
  const options: VideoOptions = {};
  const isThumbnail = args.includes('--thumbnail');

  // Parse options
  args.slice(2).forEach(arg => {
    if (arg.startsWith('--codec=')) {
      options.codec = arg.split('=')[1];
    } else if (arg.startsWith('--bitrate=')) {
      options.bitrate = arg.split('=')[1];
    } else if (arg.startsWith('--resolution=')) {
      options.resolution = arg.split('=')[1];
    } else if (arg.startsWith('--fps=')) {
      options.fps = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    }
  });

  console.log('Starting video processing...');
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);

  if (isThumbnail) {
    generateThumbnail(inputPath, outputPath)
      .catch(err => {
        console.error('Error:', err);
        process.exit(1);
      });
  } else {
    console.log(`Options:`, options);
    optimizeVideo(inputPath, outputPath, options)
      .catch(err => {
        console.error('Error:', err);
        process.exit(1);
      });
  }
}
