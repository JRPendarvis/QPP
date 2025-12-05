'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface QuiltPattern {
  id?: string; // Pattern ID from database
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
}

interface PatternDisplayProps {
  pattern: QuiltPattern;
  userTier: string;
  onStartOver: () => void;
}

export default function PatternDisplay({
  pattern,
  userTier,
  onStartOver,
}: PatternDisplayProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Validate pattern data
  const hasName = pattern && pattern.patternName;
  const hasInstructions = pattern && pattern.instructions && Array.isArray(pattern.instructions) && pattern.instructions.length > 0;
  const instructionsCount = hasInstructions ? pattern.instructions.length : 0;

  if (!hasName) {
    return (
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">Pattern Generation Failed</p>
        <p className="text-red-500 mb-4">No pattern data received.</p>
        <button
          onClick={onStartOver}
          className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!hasInstructions || instructionsCount < 3) {
    return (
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-semibold mb-2">Pattern Data Incomplete</p>
        <p className="text-yellow-700 mb-4">
          Pattern name: {pattern.patternName || 'Unknown'}<br />
          Instructions received: {instructionsCount}<br />
          This pattern needs at least 3 instructions to display.
        </p>
        <button
          onClick={onStartOver}
          className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Generate Again
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!pattern.id) {
      setDownloadError('Pattern ID not found. Please regenerate the pattern.');
      return;
    }

    setDownloading(true);
    setDownloadError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patterns/${pattern.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setDownloadError(error.message || 'Failed to download PDF');
        return;
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pattern.patternName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      alert('PDF downloaded successfully! ✅');

    } catch (error) {
      console.error('Download error:', error);
      setDownloadError('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {pattern.patternName}
        </h2>
        <button
          onClick={onStartOver}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Start Over
        </button>
      </div>

      {/* SVG Visualization */}
      {pattern.visualSvg && pattern.visualSvg.includes('svg') && (
        <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
          <div 
            className="max-w-md w-full"
            dangerouslySetInnerHTML={{ __html: pattern.visualSvg }}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-700">Difficulty</h3>
          <p className="text-gray-900">{pattern.difficulty || 'Not specified'}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Estimated Size</h3>
          <p className="text-gray-900">{pattern.estimatedSize || 'Not specified'}</p>
        </div>
      </div>

      {pattern.description && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-900">{pattern.description}</p>
        </div>
      )}

      {pattern.fabricLayout && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Fabric Layout</h3>
          <p className="text-gray-900">{pattern.fabricLayout}</p>
        </div>
      )}

      {/* Preview of Instructions */}
      <div className="bg-gradient-to-b from-white to-gray-100 border border-gray-200 rounded-lg p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none rounded-lg"></div>
        <h3 className="font-semibold text-gray-700 mb-2">Step-by-Step Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {pattern.instructions.slice(0, Math.min(2, instructionsCount)).map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
          {instructionsCount > 2 && (
            <li className="text-gray-400 italic">+ {instructionsCount - 2} more steps...</li>
          )}
        </ol>
        
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded relative z-10">
          <p className="text-sm text-indigo-900 font-semibold mb-2">
            🔒 Unlock Full Instructions
          </p>
          <p className="text-sm text-indigo-700 mb-3">
            Upgrade to see all {instructionsCount} detailed steps and download the PDF guide.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Plans
          </button>
        </div>
      </div>

      {/* Download Error Message */}
      {downloadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{downloadError}</p>
        </div>
      )}

      {/* Download Button - Shows up-selling for free users */}
      {userTier === 'free' ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">
            📄 PDF Download Available with Upgrade
          </h3>
          <p className="text-yellow-800 mb-4">
            Get the complete pattern with measurements, cutting guides, and full step-by-step instructions in a beautifully formatted PDF.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700"
          >
            Upgrade to Download
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading || !pattern.id}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      )}

      {/* No pattern ID warning */}
      {!pattern.id && userTier !== 'free' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            ⚠️ Pattern ID not found. Please regenerate the pattern to enable downloads.
          </p>
        </div>
      )}
    </div>
  );
}