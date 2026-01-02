'use client';

export interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  generating: boolean;
  fabricCount: number;
}

export default function GenerateButton({
  onClick,
  disabled,
  generating,
  fabricCount,
}: GenerateButtonProps) {
  return (
    <div className="mt-8 mb-8 flex justify-center w-full">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg transition-all"
      >
        {generating ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating Pattern...
          </span>
        ) : (
          `Generate Pattern (${fabricCount} fabrics)`
        )}
      </button>
    </div>
  );
}