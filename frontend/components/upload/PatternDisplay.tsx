 'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import DOMPurify from 'dompurify';

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

  // Check if user has downloads remaining
  const hasDownloadsRemaining = usage?.downloads?.remaining ? usage.downloads.remaining > 0 : false;

  // Restore DOMPurify for SVG sanitization
  const sanitizedSvg = useMemo(() => {
    if (!pattern?.visualSvg) return '';
    return DOMPurify.sanitize(pattern.visualSvg, { USE_PROFILES: { svg: true } });
  }, [pattern?.visualSvg]);

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
      alert('Pattern ID not found. Please regenerate the pattern.');
      return;
    }

    setDownloading(true);

    try {
      // Use cookie-based auth; server uses httpOnly cookie set at login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patterns/${pattern.id}/download`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to download PDF');
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

      // Show success message and refresh page
      alert('PDF downloaded successfully! ✅ Refreshing...');
      window.location.reload();

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
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

      {/* Pattern Visualization */}
      {pattern.visualSvg && pattern.visualSvg.includes('svg') ? (
        <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
          <div
            className="max-w-md w-full"
            dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
          />
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-4">
        {pattern.difficulty && (
          <div>
            <h3 className="font-semibold text-gray-700">Difficulty</h3>
            <p className="text-gray-900">{pattern.difficulty}</p>
          </div>
        )}
        {pattern.estimatedSize && (
          <div>
            <h3 className="font-semibold text-gray-700">Estimated Size</h3>
            <p className="text-gray-900">{pattern.estimatedSize}</p>
          </div>
        )}
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
        
        {/* Disclaimer if present as first instruction - shown ABOVE heading */}
        {pattern.instructions[0]?.startsWith('📋 IMPORTANT:') && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg relative z-10">
            <p className="text-sm text-blue-900">{pattern.instructions[0]}</p>
          </div>
        )}
        
        <h3 className="font-semibold text-gray-700 mb-2">Step-by-Step Instructions</h3>
        

        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {pattern.instructions
            .slice(pattern.instructions[0]?.startsWith('📋 IMPORTANT:') ? 1 : 0)
            .map((instruction, index) => (
              <li key={index}>{instruction.replace(/^[0-9]+[).]\s*/, '')}</li>
            ))}
        </ol>
        
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded relative z-10">
          <p className="text-sm text-indigo-900 font-semibold mb-2">
            🔒 Unlock Full Instructions
          </p>
          <p className="text-sm text-indigo-700 mb-3">
            Upgrade to see all {instructionsCount} detailed steps in the PDF.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Plans
          </button>
        </div>
      </div>

      {/* Download Section */}
      <div className="space-y-4">
        {hasDownloadsRemaining ? (
          <>
            {/* Download Button */}
            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                disabled={downloading || !pattern.id}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>

            {/* Show remaining downloads */}
            {usage?.downloads && (
              <div className="text-sm text-gray-600 text-center">
                <span>
                  {usage.downloads.remaining} download{usage.downloads.remaining !== 1 ? 's' : ''} remaining
                  {userTier !== 'free' && usage.daysUntilReset && (
                    <span> (resets in {usage.daysUntilReset} days)</span>
                  )}
                </span>
              </div>
            )}

            {/* Info for free users with downloads remaining */}
            {userTier === 'free' && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-900 font-semibold mb-2">
                  ⭐ Free Tier: 1 Download Lifetime
                </p>
                <p className="text-sm text-indigo-700 mb-3">
                  This is your only download. Upgrade to Basic for 2 downloads per month, or higher tiers for more!
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View Plans
                </button>
              </div>
            )}
          </>
        ) : (
          /* No downloads remaining */
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-2">
              📄 No Downloads Remaining
            </h3>
            <p className="text-red-800 mb-4">
              {userTier === 'free' 
                ? "You've used your lifetime download. Upgrade to get more downloads!"
                : `You've reached your monthly download limit. ${usage?.daysUntilReset ? `Resets in ${usage.daysUntilReset} days, or upgrade for more downloads!` : 'Upgrade for more downloads!'}`
              }
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
            >
              View Plans
            </button>
          </div>
        )}
      </div>

      {/* No pattern ID warning */}
      {!pattern.id && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            ⚠️ Pattern ID not found. Please regenerate the pattern to enable downloads.
          </p>
        </div>
      )}
    </div>
  );
}