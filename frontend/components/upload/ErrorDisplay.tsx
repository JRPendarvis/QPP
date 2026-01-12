interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  const isSubscriptionError = error.startsWith('SUBSCRIPTION_ERROR:');

  return (
    <div className={`mb-6 px-4 py-3 rounded ${
      isSubscriptionError
        ? 'bg-amber-50 border border-amber-300 text-amber-800'
        : 'bg-red-50 border border-red-200 text-red-600'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {isSubscriptionError ? (
            <>
              <div className="font-semibold mb-1">⚠️ Subscription Limit Reached</div>
              <div className="text-sm">{error.replace('SUBSCRIPTION_ERROR: ', '')}</div>
              <div className="mt-3">
                <a 
                  href="/pricing" 
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded transition-colors"
                >
                  View Upgrade Options
                </a>
              </div>
            </>
          ) : (
            <div>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
