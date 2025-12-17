'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out, learning basic techniques' },
  { value: 'advanced_beginner', label: 'Advanced Beginner', description: 'Comfortable with basics, ready for more' },
  { value: 'intermediate', label: 'Intermediate', description: 'Confident with standard techniques' },
  { value: 'advanced', label: 'Advanced', description: 'Highly skilled, tackles complex projects' },
  { value: 'expert', label: 'Expert', description: 'Master quilter with competition-level skills' },
];

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
        // Refresh profile to show updated status
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

  // Get usage data with safe defaults
  const usage = profile.usage || {
    generations: { used: 0, limit: 0, remaining: 0 },
    downloads: { used: 0, limit: 0, remaining: 0 },
    daysUntilReset: 0,
  };

  const tierInfo = profile.tierInfo || { name: 'Free', price: 0 };

  // Calculate progress percentages
  const generationsPercent = usage.generations.limit > 0 
    ? (usage.generations.used / usage.generations.limit) * 100 
    : 0;
  const downloadsPercent = usage.downloads.limit > 0 
    ? (usage.downloads.used / usage.downloads.limit) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Banner */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">
              Your Profile
            </h1>
            {profile.badge && (
              <img 
                src={profile.badge === 'tester' ? '/QPPTester.png' : '/QPPFounder.png'}
                alt={profile.badge === 'tester' ? 'QPP Tester' : 'QPP Founder'}
                className="h-16 w-auto"
              />
            )}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ✅ USAGE STATS SECTION */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Usage This Month</h2>
            <span className="text-sm text-gray-500">
              Resets in {usage.daysUntilReset} {usage.daysUntilReset === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className="space-y-6">
            {/* Pattern Generations */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Pattern Generations</span>
                <span className="text-sm text-gray-600">
                  {usage.generations.used} / {usage.generations.limit} used
                  {usage.generations.remaining > 0 && (
                    <span className="text-green-600 ml-2">
                      ({usage.generations.remaining} remaining)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    generationsPercent >= 90 ? 'bg-red-500' :
                    generationsPercent >= 70 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(generationsPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* PDF Downloads */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">PDF Downloads</span>
                <span className="text-sm text-gray-600">
                  {usage.downloads.used} / {usage.downloads.limit} used
                  {usage.downloads.remaining > 0 && (
                    <span className="text-green-600 ml-2">
                      ({usage.downloads.remaining} remaining)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    downloadsPercent >= 90 ? 'bg-red-500' :
                    downloadsPercent >= 70 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(downloadsPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            {profile.subscriptionTier === 'free' && (
              <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: '#E6FFFA', borderColor: '#2C7A7B', borderWidth: '1px'}}>
                <p className="text-sm font-semibold mb-2" style={{color: '#1F2937'}}>
                  ⭐ Free Tier Limits
                </p>
                <p className="text-sm mb-3" style={{color: '#4B5563'}}>
                  • 3 pattern generations per month (resets monthly)<br />
                  • 1 PDF download lifetime (never resets)<br />
                  Upgrade for more!
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="text-sm px-4 py-2 text-white rounded-md"
                  style={{backgroundColor: '#2C7A7B'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#236B6C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C7A7B'}
                >
                  View Plans
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PROFILE SETTINGS */}
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
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{profile.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subscription Tier</label>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-gray-900 capitalize font-medium">
                      {tierInfo.name}
                      {tierInfo.price > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          (${tierInfo.price}/{profile.billingInterval || 'month'})
                        </span>
                      )}
                    </p>
                    {profile.subscriptionTier !== 'free' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => router.push('/pricing')}
                          className="text-sm hover:underline"
                          style={{color: '#2C7A7B'}}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#236B6C'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#2C7A7B'}
                        >
                          Manage Subscription
                        </button>
                        {profile.subscriptionStatus !== 'cancel_at_period_end' && (
                          <button
                            type="button"
                            onClick={handleCancelSubscription}
                            disabled={canceling}
                            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {canceling ? 'Canceling...' : 'Cancel'}
                          </button>
                        )}
                        {profile.subscriptionStatus === 'cancel_at_period_end' && (
                          <span className="text-sm text-red-600">
                            Canceling at period end
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quilting Experience</h3>
              
              <div>
                <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Skill Level
                </label>
                <select
                  id="skillLevel"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                >
                  {SKILL_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-600">
                  We'll use this to suggest appropriate quilt patterns for your skill level
                </p>
              </div>
            </div>

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