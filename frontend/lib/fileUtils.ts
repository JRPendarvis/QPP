/**
 * File processing utilities
 * Single Responsibility: File conversion and validation
 */

export interface FabricFile {
  data: string;
  type: string;
}

/**
 * Convert File to base64 string with MIME type
 */
export async function fileToBase64(file: File): Promise<FabricFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve({
        data: base64Data,
        type: file.type
      });
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Filter only image files from uploaded files
 */
export function filterImageFiles(files: File[]): File[] {
  return files.filter(file => file.type.startsWith('image/'));
}

/**
 * Convert files to base64 with types
 */
export async function convertFilesToBase64(files: File[]): Promise<FabricFile[]> {
  return Promise.all(files.map(file => fileToBase64(file)));
}

/**
 * Create object URLs for file previews
 */
export function createFilePreviews(files: File[]): string[] {
  return files.map(file => URL.createObjectURL(file));
}
