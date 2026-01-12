import { useRouter } from 'next/navigation';

interface TierInfo {
  name: string;
  price: number;
}

interface AccountInfoSectionProps {
  email: string;
  name: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  billingInterval?: string;
  tierInfo: TierInfo;
  canceling: boolean;
  onNameChange: (name: string) => void;
  onCancelSubscription: () => void;
}

export default function AccountInfoSection({
  email,
  name,
  subscriptionTier,
  subscriptionStatus,
  billingInterval,
  tierInfo,
  canceling,
  onNameChange,
  onCancelSubscription,
}: AccountInfoSectionProps) {
  const router = useRouter();

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-gray-900">{email}</p>
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
            onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subscription Tier</label>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-gray-900 capitalize font-medium">
              {tierInfo.name}
              {tierInfo.price > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (${tierInfo.price}/{billingInterval || 'month'})
                </span>
              )}
            </p>
            {subscriptionTier !== 'free' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/pricing')}
                  className="text-sm hover:underline"
                  style={{color: '#2C7A7B'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#236B6C'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2C7A7B'}
                >
                  Manage Subscription
                </button>
                {subscriptionStatus !== 'cancel_at_period_end' && (
                  <button
                    type="button"
                    onClick={onCancelSubscription}
                    disabled={canceling}
                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {canceling ? 'Canceling...' : 'Cancel'}
                  </button>
                )}
                {subscriptionStatus === 'cancel_at_period_end' && (
                  <span className="text-sm text-red-600">
                    Canceling at period end
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
