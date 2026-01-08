'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
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

function flattenNestedSvg(rawSvg: string): string {
  // Remove nested <svg ...> wrappers but keep their contents.
  // This specifically addresses patterns where blocks are wrapped like:
  // <g ...><svg ...> ... </svg></g>
  // We convert it to:
  // <g ...> ... </g>
  return rawSvg
    .replace(/<svg\b[^>]*>/gi, '')   // remove opening <svg ...>
    .replace(/<\/svg>/gi, '');       // remove closing </svg>
}

export default function PatternDisplay({
  pattern,
  userTier,
  usage,
  onStartOver,
}: PatternDisplayProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const hasDownloadsRemaining = usage?.downloads?.remaining
    ? usage.downloads.remaining > 0
    : false;

  const sanitizedSvg = useMemo(() => {
    const raw = pattern?.visualSvg?.trim();
    if (!raw) return '';

    // Flatten nested SVGs (fixes blank preview in many browsers)
    const flattened = flattenNestedSvg(raw);

    // Ensure outer svg has explicit sizing (important in injected HTML)
    let ensured = flattened;
    if (ensured.startsWith('<svg')) {
      // Inject style/width/height if missing (safe-ish string patch)
      ensured = ensured.replace(
        /<svg\b([^>]*)>/i,
        (match, attrs) => {
          const hasWidth = /\bwidth\s*=/.test(attrs);
          const hasHeight = /\bheight\s*=/.test(attrs);
          const hasStyle = /\bstyle\s*=/.test(attrs);

          const addWidth = hasWidth ? '' : ' width="100%"';
          const addHeight = hasHeight ? '' : ' height="100%"';
          const addStyle = hasStyle ? '' : ' style="display:block"';

          return `<svg${attrs}${addWidth}${addHeight}${addStyle}>`;
        }
      );
    } else {
      // If somehow not an svg root, wrap it
      ensured = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%" style="display:block">${flattened}</svg>`;
    }

    return DOMPurify.sanitize(ensured, {
      USE_PROFILES: { svg: true },
      ADD_TAGS: [
        'filter', 'feGaussianBlur', 'feOffset', 'feComponentTransfer', 'feFuncA', 'feMerge', 'feMergeNode',
        'pattern', 'circle'
      ],
      ADD_ATTR: [
        'stdDeviation', 'dx', 'dy', 'slope', 'in', 'result', 'type', 'id', 'patternUnits',
        'x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'opacity', 'filter', 'fill', 'viewBox'
      ],
    });
  }, [pattern?.visualSvg]);

  // Debug: Log SVGs for troubleshooting
  useEffect(() => {
    // Only log if pattern exists
    if (pattern?.visualSvg) {
      console.log('Raw SVG:', pattern.visualSvg);
      console.log('Sanitized SVG:', sanitizedSvg);
    }
  }, [pattern?.visualSvg, sanitizedSvg]);

  const hasName = Boolean(pattern?.patternName);
  const hasInstructions =
    Boolean(pattern?.instructions) &&
    Array.isArray(pattern.instructions) &&
    pattern.instructions.length > 0;
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
          Pattern name: {pattern.patternName || 'Unknown'}
          <br />
          Instructions received: {instructionsCount}
          <br />
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
      const token = localStorage.getItem('token'); // Or use your AUTH_CONSTANTS.TOKEN_KEY
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patterns/${pattern.id}/download`,
        {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to download PDF');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pattern.patternName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

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
        <h2 className="text-2xl font-bold text-gray-900">{pattern.patternName}</h2>
        <button
          onClick={onStartOver}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Start Over
        </button>
      </div>

      {/* Pattern Visualization */}
      <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
        <div className="w-full max-w-md aspect-3/4 border border-gray-200 rounded bg-white overflow-hidden">
          {sanitizedSvg ? (
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-red-500">
              SVG preview unavailable (empty or invalid).
            </div>
          )}
        </div>
      </div>

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

      {/* Instructions */}
      <div className="bg-linear-to-b from-white to-gray-100 border border-gray-200 rounded-lg p-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white pointer-events-none rounded-lg"></div>

        {/* DEBUG: Show all cleaned instructions */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg relative z-10">
          <h3 className="font-bold text-yellow-900 mb-2">🔍 DEBUG: PDF Instructions Preview</h3>
          <p className="text-xs text-yellow-700 mb-3">This shows exactly how instructions will appear in the PDF (with numbering):</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-900">
            {pattern.instructions.map((instruction, index) => {
              const cleanInstruction = instruction.replace(/^\d+[).]\s*/, '');
              const isDisclaimer = instruction.startsWith('IMPORTANT:');
              if (isDisclaimer) {
                return (
                  <div key={index} className="p-2 bg-blue-100 rounded mb-2 -ml-6">
                    <span className="font-semibold">📋 {cleanInstruction}</span>
                  </div>
                );
              }
              return <li key={index} className="ml-4">{cleanInstruction}</li>;
            })}
          </ol>
        </div>

        {pattern.instructions[0]?.startsWith('IMPORTANT:') && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg relative z-10">
            <p className="text-sm text-blue-900">📋 {pattern.instructions[0]}</p>
          </div>
        )}

        <h3 className="font-semibold text-gray-700 mb-2">Step-by-Step Instructions</h3>

        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {(() => {
            const important = pattern.instructions[0]?.startsWith('IMPORTANT:');
            const visibleInstructions = pattern.instructions.slice(important ? 1 : 0).slice(0, 2);
            return visibleInstructions.map((instruction, index) => (
              <li key={index}>{instruction.replace(/^\d+[).)]\s*/, '')}</li>
            ));
          })()}
        </ol>

        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded relative z-10">
          <p className="text-sm text-indigo-900 font-semibold mb-2">🔒 Unlock Full Instructions</p>
          <p className="text-sm text-indigo-700 mb-3">
            Only the first 2 steps are shown. Download the PDF to see all {instructionsCount} detailed steps.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              disabled={downloading || !pattern.id}
              className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="space-y-4">
        {!hasDownloadsRemaining && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-2">📄 No Downloads Remaining</h3>
            <p className="text-red-800 mb-4">
              {userTier === 'free'
                ? "You've used your lifetime download. Upgrade to get more downloads!"
                : `You've reached your monthly download limit. ${
                    usage?.daysUntilReset
                      ? `Resets in ${usage.daysUntilReset} days, or upgrade for more downloads!`
                      : 'Upgrade for more downloads!'
                  }`}
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
