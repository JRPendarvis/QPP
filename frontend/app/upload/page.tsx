'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import UploadHeader from '@/components/upload/UploadHeader';
import FabricDropzone from '@/components/upload/FabricDropzone';
import FabricPreviewGrid from '@/components/upload/FabricPreviewGrid';
import GenerateButton from '@/components/upload/GenerateButton';
import PatternDisplay from '@/components/upload/PatternDisplay';
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

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  
  const {
    fabrics,
    previews,
    generating,
    pattern,
    error,
    MAX_FABRICS,
    MIN_FABRICS,
    handleFilesAdded,
    removeFabric,
    clearAll,
    generatePattern,
  } = usePatternGeneration();

  // Get challenge preference from URL
  const challengeMe = searchParams.get('challenge') === 'true';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch user profile
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

  const handleGenerateClick = () => {
    if (profile) {
      generatePattern(profile.skillLevel, challengeMe);
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

  const currentSkill = profile.skillLevel || 'beginner';
  const targetSkill = challengeMe ? NEXT_LEVEL[currentSkill] : currentSkill;

  return (
    <div className="min-h-screen bg-gray-50">
      <UploadHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Upload Your Fabric Images</h2>
          
          {/* Show target difficulty */}
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-900">
              <strong>Target Pattern Difficulty:</strong> {SKILL_LEVELS[targetSkill]}
              {challengeMe && currentSkill !== 'expert' && (
                <span className="ml-2 text-indigo-600">🚀 (Challenge Mode!)</span>
              )}
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            Upload {MIN_FABRICS}-{MAX_FABRICS} fabric images to generate your quilt pattern. 
            Supported formats: JPG, PNG, WEBP
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!pattern && (
            <FabricDropzone
              onFilesAdded={handleFilesAdded}
              currentCount={fabrics.length}
              maxFiles={MAX_FABRICS}
            />
          )}

          {fabrics.length > 0 && !pattern && (
            <>
              <FabricPreviewGrid
                previews={previews}
                fabrics={fabrics}
                onRemove={removeFabric}
                onClearAll={clearAll}
              />
              <GenerateButton
                onClick={handleGenerateClick}
                disabled={fabrics.length < MIN_FABRICS || generating}
                generating={generating}
                fabricCount={fabrics.length}
              />
            </>
          )}

          {pattern && (
            <PatternDisplay
              pattern={pattern}
              userTier={user.subscriptionTier}
              onStartOver={clearAll}
            />
          )}
        </div>
      </main>
    </div>
  );
}