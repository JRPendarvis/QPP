/**
 * Check if the number of fabric images meets the minimum required for a pattern
 * @param patternId - The pattern ID (e.g., 'grandmothers-flower-garden')
 * @param imageCount - Number of uploaded fabric images
 * @returns { minRequired: number, isValid: boolean, error?: string }
 */
export function validateMinFabricImages(patternId: string, imageCount: number) {
  // Import pattern registry and normalization
  const { getPattern } = require('../config/patterns');
  const { normalizePatternId } = require('../controllers/patternController');
  const normalizedId = normalizePatternId(patternId);
  const patternDef = getPattern(normalizedId);
  let minRequired = 2;
  if (patternDef) {
    if (patternDef.prompt && patternDef.prompt.recommendedFabricCount) {
      if (typeof patternDef.prompt.recommendedFabricCount === 'number') {
        minRequired = patternDef.prompt.recommendedFabricCount;
      } else if (patternDef.prompt.recommendedFabricCount.min) {
        minRequired = patternDef.prompt.recommendedFabricCount.min;
      }
    } else if (patternDef.minColors) {
      minRequired = patternDef.minColors;
    }
  }
  const isValid = imageCount >= minRequired;
  return {
    minRequired,
    isValid,
    error: isValid ? undefined : `This pattern requires at least ${minRequired} fabric images.`
  };
}
import sharp from 'sharp';

/**
 * Image compression utility to ensure images meet Claude API limits
 * Claude has a 5MB per image limit for base64 encoded images
 */

const MAX_IMAGE_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5MB to leave buffer (5MB limit)
const MAX_DIMENSION = 2048; // Max width or height
const JPEG_QUALITY = 85;

export interface CompressedImage {
  base64: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

/**
 * Compress an image if it exceeds the size limit
 * @param base64Image - Base64 encoded image (with or without data URI prefix)
 * @param mimeType - Original MIME type (image/jpeg, image/png, etc.)
 * @returns Compressed image data
 */
export async function compressImageIfNeeded(
  base64Image: string,
  mimeType: string = 'image/jpeg'
): Promise<CompressedImage> {
  // Remove data URI prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
  // Calculate original size
  const originalSize = Buffer.byteLength(base64Data, 'base64');
  
  // If under limit, return as-is
  if (originalSize <= MAX_IMAGE_SIZE_BYTES) {
    return {
      base64: base64Data,
      mimeType,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false
    };
  }
  
  console.log(`🖼️ Image exceeds limit: ${(originalSize / 1024 / 1024).toFixed(2)}MB - compressing...`);
  
  // Decode base64 to buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  // Get image metadata
  const metadata = await sharp(imageBuffer).metadata();
  const { width = 0, height = 0 } = metadata;
  
  // Calculate resize dimensions if needed
  let resizeOptions: sharp.ResizeOptions | undefined;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    resizeOptions = {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      fit: 'inside',
      withoutEnlargement: true
    };
    console.log(`   Resizing from ${width}x${height} to ${resizeOptions.width}x${resizeOptions.height}`);
  }
  
  // Compress the image
  let compressedBuffer: Buffer;
  let outputMimeType: string;
  
  // Always convert to JPEG for better compression (unless it's a PNG with transparency)
  const hasAlpha = metadata.hasAlpha && mimeType === 'image/png';
  
  if (hasAlpha) {
    // Keep as PNG but optimize
    let pipeline = sharp(imageBuffer);
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }
    compressedBuffer = await pipeline
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();
    outputMimeType = 'image/png';
  } else {
    // Convert to JPEG for maximum compression
    let pipeline = sharp(imageBuffer);
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }
    compressedBuffer = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    outputMimeType = 'image/jpeg';
  }
  
  // If still too large, reduce quality further
  let quality = JPEG_QUALITY;
  while (compressedBuffer.length > MAX_IMAGE_SIZE_BYTES && quality > 30) {
    quality -= 10;
    console.log(`   Still too large (${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB), reducing quality to ${quality}%`);
    
    let pipeline = sharp(imageBuffer);
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }
    
    if (hasAlpha) {
      compressedBuffer = await pipeline
        .png({ quality: Math.max(quality, 50), compressionLevel: 9 })
        .toBuffer();
    } else {
      compressedBuffer = await pipeline
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
    }
  }
  
  // If STILL too large, force more aggressive resize
  if (compressedBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    console.log(`   Applying aggressive resize...`);
    const aggressiveResize: sharp.ResizeOptions = {
      width: 1024,
      height: 1024,
      fit: 'inside',
      withoutEnlargement: true
    };
    
    compressedBuffer = await sharp(imageBuffer)
      .resize(aggressiveResize)
      .jpeg({ quality: 70, mozjpeg: true })
      .toBuffer();
    outputMimeType = 'image/jpeg';
  }
  
  const compressedBase64 = compressedBuffer.toString('base64');
  const compressedSize = compressedBuffer.length;
  
  console.log(`   Compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${Math.round((1 - compressedSize / originalSize) * 100)}% reduction)`);
  
  return {
    base64: compressedBase64,
    mimeType: outputMimeType,
    originalSize,
    compressedSize,
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