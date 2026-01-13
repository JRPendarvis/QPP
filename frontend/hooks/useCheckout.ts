import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
}

/**
 * Hook for handling checkout session creation
 * Single Responsibility: Checkout logic
 */
export function useCheckout(user: User | null) {
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleButtonClick = async (
    action: 'register' | 'subscribe',
    tierId: string,
    billingInterval: 'monthly' | 'yearly'
  ) => {
    if (action === 'register') {
      router.push('/register');
      return;
    }
    
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

  return {
    loadingTier,
    selectedTier,
    handleButtonClick
  };
}
