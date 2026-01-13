/**
 * Image Compression Engine Service
 * Handles actual image compression using Sharp
 */

import sharp from 'sharp';
import { IMAGE_COMPRESSION_CONFIG } from '../../config/imageCompressionConfig';

export interface CompressionOptions {
  hasAlpha: boolean;
  quality: number;
  resizeOptions?: sharp.ResizeOptions;
}

export class ImageCompressionEngine {
  /**
   * Compress image buffer with specified options
   */
  static async compress(
    imageBuffer: Buffer,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const { hasAlpha, quality, resizeOptions } = options;
    
    if (hasAlpha) {
      return this.compressPng(imageBuffer, quality, resizeOptions);
    } else {
      return this.compressJpeg(imageBuffer, quality, resizeOptions);
    }
  }

  /**
   * Compress as PNG (for images with transparency)
   */
  private static async compressPng(
    imageBuffer: Buffer,
    quality: number,
    resizeOptions?: sharp.ResizeOptions
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    let pipeline = sharp(imageBuffer);
    
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }
    
    const buffer = await pipeline
      .png({ 
        quality: Math.max(quality, IMAGE_COMPRESSION_CONFIG.MIN_PNG_QUALITY), 
        compressionLevel: IMAGE_COMPRESSION_CONFIG.PNG_COMPRESSION_LEVEL 
      })
      .toBuffer();
    
    return { buffer, mimeType: 'image/png' };
  }

  /**
   * Compress as JPEG (for maximum compression)
   */
  private static async compressJpeg(
    imageBuffer: Buffer,
    quality: number,
    resizeOptions?: sharp.ResizeOptions
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    let pipeline = sharp(imageBuffer);
    
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }
    
    const buffer = await pipeline
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    
    return { buffer, mimeType: 'image/jpeg' };
  }

  /**
   * Aggressive compression as last resort
   */
  static async compressAggressively(imageBuffer: Buffer): Promise<{ buffer: Buffer; mimeType: string }> {
    const buffer = await sharp(imageBuffer)
      .resize({
        width: IMAGE_COMPRESSION_CONFIG.AGGRESSIVE_RESIZE.width,
        height: IMAGE_COMPRESSION_CONFIG.AGGRESSIVE_RESIZE.height,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: IMAGE_COMPRESSION_CONFIG.AGGRESSIVE_QUALITY, 
        mozjpeg: true 
      })
      .toBuffer();
    
    return { buffer, mimeType: 'image/jpeg' };
  }
}
