/**
 * Compress an image file to fit under 5MB and max 2048px dimension.
 * Returns a new File or null if compression fails.
 */
export const compressImage = async (file: File): Promise<File | null> => {
  const MAX_SIZE = 5 * 1024 * 1024;
  const MIN_QUALITY = 0.3;
  const MAX_DIM = 2048;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize if dimensions exceed max
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = (height / width) * MAX_DIM;
            width = MAX_DIM;
          } else {
            width = (width / height) * MAX_DIM;
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.8;

        function tryCompress() {
          canvas.toBlob((blob) => {
            if (!blob) return resolve(null);

            if (blob.size <= MAX_SIZE || quality <= MIN_QUALITY) {
              if (blob.size > MAX_SIZE) {
                // Can't compress enough
                resolve(null);
              } else {
                resolve(new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }));
              }
            } else {
              quality -= 0.1;
              tryCompress();
            }
          }, 'image/jpeg', quality);
        }

        tryCompress();
      };

      img.onerror = () => resolve(null);
    };

    reader.onerror = () => resolve(null);
  });
};

/**
 * Format bytes as a string in MB.
 */
export const formatMB = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};

/**
 * Process multiple files through compression pipeline
 */
export const processImageFiles = async (files: File[]): Promise<{
  validFiles: File[];
  skippedCount: number;
  tooLargeFiles: File[];
}> => {
  const MAX_SIZE = 5 * 1024 * 1024;
  const tooLargeFiles = files.filter(f => f.size > MAX_SIZE);

  const compressedResults = await Promise.all(
    files.map(file => compressImage(file))
  );

  const validFiles: File[] = compressedResults.filter((f): f is File => f instanceof File);
  const skippedCount = files.length - validFiles.length;

  return {
    validFiles,
    skippedCount,
    tooLargeFiles,
  };
};
