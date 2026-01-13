/**
 * Image Metrics Calculator Service
 * Calculates dimensions, sizes, and resize options for images
 */

import sharp from 'sharp';
import { IMAGE_COMPRESSION_CONFIG } from '../../config/imageCompressionConfig';

export interface ImageMetrics {
  width: number;
  height: number;
  hasAlpha: boolean;
  needsResize: boolean;
  resizeOptions?: sharp.ResizeOptions;
}

export class ImageMetricsCalculator {
  /**
   * Calculate metrics and resize options for an image
   */
  static async calculate(imageBuffer: Buffer, mimeType: string): Promise<ImageMetrics> {
    const metadata = await sharp(imageBuffer).metadata();
    const { width = 0, height = 0 } = metadata;
    const hasAlpha = metadata.hasAlpha === true && mimeType === 'image/png';
    
    const needsResize = width > IMAGE_COMPRESSION_CONFIG.MAX_DIMENSION || 
                        height > IMAGE_COMPRESSION_CONFIG.MAX_DIMENSION;
    
    const resizeOptions = needsResize 
      ? this.calculateResizeOptions(width, height) 
      : undefined;
    
    return {
      width,
      height,
      hasAlpha,
      needsResize,
      resizeOptions
    };
  }

  /**
   * Calculate resize options to fit within max dimensions
   */
  private static calculateResizeOptions(width: number, height: number): sharp.ResizeOptions {
    const scale = Math.min(
      IMAGE_COMPRESSION_CONFIG.MAX_DIMENSION / width,
      IMAGE_COMPRESSION_CONFIG.MAX_DIMENSION / height
    );
    
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      fit: 'inside',
      withoutEnlargement: true
    };
  }

  /**
   * Get aggressive resize options for final fallback
   */
  static getAggressiveResizeOptions(): sharp.ResizeOptions {
    return {
      width: IMAGE_COMPRESSION_CONFIG.AGGRESSIVE_RESIZE.width,
      height: IMAGE_COMPRESSION_CONFIG.AGGRESSIVE_RESIZE.height,
      fit: 'inside',
      withoutEnlargement: true
    };
  }
}
