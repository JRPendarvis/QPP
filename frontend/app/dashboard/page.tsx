'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

const SKILL_LEVELS: Record<string, string> = {
  beginner: 'Beginner',
  advanced_beginner: 'Advanced Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

interface UserProfile {
  skillLevel: string;
  subscriptionTier: string;
  name?: string;
  email: string;
  badge?: string;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        if (isMounted && response.data.success) {
          setProfile(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (user) {
      fetchProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleStartDesign = () => {
    router.push('/upload');
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

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F9FAFB'}}>
      <Navigation />

      {/* Header Banner */}
      <div className="py-8 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Your Quilting Dashboard</h1>
            {profile.badge && (
              <img 
                src={profile.badge === 'tester' ? '/QPPTester.png' : '/QPPFounder.png'}
                alt={profile.badge === 'tester' ? 'QPP Tester' : 'QPP Founder'}
                className="h-12 w-auto"
              />
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg shadow-lg p-8" style={{backgroundColor: '#FFF', borderTop: '6px solid #2C7A7B'}}>
          <h2 className="text-2xl font-bold mb-4" style={{color: '#B91C1C'}}>Welcome back!</h2>
          
          <div className="space-y-2 mb-6">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name || 'Not set'}</p>
            <p><strong>Subscription:</strong> <span className="capitalize" style={{color: '#F59E0B'}}>{user.subscriptionTier}</span></p>
            <p><strong>Skill Level:</strong> {SKILL_LEVELS[currentSkill]}</p>
          </div>

          <button
            onClick={handleStartDesign}
            className="w-full px-6 py-4 text-white font-semibold rounded-lg shadow-md transition"
            style={{backgroundColor: '#2C7A7B'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#236B6C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C7A7B'}
          >
            Start New Quilt Design
          </button>
          
          <div className="mt-4 p-4 rounded" style={{backgroundColor: '#88A98E20', borderColor: '#88A98E', borderWidth: '1px'}}>
            <h3 className="font-semibold mb-2" style={{color: '#B85C5C'}}>How it works:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Upload 2-8 fabric images</li>
              <li>AI generates a {SKILL_LEVELS[currentSkill]} level quilt pattern</li>
              <li>Download PDF with instructions</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}