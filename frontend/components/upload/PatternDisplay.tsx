'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PatternVisualization from './PatternVisualization';
import PatternMetadata from './PatternMetadata';
import PatternInstructions from './PatternInstructions';
import DownloadSection from './DownloadSection';
import ErrorStates from './ErrorStates';

interface QuiltPattern {
  id?: string;
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
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
  onStartOver: () => void;
}

export default function PatternDisplay({
  pattern,
  userTier,
  usage,
  onStartOver,
}: PatternDisplayProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      {/* Pattern Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{pattern.patternName}</h3>
        <PatternVisualization visualSvg={pattern.visualSvg} patternName={pattern.patternName} />
      </div>

      {/* Pattern Metadata */}
      <PatternMetadata
        difficulty={pattern.difficulty}
        estimatedSize={pattern.estimatedSize}
        description={pattern.description}
        fabricLayout={pattern.fabricLayout}
      />

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
