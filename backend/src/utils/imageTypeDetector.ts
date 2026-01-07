/**
 * Image type detection and validation utilities
 */
export class ImageTypeDetector {
  private static readonly VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  /**
   * Detect image MIME type from base64 magic bytes
   */
  static detectFromBase64(base64Data: string): string {
    const header = base64Data.substring(0, 20);
    
    if (header.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (header.startsWith('iVBOR')) {
      return 'image/png';
    } else if (header.startsWith('R0lGOD')) {
      return 'image/gif';
    } else if (header.startsWith('UklGR')) {
      return 'image/webp';
    }
    
    return 'image/png';
  }

  /**
   * Validate and ensure MIME type is supported by Claude
   */
  static validateMimeType(mimeType: string): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
    return this.VALID_TYPES.includes(mimeType) 
      ? mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      : 'image/png';
  }

  /**
   * Detect or validate image type with logging
   */
  static detectOrValidate(base64Data: string, providedType?: string, index: number = 0): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
    let mimeType = providedType;
    
    if (!mimeType) {
      mimeType = this.detectFromBase64(base64Data);
    }
    
    const validType = this.validateMimeType(mimeType);
    
    return validType;
  }
}
