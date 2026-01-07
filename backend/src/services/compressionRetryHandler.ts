/**
 * Compression Retry Handler Service
 * Handles iterative quality reduction when compression fails to meet size requirements
 */

import { IMAGE_COMPRESSION_CONFIG } from '../config/imageCompressionConfig';
import { ImageCompressionEngine, CompressionOptions } from './imageCompressionEngine';

export class CompressionRetryHandler {
  /**
   * Retry compression with progressively lower quality until size target is met
   */
  static async retryWithLowerQuality(
    imageBuffer: Buffer,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    let quality = options.quality;
    let result = await ImageCompressionEngine.compress(imageBuffer, options);
    
    // Keep reducing quality until size is acceptable or we hit minimum
    while (
      result.buffer.length > IMAGE_COMPRESSION_CONFIG.MAX_IMAGE_SIZE_BYTES && 
      quality > IMAGE_COMPRESSION_CONFIG.MIN_QUALITY
    ) {
      quality -= IMAGE_COMPRESSION_CONFIG.QUALITY_STEP;
      
      result = await ImageCompressionEngine.compress(imageBuffer, {
        ...options,
        quality
      });
    }
    
    // If still too large, try aggressive compression
    if (result.buffer.length > IMAGE_COMPRESSION_CONFIG.MAX_IMAGE_SIZE_BYTES) {
      result = await ImageCompressionEngine.compressAggressively(imageBuffer);
    }
    
    return result;
  }
}
