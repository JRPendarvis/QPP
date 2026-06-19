import { useState } from 'react';
import api from '@/lib/api';

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
  billingInterval: string | null;
  subscriptionStatus: string;
  fabricHoldTier: 'none' | '3' | '10' | '25' | '50';
  fabricImageLimit: number;
  skillLevel: string;
  badge: string | null;
  usage?: {
    credits: { used: number; limit: number; remaining: number };
    downloads: { used: number; limit: number; remaining: number };
    daysUntilReset: number;
  };
  tierInfo?: { name: string; price: number };
}

/**
 * Single Responsibility: Manage profile data fetching and updates
 * Does not handle form state, UI, or side effects beyond API calls
 */
export function useProfileManagement() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/profile');
      if (response.data.success) {
        setProfile(response.data.data as ProfileData);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; skillLevel?: string }) => {
    try {
      setLoading(true);
      const response = await api.put('/api/user/profile', data);
      if (response.data.success) {
        setProfile(response.data.data as ProfileData);
        return { success: true, profile: response.data.data as ProfileData };
      }
      return { success: false, error: response.data.message };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
  };
}
