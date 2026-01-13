interface BillingToggleProps {
  billingInterval: 'monthly' | 'yearly';
  onChange: (interval: 'monthly' | 'yearly') => void;
}

/**
 * Billing interval toggle component
 * Single Responsibility: Render billing toggle UI
 */
export default function BillingToggle({ billingInterval, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8 mt-8">
      <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
        Monthly
      </span>
      <button
        onClick={() => onChange(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        style={{backgroundColor: '#5B8C85'}}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${billingInterval === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
        Yearly
        <span className="ml-1 text-xs font-normal" style={{color: '#D4A574'}}>Save up to 21%</span>
      </span>
    </div>
  );
}
