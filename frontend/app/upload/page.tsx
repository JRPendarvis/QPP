'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
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

const PATTERN_OPTIONS: Record<string, { id: string; name: string }[]> = {
  beginner: [
    { id: 'simple-squares', name: 'Simple Squares' },
    { id: 'strip-quilt', name: 'Strip Quilt' },
    { id: 'checkerboard', name: 'Checkerboard' },
    { id: 'rail-fence', name: 'Rail Fence' },
  ],
  advanced_beginner: [
    { id: 'four-patch', name: 'Four Patch' },
    { id: 'nine-patch', name: 'Nine Patch' },
    { id: 'half-square-triangles', name: 'Half-Square Triangles' },
    { id: 'hourglass', name: 'Hourglass' },
    { id: 'bow-tie', name: 'Bow Tie' },
  ],
  intermediate: [
    { id: 'flying-geese', name: 'Flying Geese' },
    { id: 'pinwheel', name: 'Pinwheel' },
    { id: 'log-cabin', name: 'Log Cabin' },
    { id: 'sawtooth-star', name: 'Sawtooth Star' },
    { id: 'ohio-star', name: 'Ohio Star' },
    { id: 'churn-dash', name: 'Churn Dash' },
  ],
  advanced: [
    { id: 'lone-star', name: 'Lone Star' },
    { id: 'mariners-compass', name: "Mariner's Compass" },
    { id: 'new-york-beauty', name: 'New York Beauty' },
    { id: 'storm-at-sea', name: 'Storm at Sea' },
    { id: 'drunkards-path', name: "Drunkard's Path" },
  ],
  expert: [
    { id: 'feathered-star', name: 'Feathered Star' },
    { id: 'grandmothers-flower-garden', name: "Grandmother's Flower Garden" },
    { id: 'double-wedding-ring', name: 'Double Wedding Ring' },
    { id: 'pickle-dish', name: 'Pickle Dish' },
    { id: 'complex-medallion', name: 'Complex Medallion' },
  ],
};

interface UserProfile {
  skillLevel: string;
  subscriptionTier: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
    generations: {
      used: number;
      limit: number;
      remaining: number;
    };
    downloads: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
}

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [patternChoice, setPatternChoice] = useState<'auto' | 'manual'>('auto');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [challengeMe, setChallengeMe] = useState(false);
  
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
    resetPattern,
    generatePattern,
  } = usePatternGeneration();

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

  const handleGenerateClick = () => {
    if (profile) {
      const patternId = patternChoice === 'manual' ? selectedPattern : undefined;
      generatePattern(profile.skillLevel, challengeMe, patternId);
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
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!pattern && (
            <>
              {/* STEP 1: Pattern Selection Section - NOW FIRST */}
              <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Step 1: Choose Your Pattern Style
                </h2>

                {/* Pattern Choice Radio Buttons */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="patternChoice"
                      value="auto"
                      checked={patternChoice === 'auto'}
                      onChange={() => {
                        setPatternChoice('auto');
                        setSelectedPattern('');
                      }}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        Let QuiltPlannerPro Choose
                      </div>
                      <div className="text-sm text-gray-600">
                        Our AI will pick the best pattern for your skill level and fabrics
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="patternChoice"
                      value="manual"
                      checked={patternChoice === 'manual'}
                      onChange={() => setPatternChoice('manual')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-2">
                        I&apos;ll Choose My Pattern
                      </div>
                      
                      {patternChoice === 'manual' && (
                        <select
                          value={selectedPattern}
                          onChange={(e) => setSelectedPattern(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select a pattern...</option>
                          {PATTERN_OPTIONS[targetSkill]?.map((patternOption) => (
                            <option key={patternOption.id} value={patternOption.id}>
                              {patternOption.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                </div>

                {/* Challenge Me Checkbox */}
                <label className="flex items-center cursor-pointer p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={challengeMe}
                    onChange={(e) => setChallengeMe(e.target.checked)}
                    className="mr-3 h-5 w-5 text-indigo-600"
                  />
                  <div>
                    <div className="font-medium text-indigo-900">
                      🚀 Challenge Me
                    </div>
                    <div className="text-sm text-indigo-700">
                      Use {SKILL_LEVELS[targetSkill]} level complexity
                      {challengeMe && currentSkill !== 'expert' && (
                        <span className="ml-1 font-semibold">(one level up!)</span>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* STEP 2: Upload Section - NOW SECOND */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Step 2: Upload Your Fabric Images
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Upload {MIN_FABRICS}-{MAX_FABRICS} fabric images to generate your quilt pattern. 
                  Supported formats: JPG, PNG, WEBP
                </p>

                <FabricDropzone
                  onFilesAdded={handleFilesAdded}
                  currentCount={fabrics.length}
                  maxFiles={MAX_FABRICS}
                />
              </div>

              {/* Fabric Preview Grid */}
              {fabrics.length > 0 && (
                <FabricPreviewGrid
                  previews={previews}
                  fabrics={fabrics}
                  onRemove={removeFabric}
                  onClearAll={clearAll}
                />
              )}

              {/* Generate Button */}
              {fabrics.length >= MIN_FABRICS && (
                <GenerateButton
                  onClick={handleGenerateClick}
                  disabled={
                    fabrics.length < MIN_FABRICS || 
                    generating || 
                    (patternChoice === 'manual' && !selectedPattern)
                  }
                  generating={generating}
                  fabricCount={fabrics.length}
                />
              )}
            </>
          )}

          {pattern && (
            <PatternDisplay
              pattern={pattern}
              userTier={profile.subscriptionTier}
              usage={profile.usage}
              onStartOver={resetPattern}
            />
          )}
        </div>
      </main>
    </div>
  );
}