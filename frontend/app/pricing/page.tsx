'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { pricingTiers } from './pricingData';
import { useCheckout } from '@/hooks/useCheckout';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCard from '@/components/pricing/PricingCard';
import FAQSection from '@/components/pricing/FAQSection';

/**
 * Pricing page component
 * Single Responsibility: Orchestrate pricing page layout
 * Delegates checkout, card rendering, and FAQ to specialized components
 */
export default function PricingPage() {
  const { user, loading } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const { loadingTier, selectedTier, handleButtonClick } = useCheckout(user);

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
          <BillingToggle billingInterval={billingInterval} onChange={setBillingInterval} />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billingInterval={billingInterval}
              isLoading={loadingTier === tier.id}
              isSelected={selectedTier === tier.id}
              isHovered={hoveredTier === tier.id}
              onHover={setHoveredTier}
              onButtonClick={(action, tierId) => handleButtonClick(action, tierId, billingInterval)}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
}
