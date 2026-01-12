interface PatternInstructionsProps {
  instructions: string[];
  onDownload: () => void;
  downloading: boolean;
  patternId?: string;
}

function cleanInstruction(instruction: string): string {
  return instruction.replace(/^\d+[).]\s*/, '');
}

export default function PatternInstructions({
  instructions,
  onDownload,
  downloading,
  patternId,
}: PatternInstructionsProps) {
  const hasInstructions = Array.isArray(instructions) && instructions.length > 0;
  
  if (!hasInstructions) {
    return null;
  }

  const firstInstruction = instructions[0] || '';
  const isDisclaimer = firstInstruction.startsWith('IMPORTANT:');
  const visibleInstructions = instructions.slice(isDisclaimer ? 1 : 0).slice(0, 2);
  const totalCount = instructions.length;

  return (
    <div className="bg-linear-to-b from-white to-gray-100 border border-gray-200 rounded-lg p-6 relative">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white pointer-events-none rounded-lg"></div>

      {/* Debug view in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg relative z-10">
          <h3 className="font-bold text-yellow-900 mb-2">🔍 DEBUG: PDF Instructions Preview</h3>
          <p className="text-xs text-yellow-700 mb-3">
            This shows exactly how instructions will appear in the PDF (with numbering):
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-900">
            {instructions.map((instruction, index) => {
              const clean = cleanInstruction(instruction);
              const isDisclaimer = instruction.startsWith('IMPORTANT:');
              if (isDisclaimer) {
                return (
                  <div key={index} className="p-2 bg-blue-100 rounded mb-2 -ml-6">
                    <span className="font-semibold">📋 {clean}</span>
                  </div>
                );
              }
              return <li key={index} className="ml-4">{clean}</li>;
            })}
          </ol>
        </div>
      )}

      {/* Disclaimer */}
      {isDisclaimer && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg relative z-10">
          <p className="text-sm text-blue-900">📋 {firstInstruction}</p>
        </div>
      )}

      {/* Visible instructions preview */}
      <h3 className="font-semibold text-gray-700 mb-2">Step-by-Step Instructions</h3>

      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        {visibleInstructions.map((instruction, index) => (
          <li key={index}>{cleanInstruction(instruction)}</li>
        ))}
      </ol>

      {/* Download CTA */}
      <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded relative z-10">
        <p className="text-sm text-indigo-900 font-semibold mb-2">🔒 Unlock Full Instructions</p>
        <p className="text-sm text-indigo-700 mb-3">
          Only the first 2 steps are shown. Download the PDF to see all {totalCount} detailed steps.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onDownload}
            disabled={downloading || !patternId}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
