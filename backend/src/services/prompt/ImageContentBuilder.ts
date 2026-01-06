import { ImageTypeDetector } from '../../utils/imageTypeDetector';

export type MediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export interface ImageContent {
  type: 'image';
  source: {
    type: 'base64';
    media_type: MediaType;
    data: string;
  };
}

/**
 * Utility responsible for building image content arrays for Claude API.
 * 
 * Single Responsibility: Image content formatting for API requests
 */
export class ImageContentBuilder {
  /**
   * Build image content array for Claude API
   */
  static buildImageContent(
    fabricImages: string[],
    imageTypes: string[] = []
  ): ImageContent[] {
    return fabricImages.map((imageBase64, index) => {
      const mimeType = ImageTypeDetector.detectOrValidate(
        imageBase64,
        imageTypes[index],
        index
      ) as MediaType;

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
}
