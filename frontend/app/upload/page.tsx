'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import Navigation from '@/components/Navigation';
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

const SKILL_HIERARCHY = [
  'beginner',
  'advanced_beginner',
  'intermediate',
  'advanced',
  'expert',
];

const NEXT_LEVEL: Record<string, string> = {
  beginner: 'advanced_beginner',
  advanced_beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'expert',
  expert: 'expert',
};

const PATTERN_OPTIONS: Record<string, { id: string; name: string; recommendedFabricCount?: number | { min: number; max: number } }[]> = {
  beginner: [
    { id: 'simple-squares', name: 'Simple Squares', recommendedFabricCount: { min: 3, max: 8 } },
    { id: 'strip-quilt', name: 'Strip Quilt', recommendedFabricCount: { min: 3, max: 8 } },
    { id: 'checkerboard', name: 'Checkerboard', recommendedFabricCount: 2 },
    { id: 'rail-fence', name: 'Rail Fence', recommendedFabricCount: { min: 3, max: 5 } },
  ],
  advanced_beginner: [
    { id: 'four-patch', name: 'Four Patch', recommendedFabricCount: { min: 3, max: 8 } },
    { id: 'nine-patch', name: 'Nine Patch', recommendedFabricCount: { min: 2, max: 9 } },
    { id: 'half-square-triangles', name: 'Half-Square Triangles', recommendedFabricCount: { min: 2, max: 8 } },
    { id: 'hourglass', name: 'Hourglass', recommendedFabricCount: 2 },
    { id: 'bow-tie', name: 'Bow Tie', recommendedFabricCount: { min: 2, max: 3 } },
  ],
  intermediate: [
    { id: 'flying-geese', name: 'Flying Geese', recommendedFabricCount: { min: 2, max: 3 } },
    { id: 'pinwheel', name: 'Pinwheel', recommendedFabricCount: { min: 2, max: 4 } },
    { id: 'log-cabin', name: 'Log Cabin', recommendedFabricCount: { min: 4, max: 8 } },
    { id: 'sawtooth-star', name: 'Sawtooth Star', recommendedFabricCount: 3 },
    { id: 'ohio-star', name: 'Ohio Star', recommendedFabricCount: 3 },
    { id: 'churn-dash', name: 'Churn Dash', recommendedFabricCount: 3 },
  ],
  advanced: [
    { id: 'lone-star', name: 'Lone Star', recommendedFabricCount: { min: 5, max: 8 } },
    { id: 'mariners-compass', name: "Mariner's Compass", recommendedFabricCount: { min: 4, max: 6 } },
    { id: 'new-york-beauty', name: 'New York Beauty', recommendedFabricCount: { min: 3, max: 5 } },
    { id: 'storm-at-sea', name: 'Storm at Sea', recommendedFabricCount: { min: 3, max: 4 } },
    { id: 'drunkards-path', name: "Drunkard's Path", recommendedFabricCount: 2 },
  ],
  expert: [
    { id: 'feathered-star', name: 'Feathered Star', recommendedFabricCount: { min: 3, max: 5 } },
    { id: 'grandmothers-flower-garden', name: "Grandmother's Flower Garden", recommendedFabricCount: { min: 5, max: 12 } },
    { id: 'double-wedding-ring', name: 'Double Wedding Ring', recommendedFabricCount: { min: 4, max: 8 } },
    { id: 'pickle-dish', name: 'Pickle Dish', recommendedFabricCount: { min: 4, max: 6 } },
    { id: 'complex-medallion', name: 'Complex Medallion', recommendedFabricCount: { min: 6, max: 10 } },
  ],
};

/**
 * Get all patterns available for a skill level (includes current level and all levels below)
 */
function getPatternsForSkillLevel(skillLevel: string): { id: string; name: string; recommendedFabricCount?: number | { min: number; max: number } }[] {
  const skillIndex = SKILL_HIERARCHY.indexOf(skillLevel);
  
  // If skill level not found, default to beginner
  if (skillIndex === -1) {
    return PATTERN_OPTIONS['beginner'] || [];
  }

  // Collect patterns from current level and all levels below
  const availablePatterns: { id: string; name: string; recommendedFabricCount?: number | { min: number; max: number } }[] = [];
  
  for (let i = 0; i <= skillIndex; i++) {
    const levelPatterns = PATTERN_OPTIONS[SKILL_HIERARCHY[i]] || [];
    availablePatterns.push(...levelPatterns);
  }

  return availablePatterns;
}

/**
 * Format recommended fabric count for display
 */
function formatFabricCount(count: number | { min: number; max: number } | undefined): string {
  if (!count) return '';
  if (typeof count === 'number') {
    return `${count} fabric${count !== 1 ? 's' : ''}`;
  }
  return `${count.min}-${count.max} fabrics`;
}

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
  // Sort patterns alphabetically by name for dropdown
  const availablePatterns = getPatternsForSkillLevel(targetSkill).slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <Navigation />

      {/* Hero Section */}
      <div className="py-8 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <UploadHeader />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!pattern && (
            <>
              {console.log('📸 Render: fabrics.length =', fabrics.length, 'previews.length =', previews.length)}
              
              {/* Side-by-side layout for desktop, stacked for mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* STEP 1: Pattern Selection Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
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
                          Our AI will pick the best pattern for your skill level and number of fabrics
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
                            {availablePatterns.map((patternOption) => (
                              <option key={patternOption.id} value={patternOption.id}>
                                {patternOption.name}
                                {patternOption.recommendedFabricCount && 
                                  ` (Best with ${formatFabricCount(patternOption.recommendedFabricCount)})`
                                }
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

                {/* STEP 2: Upload Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
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