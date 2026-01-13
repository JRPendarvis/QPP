// src/services/imageContentBuilder.ts

import { ImageTypeDetector } from '../utils/imageTypeDetector';

export type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export interface ClaudeImageContent {
  type: 'image';
  source: {
    type: 'base64';
    media_type: ImageMediaType;
    data: string;
  };
}

/**
 * Builds image content array for Claude API
 * Single Responsibility: Image content formatting for Claude API
 */
export class ImageContentBuilder {
  /**
   * Build image content array for Claude API
   * @param fabricImages - Array of base64-encoded images
   * @param imageTypes - Optional array of image MIME types
   * @returns Array of Claude image content objects
   */
  buildImageContent(fabricImages: string[], imageTypes: string[] = []): ClaudeImageContent[] {
    return fabricImages.map((imageBase64, index) => {
      const mimeType = this.detectImageType(imageBase64, imageTypes[index], index);

      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: mimeType,
          data: imageBase64,
        },
      };
    });
  }

  /**
   * Detect or validate image MIME type
   */
  private detectImageType(imageBase64: string, providedType?: string, index?: number): ImageMediaType {
    return ImageTypeDetector.detectOrValidate(imageBase64, providedType, index) as ImageMediaType;
  }
}
