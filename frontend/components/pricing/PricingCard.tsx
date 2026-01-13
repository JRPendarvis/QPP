import type { PricingTier } from '../../app/pricing/pricingData';

interface PricingCardProps {
  tier: PricingTier;
  billingInterval: 'monthly' | 'yearly';
  isLoading: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (tierId: string | null) => void;
  onButtonClick: (action: 'register' | 'subscribe', tierId: string) => void;
}

/**
 * Individual pricing tier card component
 * Single Responsibility: Render single pricing card with hover states
 */
export default function PricingCard({
  tier,
  billingInterval,
  isLoading,
  isSelected,
  isHovered,
  onHover,
  onButtonClick
}: PricingCardProps) {
  const getBadgeText = () => {
    if (tier.popular && !isHovered) return 'Most Popular';
    if (!isHovered) return null;
    
    const badges: Record<string, string> = {
      free: 'Just Looking',
      basic: 'Just Starting',
      intermediate: 'Most Popular',
      advanced: 'All In'
    };
    return badges[tier.id] || null;
  };

  const badgeText = getBadgeText();

  const getButtonClass = () => {
    if (isSelected) return 'bg-indigo-600 text-white';
    if (isHovered) return 'bg-indigo-600 text-white';
    if (tier.popular) return 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400';
    return 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-300';
  };

  const monthlyPrice = billingInterval === 'monthly' 
    ? tier.price.monthly 
    : (tier.price.annual / 12).toFixed(2);

  const savings = ((tier.price.monthly * 12) - tier.price.annual).toFixed(2);

  return (
    <div
      onMouseEnter={() => onHover(tier.id)}
      onMouseLeave={() => onHover(null)}
      className={`bg-white rounded-lg shadow-md p-6 relative transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
        tier.popular && !isSelected && !isHovered ? 'ring-2 ring-indigo-500' : ''
      } ${
        isSelected ? 'ring-2 ring-indigo-600 shadow-xl -translate-y-1' : ''
      } ${
        isHovered ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      {badgeText && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {badgeText}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>

        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl font-bold text-gray-900">
              ${monthlyPrice}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          {billingInterval === 'yearly' && tier.price.annual > 0 && (
            <div className="text-sm text-gray-600">
              ${tier.price.annual}/year (save ~${savings})
            </div>
          )}
          {billingInterval === 'monthly' && tier.price.annual > 0 && (
            <div className="text-sm text-gray-600">
              or ${tier.price.annual}/year (save ~${savings})
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {tier.patterns}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onButtonClick(tier.buttonAction, tier.id)}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-md font-medium transition ${getButtonClass()}`}
      >
        {isLoading ? 'Processing...' : tier.buttonText}
      </button>
    </div>
  );
}
