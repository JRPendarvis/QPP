import Link from 'next/link';
import { fabricHoldAddonOptions } from '@/app/pricing/pricingData';
import { formatAddonPrice, FabricHoldTierType } from '@/utils/fabricHoldFormatting';

interface FabricHoldSectionProps {
  subscriptionTier: string;
  billingInterval: 'monthly' | 'yearly';
  badge: string | null;
  currentTier: FabricHoldTierType;
  currentLimit: number;
  loading: boolean;
  onSelectTier: (tier: FabricHoldTierType) => void;
}

export default function FabricHoldSection({
  subscriptionTier,
  billingInterval,
  badge,
  currentTier,
  currentLimit,
  loading,
  onSelectTier,
}: FabricHoldSectionProps) {
  if (badge === 'founder') {
    return (
      <section className="bg-white rounded-lg shadow p-6 space-y-3">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Fabric Image Tracking</h2>
          <p className="mt-1 text-sm text-gray-600">
            Your founder badge keeps 50 saved fabric images active on your account automatically.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Founder benefit active: 50 image slots.
        </div>
      </section>
    );
  }

  if (subscriptionTier === 'free') {
    return (
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Fabric Image Tracking</h2>
          <p className="mt-1 text-sm text-gray-600">
            Saved fabric images are managed with a separate add-on on paid plans.
          </p>
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: '#B91C1C' }}
        >
          Upgrade to Enable Image Saving
        </Link>
      </section>
    );
  }

  const selectableOptions = fabricHoldAddonOptions.filter((option) => option.id !== 'none');

  return (
    <section className="bg-white rounded-lg shadow p-6 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Fabric Image Tracking</h2>
          <p className="mt-1 text-sm text-gray-600">
            Update how many saved fabric images you want to keep with your {billingInterval} subscription.
          </p>
        </div>

        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          Current limit: <span className="font-semibold">{currentLimit} images</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {selectableOptions.map((option) => {
          const isCurrent = option.id === currentTier;

          return (
            <button
              key={option.id}
              type="button"
              disabled={loading || isCurrent}
              onClick={() => onSelectTier(option.id)}
              className="rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                borderColor: isCurrent ? '#B91C1C' : '#D1D5DB',
                backgroundColor: isCurrent ? '#FEF2F2' : '#FFFFFF',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{option.images}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">saved images</p>
                </div>
                {isCurrent && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                    Current
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {formatAddonPrice(option.price[billingInterval === 'yearly' ? 'annual' : 'monthly'], billingInterval)}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        You can change this add-on anytime. Free selections update immediately, and paid upgrades open Stripe checkout and apply after payment completes.
      </p>
    </section>
  );
}