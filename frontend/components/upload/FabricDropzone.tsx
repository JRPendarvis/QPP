'use client';

import { useDropzone } from 'react-dropzone';
import { useRef } from 'react';

interface FabricDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  currentCount: number;
  maxFiles: number;
}

// Compress image to be under 5MB
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate scale to reduce file size
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Start with quality 0.8 and reduce if needed
        let quality = 0.8;
        canvas.toBlob(async (blob) => {
          if (blob) {
            // If still too large, try lower quality
            if (blob.size > 5242880) {
              quality = 0.6;
              canvas.toBlob(async (secondBlob) => {
                if (secondBlob) {
                  const compressedFile = new File([secondBlob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  reject(new Error('Compression failed'));
                }
              }, 'image/jpeg', quality);
            } else {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          } else {
            reject(new Error('Compression failed'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function FabricDropzone({ 
  onFilesAdded, 
  currentCount, 
  maxFiles 
}: FabricDropzoneProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5242880, // 5MB (Claude API limit)
    disabled: currentCount >= maxFiles,
  });

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        // Compress images from camera
        const compressedFiles = await Promise.all(
          Array.from(files).map(file => compressImage(file))
        );
        onFilesAdded(compressedFiles);
      } catch (error) {
        console.error('Error compressing images:', error);
        // Fallback to original files if compression fails
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
    </div>
  );
}