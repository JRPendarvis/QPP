'use client';

import { useDropzone } from 'react-dropzone';

interface FabricDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  currentCount: number;
  maxFiles: number;
}

export default function FabricDropzone({ 
  onFilesAdded, 
  currentCount, 
  maxFiles 
}: FabricDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 10485760, // 10MB
    disabled: currentCount >= maxFiles,
  });

  return (
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
            Max 10MB per image • {currentCount}/{maxFiles} uploaded
          </p>
        </div>
      )}
    </div>
  );
}