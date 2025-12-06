'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

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
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-900 font-semibold mb-2">
                  ⭐ Free Tier Limits
                </p>
                <p className="text-sm text-indigo-700 mb-3">
                  • 3 pattern generations per month (resets monthly)<br />
                  • 1 PDF download lifetime (never resets)<br />
                  Upgrade for more!
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PROFILE SETTINGS */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Your Quilting Profile</h2>

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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                      <button
                        type="button"
                        onClick={() => router.push('/pricing')}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Manage Subscription
                      </button>
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50"
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