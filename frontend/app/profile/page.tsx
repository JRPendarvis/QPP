'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import UsageStatsSection from '@/components/profile/UsageStatsSection';
import AccountInfoSection from '@/components/profile/AccountInfoSection';
import SkillLevelSection from '@/components/profile/SkillLevelSection';
import FabricHoldSection from '@/components/profile/FabricHoldSection';
import { useCheckout } from '@/hooks/useCheckout';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useSubscriptionCancellation } from '@/hooks/useSubscriptionCancellation';
import { getEffectiveFabricHoldTier, getEffectiveFabricImageLimit, FabricHoldTierType } from '@/utils/fabricHoldFormatting';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addonLoading, handleAddonOnlyCheckout } = useCheckout(user);
  
  // Single-responsibility hooks
  const { profile, fetchProfile: fetchProfileData, updateProfile } = useProfileManagement();
  const { name, setName, skillLevel, setSkillLevel, reset: resetForm, getFormData } = useProfileForm();
  const { cancelSubscription, loading: cancelingSubscription } = useSubscriptionCancellation();

  // Message state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect on auth change
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch profile on mount
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      resetForm(profile.name || '', profile.skillLevel || 'beginner');
    }
  }, [profile, resetForm]);

  /**
   * Update profile name and skill level
   */
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const result = await updateProfile(getFormData());
      if (result.success) {
        setMessage('Profile updated successfully!');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.name = name;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle subscription cancellation with confirmation
   */
  const handleCancelClick = async () => {
    const result = await cancelSubscription();
    if (result.success) {
      setMessage(result.message);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchProfileData();
    } else {
      setError(result.message);
    }
  };

    /**
     * Open Stripe customer portal for subscription management
     */
    const handleManageSubscription = async () => {
      try {
        const api = (await import('@/lib/api')).default;
        const response = await api.post('/api/stripe/create-portal-session', {
          returnUrl: window.location.href,
        });

        if (response.data.success && response.data.url) {
          window.location.href = response.data.url;
        } else {
          setError(response.data.message || 'Failed to open subscription management');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to open subscription management');
      }
    };

  /**
   * Handle fabric hold tier change
   */
  const handleFabricHoldChange = async (nextTier: FabricHoldTierType) => {
    if (!profile) return;

    setMessage('');
    setError('');

    const billingInterval = (profile.billingInterval === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly';
    const result = await handleAddonOnlyCheckout(billingInterval, nextTier, {
      onSuccess: setMessage,
      onError: setError,
    });

    if (result?.success && !result.redirected) {
      await fetchProfileData();
    }
  };

  // Loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Compute display values
  const usage = profile.usage || {
    generations: { used: 0, limit: 0, remaining: 0 },
    downloads: { used: 0, limit: 0, remaining: 0 },
    daysUntilReset: 0,
  };
  const tierInfo = profile.tierInfo || { name: 'Free', price: 0 };
  const effectiveTier = getEffectiveFabricHoldTier(
    profile.subscriptionTier,
    profile.badge,
    profile.fabricHoldTier,
    profile.fabricImageLimit
  );
  const effectiveLimit = getEffectiveFabricImageLimit(
    profile.subscriptionTier,
    profile.badge,
    profile.fabricHoldTier,
    profile.fabricImageLimit
  );
  const billingInterval = (profile.billingInterval === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Banner */}
      <div className="py-12 px-4" style={{backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white">
            Your Profile
          </h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Usage Stats */}
        <UsageStatsSection usage={usage} subscriptionTier={profile.subscriptionTier} />

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Subscription & Account Info Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <AccountInfoSection
            email={profile.email}
            name={name}
            subscriptionTier={profile.subscriptionTier}
            subscriptionStatus={profile.subscriptionStatus}
            billingInterval={profile.billingInterval || undefined}
            tierInfo={tierInfo}
            canceling={cancelingSubscription}
            onNameChange={setName}
            onCancelSubscription={handleCancelClick}
          />

            {/* Manage Subscription Button */}
            {profile.subscriptionTier !== 'free' && (
              <div className="mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleManageSubscription}
                  className="px-6 py-3 text-white font-semibold rounded-lg shadow-md"
                  style={{backgroundColor: '#2C7A7B'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#236B6C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C7A7B'}
                >
                  Manage Subscription
                </button>
              </div>
            )}
        </div>

        {/* Fabric Image Tracking Add-on Section */}
        <FabricHoldSection
          subscriptionTier={profile.subscriptionTier}
          billingInterval={billingInterval}
          badge={profile.badge}
          currentTier={effectiveTier}
          currentLimit={effectiveLimit}
          loading={addonLoading}
          onSelectTier={handleFabricHoldChange}
        />

        {/* Profile Settings Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <SkillLevelSection
              skillLevel={skillLevel}
              onSkillLevelChange={setSkillLevel}
            />

            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
                style={{backgroundColor: '#B91C1C'}}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#991B1B')}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#B91C1C')}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
