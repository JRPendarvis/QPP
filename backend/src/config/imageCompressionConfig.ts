/**
 * Image Compression Configuration
 */

export const IMAGE_COMPRESSION_CONFIG = {
  /** Maximum image size in bytes (4.5MB with buffer for 5MB Claude API limit) */
  MAX_IMAGE_SIZE_BYTES: 4.5 * 1024 * 1024,
  
  /** Maximum width or height dimension */
  MAX_DIMENSION: 2048,
  
  /** Initial JPEG compression quality */
  INITIAL_JPEG_QUALITY: 85,
  
  /** Minimum quality before giving up */
  MIN_QUALITY: 30,
  
  /** Quality reduction step when retrying */
  QUALITY_STEP: 10,
  
  /** Minimum PNG quality */
  MIN_PNG_QUALITY: 50,
  
  /** PNG compression level (0-9) */
  PNG_COMPRESSION_LEVEL: 9,
  
  /** Aggressive resize dimensions as fallback */
  AGGRESSIVE_RESIZE: {
    width: 1024,
    height: 1024
  },
  
  /** Aggressive resize quality */
  AGGRESSIVE_QUALITY: 70
} as const;
