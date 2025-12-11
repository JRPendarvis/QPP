'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const pricingTiers = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    patterns: '1 lifetime',
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
    price: { monthly: 5.99, annual: 59.99 },
    patterns: '2 per month',
    features: [
      'Skill level matching',
      'Advanced patterns',
      'Priority email support',
      'Pattern customization'
    ],
    popular: false,
    buttonText: 'Start Free Trial',
    buttonAction: 'upgrade'
  },
  {
    name: 'Enthusiast',
    price: { monthly: 9.99, annual: 94.99 },
    patterns: '10 per month',
    features: [
      'All Hobbyist features',
      'Expert-level patterns',
      'Priority support',
      'Advanced customization',
      'PDF downloads'
    ],
    popular: true,
    buttonText: 'Start Free Trial',
    buttonAction: 'upgrade'
  },
  {
    name: 'Pro',
    price: { monthly: 19.99, annual: 199.99 },
    patterns: '25 patterns',
    features: [
      'Everything included',
      'Commercial use rights',
      'API access (coming soon)',
      'White-label options',
      'Dedicated support'
    ],
    popular: false,
    buttonText: 'Start Free Trial',
    buttonAction: 'upgrade'
  }
];

export default function PricingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Allow non-authenticated users to view pricing
    }
  }, [user, loading]);

  const handleButtonClick = (action: string) => {
    if (action === 'register') {
      router.push('/register');
    } else if (action === 'upgrade') {
      if (user) {
        router.push('/profile'); // Could be a billing/profile page
      } else {
        router.push('/register');
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">QuiltPlannerPro</h1>
          <div className="flex gap-2">
            {user ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/upload')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Start Designing
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with our free tier or upgrade to unlock more patterns, advanced features, and priority support.
            All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg shadow-md p-6 relative ${
                tier.popular ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>

                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${tier.price.monthly}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    or ${tier.price.annual}/year (save ~${((tier.price.monthly * 12) - tier.price.annual).toFixed(2)})
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  {tier.patterns} patterns
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleButtonClick(tier.buttonAction)}
                className={`w-full py-3 px-4 rounded-md font-medium transition ${
                  tier.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.buttonText}
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