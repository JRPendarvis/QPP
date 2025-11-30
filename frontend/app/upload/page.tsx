'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import UploadHeader from '@/components/upload/UploadHeader';
import FabricDropzone from '@/components/upload/FabricDropzone';
import FabricPreviewGrid from '@/components/upload/FabricPreviewGrid';
import GenerateButton from '@/components/upload/GenerateButton';
import PatternDisplay from '@/components/upload/PatternDisplay';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    fabrics,
    previews,
    generating,
    pattern,
    error,
    MAX_FABRICS,
    MIN_FABRICS,
    handleFilesAdded,
    removeFabric,
    clearAll,
    generatePattern,
  } = usePatternGeneration();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
      <UploadHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Fabric Images</h2>
          <p className="text-gray-600 mb-6">
            Upload {MIN_FABRICS}-{MAX_FABRICS} fabric images to generate your quilt pattern. 
            Supported formats: JPG, PNG, WEBP
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!pattern && (
            <FabricDropzone
              onFilesAdded={handleFilesAdded}
              currentCount={fabrics.length}
              maxFiles={MAX_FABRICS}
            />
          )}

          {fabrics.length > 0 && !pattern && (
            <>
              <FabricPreviewGrid
                previews={previews}
                fabrics={fabrics}
                onRemove={removeFabric}
                onClearAll={clearAll}
              />
              <GenerateButton
                onClick={generatePattern}
                disabled={fabrics.length < MIN_FABRICS || generating}
                generating={generating}
                fabricCount={fabrics.length}
              />
            </>
          )}

          {pattern && (
            <PatternDisplay
              pattern={pattern}
              userTier={user.subscriptionTier}
              onStartOver={clearAll}
            />
          )}
        </div>
      </main>
    </div>
  );
}