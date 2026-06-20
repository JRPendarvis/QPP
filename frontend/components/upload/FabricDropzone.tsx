'use client';

import { useDropzone } from 'react-dropzone';
import { useEffect, useRef, useState } from 'react';
import { processImageFiles, formatMB } from '@/utils/imageCompression';
import { alertTooLarge, alertSkipped } from '@/utils/fabricValidation';

export interface FabricDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  currentCount: number;
  maxFiles: number;
  totalSize: number;
}

export default function FabricDropzone({
  onFilesAdded,
  currentCount,
  maxFiles,
  totalSize
}: FabricDropzoneProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [cameraStream]);

  const processAndAddFiles = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      const { validFiles, skippedCount, tooLargeFiles } = await processImageFiles(files);

      if (tooLargeFiles.length > 0) {
        alertTooLarge(tooLargeFiles);
      }

      if (skippedCount > 0) {
        alertSkipped();
      }

      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      onFilesAdded(files);
    }
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    await processAndAddFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5242880, // 5MB (Claude API limit)
    disabled: currentCount >= maxFiles,
  });

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
      },
      audio: false,
    })
      .then((stream) => {
        setCameraStream(stream);
        setCameraModalOpen(true);
      })
      .catch((error) => {
        console.warn('Direct camera access unavailable, falling back to file picker.', error);
        cameraInputRef.current?.click();
      });
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processAndAddFiles(Array.from(files));
    }
  };

  const handleCaptureFromVideo = async () => {
    const video = cameraVideoRef.current;
    if (!video) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const photoFile = new File([blob], `camera-capture-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      await processAndAddFiles([photoFile]);
      setCameraModalOpen(false);
      stopCameraStream();
    }, 'image/jpeg', 0.92);
  };

  useEffect(() => {
    if (!cameraModalOpen || !cameraStream || !cameraVideoRef.current) return;

    cameraVideoRef.current.srcObject = cameraStream;
    cameraVideoRef.current.play().catch((error) => {
      console.warn('Unable to autoplay camera preview.', error);
    });
  }, [cameraModalOpen, cameraStream]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center ${
          currentCount >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 active:border-indigo-500'
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-16 w-16 sm:h-12 sm:w-12 text-gray-400"
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
          <p className="mt-4 text-base sm:text-sm text-gray-500">Maximum {maxFiles} images reached</p>
        ) : isDragActive ? (
          <p className="mt-4 text-base sm:text-sm text-indigo-600 font-medium">Drop the images here...</p>
        ) : (
          <div>
            <p className="mt-4 text-base sm:text-sm text-gray-600 font-medium">
              Drag and drop fabric images here, or tap to select files
            </p>
            <p className="mt-2 text-sm sm:text-xs text-gray-500">
              Max 5MB per image • {currentCount}/{maxFiles} uploaded
            </p>
          </div>
        )}
      </div>
      
      {/* Camera button for touch devices (phone + tablet) */}
      {currentCount < maxFiles && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCameraClick}
            type="button"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors shadow-lg min-h-12 min-w-[200px]"
            aria-label="Open camera to take a fabric photo"
          >
            <svg
              className="h-6 w-6"
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
            <span className="text-base">Open Camera</span>
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
      {currentCount < maxFiles && (
        <p className="mt-2 text-xs text-gray-500 text-center">Tip: Use Open Camera for a quick fabric snapshot.</p>
      )}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Total uploaded image size: {formatMB(totalSize)}
      </div>

      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setCameraModalOpen(false);
              stopCameraStream();
            }}
          />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Camera Preview</h3>
            <p className="mt-1 text-sm text-gray-600">Capture a fabric photo, then we will add it to your uploads.</p>
            <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-black">
              <video
                ref={cameraVideoRef}
                className="w-full h-auto"
                playsInline
                muted
                autoPlay
              />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setCameraModalOpen(false);
                  stopCameraStream();
                }}
                className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleCaptureFromVideo();
                }}
                className="px-3 py-2 rounded-md bg-teal-600 text-sm font-medium text-white hover:bg-teal-700"
              >
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
