'use client';

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { usePatternLibrary } from '@/hooks/usePatternLibrary';
import PatternCard from '@/components/library/PatternCard';
import EmptyLibrary from '@/components/library/EmptyLibrary';
import LoadingState from '@/components/library/LoadingState';

/**
 * Pattern Library Page
 * Single Responsibility: Page layout and composition
 * Open/Closed: Open for extension via composition
 */
export default function PatternLibraryPage() {
  const { patterns, loading, error, fetchPatterns, downloadPattern, deletePattern, renamePattern } =
    usePatternLibrary();

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  if (loading) {
    return (
      <>
        <Navigation />
        <LoadingState />
      </>
    );
  }

  return (
    <>
      <Navigation />

      {/* Header Banner */}
      <div className="py-8 px-4" style={{ backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Pattern Library</h1>
          <p className="text-white opacity-90">
            Your downloaded quilt patterns are saved here for easy re-download
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {patterns.length === 0 ? (
            <EmptyLibrary />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.map((pattern) => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  onDownload={downloadPattern}
                  onDelete={deletePattern}
                  onRename={renamePattern}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
