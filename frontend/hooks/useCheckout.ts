import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { FabricHoldTierType } from '@/utils/fabricHoldFormatting';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
}

/**
 * Re-export FabricHoldTier for backwards compatibility
 * (Previously defined here, now in fabricHoldFormatting.ts)
 */
export type FabricHoldTier = FabricHoldTierType;

interface AddonCheckoutOptions {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Hook for handling checkout session creation
 * Single Responsibility: Checkout logic
 */
export function useCheckout(user: User | null) {
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [addonLoading, setAddonLoading] = useState(false);

  const handleButtonClick = async (
    action: 'register' | 'subscribe',
    tierId: string,
    billingInterval: 'monthly' | 'yearly',
    fabricHoldTier: FabricHoldTier = '3'
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
        interval: billingInterval,
        fabricHoldTier
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

  const handleAddonOnlyCheckout = async (
    billingInterval: 'monthly' | 'yearly',
    fabricHoldTier: FabricHoldTier,
    options: AddonCheckoutOptions = {}
  ) => {
    if (!user) {
      router.push('/register');
      return { success: false, redirected: true };
    }

    setAddonLoading(true);
    try {
      const response = await api.post('/api/stripe/create-checkout-session', {
        interval: billingInterval,
        fabricHoldTier,
        addonOnly: true,
      });

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
        return { success: true, redirected: true };
      }

      if (response.data.success) {
        const successMessage = response.data.message || 'Fabric Hold add-on updated successfully';
        if (options.onSuccess) {
          options.onSuccess(successMessage);
        } else {
          alert(successMessage);
        }

        return { success: true, redirected: false, message: successMessage };
      }

      const errorMessage = response.data.message || 'Failed to update add-on';
      if (options.onError) {
        options.onError(errorMessage);
      } else {
        alert(errorMessage);
      }

      return { success: false, redirected: false, message: errorMessage };
    } catch (error) {
      console.error('Add-on checkout error:', error);
      const errorMessage = 'Failed to update add-on';
      if (options.onError) {
        options.onError(errorMessage);
      } else {
        alert(errorMessage);
      }

      return { success: false, redirected: false, message: errorMessage };
    } finally {
      setAddonLoading(false);
    }
  };

  return {
    loadingTier,
    selectedTier,
    addonLoading,
    handleButtonClick,
    handleAddonOnlyCheckout,
  };
}
