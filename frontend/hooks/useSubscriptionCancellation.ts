import { useState } from 'react';
import api from '@/lib/api';

/**
 * Single Responsibility: Handle subscription cancellation logic
 * Manages only the cancellation flow and state
 */
export function useSubscriptionCancellation() {
  const [loading, setLoading] = useState(false);

  const cancelSubscription = async (): Promise<{ success: boolean; message: string }> => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return { success: false, message: 'Cancellation cancelled by user' };
    }

    try {
      setLoading(true);
      const response = await api.post('/api/stripe/cancel-subscription');

      if (response.data.success) {
        return {
          success: true,
          message: 'Subscription canceled. You will retain access until the end of your billing period.',
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to cancel subscription',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel subscription';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    cancelSubscription,
  };
}
