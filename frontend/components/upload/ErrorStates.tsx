interface ErrorStatesProps {
  error?: string | null;
  patternData?: any;
}

export default function ErrorStates({ error, patternData }: ErrorStatesProps) {
  // Generation failed error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg
          className="w-16 h-16 mx-auto text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Generation Failed</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Incomplete pattern data warning
  if (
    patternData &&
    (!patternData.instructions || !Array.isArray(patternData.instructions) || patternData.instructions.length === 0)
  ) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-700">
          ⚠️ Pattern generated, but instructions are missing or incomplete
        </p>
      </div>
    );
  }

  return null;
}
