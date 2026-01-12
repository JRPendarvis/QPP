import { useRouter } from 'next/navigation';

interface UsageData {
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
  daysUntilReset: number;
}

interface UsageStatsSectionProps {
  usage: UsageData;
  subscriptionTier: string;
}

export default function UsageStatsSection({ usage, subscriptionTier }: UsageStatsSectionProps) {
  const router = useRouter();

  const generationsPercent = usage.generations.limit > 0 
    ? (usage.generations.used / usage.generations.limit) * 100 
    : 0;
  const downloadsPercent = usage.downloads.limit > 0 
    ? (usage.downloads.used / usage.downloads.limit) * 100 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Usage This Month</h2>
        <span className="text-sm text-gray-500">
          Resets in {usage.daysUntilReset} {usage.daysUntilReset === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div className="space-y-6">
        {/* Pattern Generations */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Pattern Generations</span>
            <span className="text-sm text-gray-600">
              {usage.generations.used} / {usage.generations.limit} used
              {usage.generations.remaining > 0 && (
                <span className="text-green-600 ml-2">
                  ({usage.generations.remaining} remaining)
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                generationsPercent >= 90 ? 'bg-red-500' :
                generationsPercent >= 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(generationsPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* PDF Downloads */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">PDF Downloads</span>
            <span className="text-sm text-gray-600">
              {usage.downloads.used} / {usage.downloads.limit} used
              {usage.downloads.remaining > 0 && (
                <span className="text-green-600 ml-2">
                  ({usage.downloads.remaining} remaining)
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                downloadsPercent >= 90 ? 'bg-red-500' :
                downloadsPercent >= 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(downloadsPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        {subscriptionTier === 'free' && (
          <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: '#E6FFFA', borderColor: '#2C7A7B', borderWidth: '1px'}}>
            <p className="text-sm font-semibold mb-2" style={{color: '#1F2937'}}>
              ⭐ Free Tier Limits
            </p>
            <p className="text-sm mb-3" style={{color: '#4B5563'}}>
              • 3 pattern generations per month (resets monthly)<br />
              • 1 PDF download lifetime (never resets)<br />
              Upgrade for more!
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="text-sm px-4 py-2 text-white rounded-md"
              style={{backgroundColor: '#2C7A7B'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#236B6C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C7A7B'}
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
