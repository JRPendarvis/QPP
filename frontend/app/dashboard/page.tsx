'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const SKILL_LEVELS: Record<string, string> = {
  beginner: 'Beginner',
  advanced_beginner: 'Advanced Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

const NEXT_LEVEL: Record<string, string> = {
  beginner: 'advanced_beginner',
  advanced_beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'expert',
  expert: 'expert',
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [challengeMe, setChallengeMe] = useState(false);

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
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleStartDesign = () => {
    // Pass challengeMe state to upload page via URL params
    router.push(`/upload?challenge=${challengeMe ? 'true' : 'false'}`);
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

  const currentSkill = profile.skillLevel || 'beginner';
  const targetSkill = challengeMe ? NEXT_LEVEL[currentSkill] : currentSkill;
  const isMaxLevel = currentSkill === 'expert';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">QuiltPlannerPro</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Profile
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          
          <div className="space-y-2 mb-6">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name || 'Not set'}</p>
            <p><strong>Subscription:</strong> <span className="capitalize">{user.subscriptionTier}</span></p>
            <p><strong>Skill Level:</strong> {SKILL_LEVELS[currentSkill]}</p>
          </div>

          {/* Challenge Me Option */}
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="challengeMe"
                  type="checkbox"
                  checked={challengeMe}
                  onChange={(e) => setChallengeMe(e.target.checked)}
                  disabled={isMaxLevel}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="challengeMe" className="font-semibold text-indigo-900 text-lg">
                  Challenge Me! 🚀
                </label>
                <p className="text-sm text-indigo-700 mt-1">
                  {isMaxLevel ? (
                    <>You're at Expert level - you're ready for any pattern we can generate!</>
                  ) : challengeMe ? (
                    <>Generate a <strong>{SKILL_LEVELS[NEXT_LEVEL[currentSkill]]}</strong> level pattern to push your skills</>
                  ) : (
                    <>Check this to generate a pattern one level above your current skill ({SKILL_LEVELS[currentSkill]} → {SKILL_LEVELS[NEXT_LEVEL[currentSkill]]})</>
                  )}
                </p>
                {challengeMe && !isMaxLevel && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-300">
                    <p className="text-xs text-indigo-900">
                      <strong>Pattern will be:</strong> {SKILL_LEVELS[targetSkill]} level
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartDesign}
            className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Start New Quilt Design
          </button>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Upload 2-8 fabric images</li>
              <li>AI generates a {challengeMe && !isMaxLevel ? SKILL_LEVELS[targetSkill] : SKILL_LEVELS[currentSkill]} level quilt pattern</li>
              <li>Download PDF with instructions</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}