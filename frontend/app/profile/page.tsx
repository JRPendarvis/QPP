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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <p className="mt-1 text-gray-900 capitalize">{profile.subscriptionTier}</p>
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