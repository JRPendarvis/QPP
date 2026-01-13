/**
 * Image Compression Utility
 * Orchestrates image compression to meet Claude API limits
 */

import { FabricImageValidator } from '../services/image/fabricImageValidator';
import { ImageMetricsCalculator } from '../services/image/imageMetricsCalculator';
import { CompressionRetryHandler } from '../services/image/compressionRetryHandler';
import { IMAGE_COMPRESSION_CONFIG } from '../config/imageCompressionConfig';

/**
 * Check if the number of fabric images meets the minimum required for a pattern
 */
export function validateMinFabricImages(patternId: string, imageCount: number) {
  return FabricImageValidator.validate(patternId, imageCount);
}

export interface CompressedImage {
  base64: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

/**
 * Compress an image if it exceeds the size limit
 */
export async function compressImageIfNeeded(
  base64Image: string,
  mimeType: string = 'image/jpeg'
): Promise<CompressedImage> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const originalSize = Buffer.byteLength(base64Data, 'base64');
  
  // If under limit, return as-is
  if (originalSize <= IMAGE_COMPRESSION_CONFIG.MAX_IMAGE_SIZE_BYTES) {
    return {
      base64: base64Data,
      mimeType,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false
    };
  }
  
  // Decode and compress
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const metrics = await ImageMetricsCalculator.calculate(imageBuffer, mimeType);
  
  const result = await CompressionRetryHandler.retryWithLowerQuality(imageBuffer, {
    hasAlpha: metrics.hasAlpha,
    quality: IMAGE_COMPRESSION_CONFIG.INITIAL_JPEG_QUALITY,
    resizeOptions: metrics.resizeOptions
  });
  
  return {
    base64: result.buffer.toString('base64'),
    mimeType: result.mimeType,
    originalSize,
    compressedSize: result.buffer.length,
    wasCompressed: true
  };
}

/**
 * Compress multiple images in parallel
 */
export async function compressImages(
  images: string[],
  mimeTypes: string[] = []
): Promise<CompressedImage[]> {
  const compressionPromises = images.map((img, index) => 
    compressImageIfNeeded(img, mimeTypes[index] || 'image/jpeg')
  );
  
  return Promise.all(compressionPromises);
}