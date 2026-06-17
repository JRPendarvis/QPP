'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import PatternVisualization from './PatternVisualization';
import PatternMetadata from './PatternMetadata';
import PatternInstructions from './PatternInstructions';
import DownloadSection from './DownloadSection';
import ErrorStates from './ErrorStates';

interface SavedFabricOption {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface QuiltPattern {
  id?: string;
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
  fabricRequirements?: Array<{
    role: string;
    yards: number;
    description: string;
    inches?: number;
  }>;
}

interface Usage {
  generations: {
    used: number;
    limit: number;
    remaining: number;
  };
  downloads: {
    used: number;
    limit: number;
    remaining: number;
  };
  resetDate?: string;
  daysUntilReset?: number;
}

interface PatternDisplayProps {
  pattern: QuiltPattern;
  userTier: string;
  usage?: Usage;
  fabrics: File[];
  previews: string[];
  fabricLabels?: string[];
  savedFabrics: SavedFabricOption[];
  liveUpdating?: boolean;
  liveUpdateError?: string | null;
  onReplaceFabric: (index: number, file: File) => void;
  onReplaceFabricWithSaved: (index: number, savedFabricId: string) => void;
  onRemoveFabric: (index: number) => void;
  onMoveFabric: (fromIdx: number, toIdx: number) => void;
  onStartOver: () => void;
}

export default function PatternDisplay({
  pattern,
  userTier,
  usage,
  fabrics,
  previews,
  fabricLabels,
  savedFabrics,
  liveUpdating = false,
  liveUpdateError = null,
  onReplaceFabric,
  onReplaceFabricWithSaved,
  onRemoveFabric,
  onMoveFabric,
  onStartOver,
}: PatternDisplayProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSavedByIndex, setSelectedSavedByIndex] = useState<Record<number, string>>({});

  const hasDownloadsRemaining = usage?.downloads?.remaining
    ? usage.downloads.remaining > 0
    : true;

  const handleDownload = async () => {
    if (!pattern.id) {
      setError('Cannot download: No pattern ID available');
      return;
    }

    if (!hasDownloadsRemaining) {
      router.push('/pricing');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to download patterns');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patterns/${pattern.id}/download`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pattern.patternName.replace(/\s+/g, '_')}_Pattern.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Refresh the page to update usage counts
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Your Custom Pattern is Ready!
        </h2>
        <p className="text-gray-600">
          Review your pattern below or download the complete PDF with full instructions
        </p>
      </div>

      {/* Error States */}
      <ErrorStates error={error} patternData={pattern} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Pattern Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{pattern.patternName}</h3>
          <PatternVisualization visualSvg={pattern.visualSvg} patternName={pattern.patternName} />
        </div>

        {/* Live Fabric Swap */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Live Fabric Swap</h3>
              <p className="text-sm text-gray-600 mt-1">
                Replace, remove, or reorder fabrics here. Your pattern updates automatically.
              </p>
            </div>
            {liveUpdating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                Updating pattern...
              </span>
            )}
          </div>

          {liveUpdateError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {liveUpdateError}
            </div>
          )}

          <div className="overflow-y-auto pr-1" style={{ maxHeight: '980px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previews.map((preview, index) => {
                const label = fabricLabels?.[index] || `Fabric ${index + 1}`;
                const isFirst = index === 0;
                const isLast = index === previews.length - 1;

                return (
                  <div key={`${preview}-${index}`} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 mb-2">{label}</p>
                    <div className="aspect-square rounded-md overflow-hidden border border-gray-200 mb-2">
                      <Image
                        src={preview}
                        alt={fabrics[index]?.name || `Fabric ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-3" title={fabrics[index]?.name || `Fabric ${index + 1}`}>
                      {fabrics[index]?.name || `Fabric ${index + 1}`}
                    </p>

                    <div className="space-y-2">
                      <label className="w-full inline-flex justify-center items-center px-3 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium cursor-pointer hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={liveUpdating}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              onReplaceFabric(index, file);
                            }
                            event.currentTarget.value = '';
                          }}
                        />
                      </label>

                      <div className="space-y-1">
                        <select
                          value={selectedSavedByIndex[index] || ''}
                          disabled={liveUpdating || savedFabrics.length === 0}
                          onChange={(event) => {
                            const selectedId = event.target.value;
                            setSelectedSavedByIndex((prev) => ({
                              ...prev,
                              [index]: selectedId,
                            }));
                          }}
                          className="w-full px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 disabled:bg-gray-100"
                        >
                          <option value="">Choose saved fabric</option>
                          {savedFabrics.map((savedFabric) => (
                            <option key={savedFabric.id} value={savedFabric.id}>
                              {savedFabric.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectedSaved = selectedSavedByIndex[index];
                            if (selectedSaved) {
                              onReplaceFabricWithSaved(index, selectedSaved);
                            }
                          }}
                          disabled={liveUpdating || !selectedSavedByIndex[index] || savedFabrics.length === 0}
                          className="w-full px-2 py-1 rounded border border-indigo-300 text-xs text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Use Saved
                        </button>
                        {savedFabrics.length === 0 && (
                          <p className="text-[11px] text-gray-500">No saved fabrics in library yet.</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => onMoveFabric(index, index - 1)}
                          disabled={liveUpdating || isFirst}
                          className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Left
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveFabric(index, index + 1)}
                          disabled={liveUpdating || isLast}
                          className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Right
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveFabric(index)}
                          disabled={liveUpdating || previews.length <= 1}
                          className="px-2 py-1 rounded border border-red-300 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Metadata */}
      <PatternMetadata
        difficulty={pattern.difficulty}
        estimatedSize={pattern.estimatedSize}
        description={pattern.description}
        fabricLayout={pattern.fabricLayout}
      />

      {/* Fabric Requirements */}
      {pattern.fabricRequirements && pattern.fabricRequirements.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🧵 Fabric Requirements</h3>
          <p className="text-sm text-gray-600 mb-4">
            Fabric amounts based on 42" usable width with 15% extra for seam allowances
          </p>
          <div className="space-y-3">
            {pattern.fabricRequirements.map((req, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{req.role}:</span>
                  <span className="text-gray-600 ml-2 text-sm">{req.description}</span>
                </div>
                <span className="font-bold text-indigo-600 ml-4 whitespace-nowrap">
                  {req.inches ? `${req.inches}"` : `${req.yards} yards`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              💡 <strong>Shopping Tip:</strong> These amounts include extra fabric for mistakes and seam allowances. 
              Always verify fabric availability before cutting!
            </p>
          </div>
        </div>
      )}

      {/* Pattern Instructions */}
      <PatternInstructions
        instructions={pattern.instructions}
        onDownload={handleDownload}
        downloading={downloading}
        patternId={pattern.id}
      />

      {/* Download Section */}
      <DownloadSection
        onDownload={handleDownload}
        downloading={downloading}
        patternId={pattern.id}
        userTier={userTier}
        downloadsRemaining={usage?.downloads?.remaining}
      />

      {/* Start Over Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartOver}
          className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
        >
          ← Start Over (Create New Pattern)
        </button>
      </div>
    </div>
  );
}
