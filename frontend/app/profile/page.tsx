'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';
import UsageStatsSection from '@/components/profile/UsageStatsSection';
import AccountInfoSection from '@/components/profile/AccountInfoSection';
import SkillLevelSection from '@/components/profile/SkillLevelSection';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/user/profile');
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        setName(profileData.name || '');
        setSkillLevel(profileData.skillLevel || 'beginner');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put('/api/user/profile', {
        name,
        skillLevel,
      });

      if (response.data.success) {
        setMessage('Profile updated successfully!');
        setProfile(response.data.data);
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.name = name;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return;
    }

    setCanceling(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/api/stripe/cancel-subscription');

      if (response.data.success) {
        setMessage('Subscription canceled. You will retain access until the end of your billing period.');
        setTimeout(() => fetchProfile(), 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

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

  const usage = profile.usage || {
    generations: { used: 0, limit: 0, remaining: 0 },
    downloads: { used: 0, limit: 0, remaining: 0 },
    daysUntilReset: 0,
  };

  const tierInfo = profile.tierInfo || { name: 'Free', price: 0 };

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

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6">

          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AccountInfoSection
              email={profile.email}
              name={name}
              subscriptionTier={profile.subscriptionTier}
              subscriptionStatus={profile.subscriptionStatus}
              billingInterval={profile.billingInterval}
              tierInfo={tierInfo}
              canceling={canceling}
              onNameChange={setName}
              onCancelSubscription={handleCancelSubscription}
            />

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
