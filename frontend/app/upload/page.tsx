'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fabrics, setFabrics] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for images only
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );

    // Add to fabrics array
    setFabrics(prev => [...prev, ...imageFiles]);

    // Create preview URLs
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 10485760, // 10MB
  });

  // Remove a fabric
  const removeFabric = (index: number) => {
    setFabrics(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all fabrics
  const clearAll = () => {
    setFabrics([]);
    setPreviews([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Upload Fabrics</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload Your Fabric Images
          </h2>
          <p className="text-gray-600 mb-6">
            Upload 2-8 fabric images to generate your quilt pattern. Supported formats: JPG, PNG, WEBP
          </p>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
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
            {isDragActive ? (
              <p className="mt-2 text-sm text-indigo-600">Drop the images here...</p>
            ) : (
              <div>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop fabric images here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Max 10MB per image
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Fabrics Preview */}
          {fabrics.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Uploaded Fabrics ({fabrics.length})
                </h3>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={preview}
                        alt={`Fabric ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFabric(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {fabrics[index].name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Generate Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    // TODO: Navigate to pattern generation
                    alert('Pattern generation coming next!');
                  }}
                  disabled={fabrics.length < 2}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Pattern ({fabrics.length} fabrics)
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}