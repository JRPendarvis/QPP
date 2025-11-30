'use client';

import { useRouter } from 'next/navigation';

interface QuiltPattern {
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
      <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
        <div 
          className="max-w-md w-full"
          dangerouslySetInnerHTML={{ __html: pattern.visualSvg }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-700">Difficulty</h3>
          <p className="text-gray-900">{pattern.difficulty}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">Estimated Size</h3>
          <p className="text-gray-900">{pattern.estimatedSize}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
        <p className="text-gray-900">{pattern.description}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Fabric Layout</h3>
        <p className="text-gray-900">{pattern.fabricLayout}</p>
      </div>

      {/* Preview of Instructions - Free Tier */}
      <div className="bg-linear-to-b from-white to-gray-100 border border-gray-200 rounded-lg p-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white pointer-events-none rounded-lg"></div>
        <h3 className="font-semibold text-gray-700 mb-2">Step-by-Step Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {pattern.instructions.slice(0, 2).map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
          <li className="text-gray-400 italic">+ {pattern.instructions.length - 2} more steps...</li>
        </ol>
        
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded relative z-10">
          <p className="text-sm text-indigo-900 font-semibold mb-2">
            🔒 Unlock Full Instructions
          </p>
          <p className="text-sm text-indigo-700 mb-3">
            Upgrade to see all {pattern.instructions.length} detailed steps and download the PDF guide.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Plans
          </button>
        </div>
      </div>

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
            onClick={() => {
              // TODO: Generate and download PDF
              alert('PDF download coming next!');
            }}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}