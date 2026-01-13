interface DownloadSectionProps {
  onDownload: () => void;
  downloading: boolean;
  patternId?: string;
  userTier?: string;
  downloadsRemaining?: number;
}

export default function DownloadSection({
  onDownload,
  downloading,
  patternId,
  userTier,
  downloadsRemaining,
}: DownloadSectionProps) {
  // Don't show download button if no downloads remaining
  const canDownload = downloadsRemaining === undefined || downloadsRemaining > 0;

  if (!patternId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-700">⚠️ Cannot download: No pattern ID available</p>
      </div>
    );
  }

  if (!canDownload) {
    return (
      <div className="bg-linear-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Downloads Remaining</h3>
        <p className="text-gray-600 mb-4">
          {userTier === 'free'
            ? "You've used all your free downloads this month."
            : userTier === 'basic'
            ? 'You have reached the download limit for your Basic plan this month.'
            : userTier === 'intermediate'
            ? 'You have reached the download limit for your Intermediate plan this month.'
            : 'You have reached the download limit for your plan this month.'}
        </p>
        <a
          href="/pricing"
          className="inline-block bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Upgrade Your Plan
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onDownload}
        disabled={downloading || !patternId}
        className="bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        {downloading ? (
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
            Downloading PDF...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Complete Pattern PDF
          </span>
        )}
      </button>
    </div>
  );
}
