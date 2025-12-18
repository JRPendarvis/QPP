'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

const pricingTiers = [
  {
    name: 'Free',
    id: 'free',
    price: { monthly: 0, annual: 0 },
    patterns: '1 lifetime pattern',
    features: [
      'Basic pattern generation',
      'Standard patterns only',
      'Community support'
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonAction: 'register'
  },
  {
    name: 'Hobbyist',
    id: 'basic',
    price: { monthly: 5.99, annual: 59.99 },
    patterns: '5 per month',
    features: [
      'Skill level matching',
      'Advanced patterns',
      'Priority email support'
    ],
    popular: false,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  },
  {
    name: 'Enthusiast',
    id: 'intermediate',
    price: { monthly: 9.99, annual: 94.99 },
    patterns: '15 per month',
    features: [
      'All Hobbyist features',
      'Expert-level patterns',
      'Priority support',
      'Advanced customization',
      'PDF downloads'
    ],
    popular: true,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  },
  {
    name: 'Pro',
    id: 'advanced',
    price: { monthly: 19.99, annual: 199.99 },
    patterns: '50 per month',
    features: [
      'Everything included',
      'Commercial use rights',
      'API access (coming soon)',
      'Dedicated support'
    ],
    popular: false,
    buttonText: 'Choose Plan',
    buttonAction: 'subscribe'
  }
];

export default function PricingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      // Allow non-authenticated users to view pricing
    }
  }, [user, loading]);

  const handleButtonClick = async (action: string, tierId: string) => {
    if (action === 'register') {
      router.push('/register');
      return;
    }
    
    // Set selected tier
    setSelectedTier(tierId);
    
    if (!user) {
      router.push('/register');
      return;
    }

    setLoadingTier(tierId);
    try {
      const response = await api.post('/api/stripe/create-checkout-session', {
        tier: tierId,
        interval: billingInterval
      });

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process');
    } finally {
      setLoadingTier(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F9FAFB'}}>
      <Navigation />

      {/* Header Banner */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-xl max-w-3xl mx-auto mb-4" style={{color: '#1F2937'}}>
            Start with our free tier and upgrade anytime to unlock more patterns, advanced features, and priority support.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8 mt-8">
            <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
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
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`bg-white rounded-lg shadow-md p-6 relative transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                tier.popular && selectedTier !== tier.id && !hoveredTier ? 'ring-2 ring-indigo-500' : ''
              } ${
                selectedTier === tier.id ? 'ring-2 ring-indigo-600 shadow-xl -translate-y-1' : ''
              } ${
                hoveredTier === tier.id ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {tier.popular && (hoveredTier === tier.id || !hoveredTier) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              {tier.id === 'free' && hoveredTier === 'free' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Just Looking
                  </span>
                </div>
              )}
              {tier.id === 'basic' && hoveredTier === 'basic' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Just Starting
                  </span>
                </div>
              )}
              {tier.id === 'advanced' && hoveredTier === 'advanced' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    All In
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>

                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${billingInterval === 'monthly' ? tier.price.monthly : (tier.price.annual / 12).toFixed(2)}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  {billingInterval === 'yearly' && tier.price.annual > 0 && (
                    <div className="text-sm text-gray-600">
                      ${tier.price.annual}/year (save ~${((tier.price.monthly * 12) - tier.price.annual).toFixed(2)})
                    </div>
                  )}
                  {billingInterval === 'monthly' && tier.price.annual > 0 && (
                    <div className="text-sm text-gray-600">
                      or ${tier.price.annual}/year (save ~${((tier.price.monthly * 12) - tier.price.annual).toFixed(2)})
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
                onClick={() => handleButtonClick(tier.buttonAction, tier.id)}
                disabled={loadingTier === tier.id}
                className={`w-full py-3 px-4 rounded-md font-medium transition ${
                  selectedTier === tier.id
                    ? 'bg-indigo-600 text-white'
                    : hoveredTier === tier.id
                      ? 'bg-indigo-600 text-white'
                      : hoveredTier && hoveredTier !== tier.id
                        ? 'bg-gray-100 text-gray-900'
                        : tier.popular
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-300'
                }`}
              >
                {loadingTier === tier.id ? 'Processing...' : tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my patterns when I cancel?
              </h3>
              <p className="text-gray-600">
                Your downloaded patterns remain yours forever. You just lose access to generating new ones.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer refunds within 30 days of purchase on a case-by-case basis. Contact support for assistance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans include a 14-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
