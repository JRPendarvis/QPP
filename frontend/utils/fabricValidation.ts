import { formatMB } from './imageCompression';

/**
 * Show an alert for files that are too large.
 */
export const alertTooLarge = (files: File[]) => {
  alert(
    `Some images are over 5MB and may take longer to upload or may be rejected. Please upload smaller images.\nFiles: ${files
      .map(f => `${f.name} (${formatMB(f.size)})`)
      .join(', ')}`
  );
};

/**
 * Show an alert for files that could not be compressed under 5MB.
 */
export const alertSkipped = () => {
  alert(
    'Some images could not be compressed under 5MB and were skipped. Please upload smaller or lower-resolution images.'
  );
};

/**
 * Validate file types are supported images
 */
export const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Validate file size is under limit
 */
export const isValidSize = (file: File, maxSize: number = 5 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};
