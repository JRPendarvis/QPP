
'use client';
import React from 'react';


import { useDropzone } from 'react-dropzone';
import { useRef } from 'react';


export interface FabricDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  currentCount: number;
  maxFiles: number;
  totalSize: number;
}



// --- Utility Functions ---

/**
 * Compress an image file to fit under 5MB and max 2048px dimension.
 * Returns a new File or null if compression fails.
 */
const compressImage = async (file: File): Promise<File | null> => {
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
const formatMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

/**
 * Show an alert for files that are too large.
 */
const alertTooLarge = (files: File[], formatMB: (bytes: number) => string) => {
  alert(`Some images are over 5MB and may take longer to upload or may be rejected. Please upload smaller images.\nFiles: ${files.map(f => f.name + ' (' + formatMB(f.size) + ')').join(', ')}`);
};

/**
 * Show an alert for files that could not be compressed under 5MB.
 */
const alertSkipped = () => {
  alert('Some images could not be compressed under 5MB and were skipped. Please upload smaller or lower-resolution images.');
};

export default function FabricDropzone({
  onFilesAdded,
  currentCount,
  maxFiles,
  totalSize
}: FabricDropzoneProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);


  // --- Handlers ---

  /**
   * Handle files dropped via drag-and-drop or file picker.
   */
  const handleDrop = async (acceptedFiles: File[]) => {
    const tooLarge = acceptedFiles.filter(f => f.size > 5 * 1024 * 1024);
    if (tooLarge.length > 0) {
      alertTooLarge(tooLarge, formatMB);
    }
    const compressedResults = await Promise.all(
      acceptedFiles.map(file => compressImage(file))
    );
    const validFiles: File[] = compressedResults.filter((f): f is File => f instanceof File);
    const skipped = acceptedFiles.length - validFiles.length;
    if (skipped > 0) {
      alertSkipped();
    }
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5242880, // 5MB (Claude API limit)
    disabled: currentCount >= maxFiles,
  });


  /**
   * Handle camera button click (mobile/tablet only).
   */
  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  /**
   * Handle files captured from camera input.
   */
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const tooLarge = Array.from(files).filter(f => f.size > 5 * 1024 * 1024);
      if (tooLarge.length > 0) {
        alertTooLarge(tooLarge, formatMB);
      }
      try {
        const compressedResults = await Promise.all(
          Array.from(files).map(file => compressImage(file))
        );
        const validFiles: File[] = compressedResults.filter((f): f is File => f instanceof File);
        const skipped = files.length - validFiles.length;
        if (skipped > 0) {
          alertSkipped();
        }
        if (validFiles.length > 0) {
          onFilesAdded(validFiles);
        }
      } catch (error) {
        console.error('Error compressing images:', error);
        onFilesAdded(Array.from(files));
      }
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          currentCount >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {currentCount >= maxFiles ? (
          <p className="mt-2 text-sm text-gray-500">Maximum {maxFiles} images reached</p>
        ) : isDragActive ? (
          <p className="mt-2 text-sm text-indigo-600">Drop the images here...</p>
        ) : (
          <div>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop fabric images here, or click to select files
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Max 5MB per image • {currentCount}/{maxFiles} uploaded
            </p>
          </div>
        )}
      </div>
      
      {/* Camera Button for Mobile/Tablet Only */}
      {currentCount < maxFiles && (
        <div className="mt-4 flex justify-center md:hidden">
          <button
            onClick={handleCameraClick}
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Take Photo with Camera
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
            multiple={currentCount < maxFiles - 1}
          />
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        Total uploaded image size: {formatMB(totalSize)}
      </div>
    </div>
  );
}