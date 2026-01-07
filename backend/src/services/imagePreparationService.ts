import { compressImages } from '../utils/imageCompressor';

/**
 * Result of image preparation
 */
export interface PreparedImages {
  base64s: string[];
  mimeTypes: string[];
}

/**
 * Service for preparing images for Claude API consumption
 */
export class ImagePreparationService {
  /** Maximum image size allowed by Claude API (5MB) */
  private static readonly MAX_CLAUDE_IMAGE_SIZE = 5 * 1024 * 1024;

  /**
   * Prepares images for Claude API by compressing and validating sizes
   * 
   * @param fabricImages - Array of base64 image strings
   * @param imageTypes - Array of MIME types for each image
   * @returns Prepared images with base64s and mimeTypes
   * @throws Error if any image exceeds size limit after compression
   * 
   * @example
   * ```typescript
   * const prepared = await ImagePreparationService.prepare(images, types);
   * // Use prepared.base64s and prepared.mimeTypes
   * ```
   */
  static async prepare(
    fabricImages: string[],
    imageTypes: string[] = []
  ): Promise<PreparedImages> {
    const compressedImages = await compressImages(fabricImages, imageTypes);
    this.logCompressionResults(compressedImages);
    this.validateImageSizes(compressedImages);

    return {
      base64s: compressedImages.map(img => img.base64),
      mimeTypes: compressedImages.map(img => img.mimeType)
    };
  }

  /**
   * Logs compression statistics
   */
  private static logCompressionResults(compressedImages: any[]): void {
    // Logging disabled for production
  }

  /**
   * Validates that all images are within Claude's size limit
   */
  private static validateImageSizes(compressedImages: any[]): void {
    const tooLarge = compressedImages.find(
      img => img.compressedSize > this.MAX_CLAUDE_IMAGE_SIZE
    );
    
    if (tooLarge) {
      throw new Error(
        `One or more images could not be compressed below 5MB. Please upload smaller or lower-resolution images. (Image size: ${(tooLarge.compressedSize / 1024 / 1024).toFixed(2)}MB)`
      );
    }
  }
}
