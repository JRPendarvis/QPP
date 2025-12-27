'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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

// Pattern options with accurate fabric count requirements
// These values must match the backend PatternDefinition minColors/maxColors
const PATTERN_OPTIONS: Record<string, { id: string; name: string; minFabrics: number; maxFabrics: number }[]> = {
  beginner: [
    { id: 'simple-squares', name: 'Simple Squares', minFabrics: 1, maxFabrics: 8 },
    { id: 'strip-quilt', name: 'Strip Quilt', minFabrics: 3, maxFabrics: 8 },
    { id: 'checkerboard', name: 'Checkerboard', minFabrics: 2, maxFabrics: 2 },
    { id: 'rail-fence', name: 'Rail Fence', minFabrics: 3, maxFabrics: 5 },
  ],
  advanced_beginner: [
    { id: 'four-patch', name: 'Four Patch', minFabrics: 3, maxFabrics: 8 },
    { id: 'nine-patch', name: 'Nine Patch', minFabrics: 2, maxFabrics: 9 },
    { id: 'half-square-triangles', name: 'Half-Square Triangles', minFabrics: 2, maxFabrics: 8 },
    { id: 'hourglass', name: 'Hourglass', minFabrics: 2, maxFabrics: 4 },
    { id: 'bow-tie', name: 'Bow Tie', minFabrics: 2, maxFabrics: 3 },
  ],
  intermediate: [
    { id: 'flying-geese', name: 'Flying Geese', minFabrics: 2, maxFabrics: 8 },
    { id: 'pinwheel', name: 'Pinwheel', minFabrics: 2, maxFabrics: 4 },
    { id: 'log-cabin', name: 'Log Cabin', minFabrics: 3, maxFabrics: 8 },
    { id: 'sawtooth-star', name: 'Sawtooth Star', minFabrics: 2, maxFabrics: 3 },
    { id: 'ohio-star', name: 'Ohio Star', minFabrics: 2, maxFabrics: 3 },
    { id: 'churn-dash', name: 'Churn Dash', minFabrics: 2, maxFabrics: 3 },
  ],
  advanced: [
    { id: 'lone-star', name: 'Lone Star', minFabrics: 3, maxFabrics: 8 },
    { id: 'mariners-compass', name: "Mariner's Compass", minFabrics: 4, maxFabrics: 6 },
    { id: 'new-york-beauty', name: 'New York Beauty', minFabrics: 4, maxFabrics: 5 },
    { id: 'storm-at-sea', name: 'Storm at Sea', minFabrics: 3, maxFabrics: 4 },
    { id: 'drunkards-path', name: "Drunkard's Path", minFabrics: 2, maxFabrics: 2 },
  ],
  expert: [
    { id: 'feathered-star', name: 'Feathered Star', minFabrics: 3, maxFabrics: 5 },
    { id: 'grandmothers-flower-garden', name: "Grandmother's Flower Garden", minFabrics: 3, maxFabrics: 8 },
    { id: 'double-wedding-ring', name: 'Double Wedding Ring', minFabrics: 3, maxFabrics: 4 },
    { id: 'pickle-dish', name: 'Pickle Dish', minFabrics: 4, maxFabrics: 6 },
    { id: 'complex-medallion', name: 'Complex Medallion', minFabrics: 3, maxFabrics: 8 },
  ],
};

/**
 * Get all patterns available for a skill level (includes current level and all levels below)
 */
function getPatternsForSkillLevel(skillLevel: string): { id: string; name: string; minFabrics: number; maxFabrics: number }[] {
  const skillIndex = SKILL_HIERARCHY.indexOf(skillLevel);
  
  // If skill level not found, default to beginner
  if (skillIndex === -1) {
    return PATTERN_OPTIONS['beginner'] || [];
  }

  // Collect patterns from current level and all levels below
  const availablePatterns: { id: string; name: string; minFabrics: number; maxFabrics: number }[] = [];
  
  for (let i = 0; i <= skillIndex; i++) {
    const levelPatterns = PATTERN_OPTIONS[SKILL_HIERARCHY[i]] || [];
    availablePatterns.push(...levelPatterns);
  }

  return availablePatterns;
}

/**
 * Format fabric count range for display
 */
function formatFabricRange(min: number, max: number): string {
  if (min === max) {
    return `${min} fabric${min !== 1 ? 's' : ''}`;
  }
  return `${min}-${max} fabrics`;
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

  // Compute available patterns based on skill level
  const currentSkill = profile?.skillLevel || 'beginner';
  const targetSkill = challengeMe ? NEXT_LEVEL[currentSkill] : currentSkill;
  const availablePatterns = useMemo(() => 
    getPatternsForSkillLevel(targetSkill).slice().sort((a, b) => a.name.localeCompare(b.name)),
    [targetSkill]
  );

  // Get selected pattern details
  const selectedPatternDetails = useMemo(() => {
    if (patternChoice === 'manual' && selectedPattern) {
      return availablePatterns.find(p => p.id === selectedPattern) || null;
    }
    return null;
  }, [patternChoice, selectedPattern, availablePatterns]);

  // Determine effective min/max fabrics based on selection
  const effectiveMinFabrics = selectedPatternDetails?.minFabrics ?? MIN_FABRICS;
  const effectiveMaxFabrics = selectedPatternDetails?.maxFabrics ?? MAX_FABRICS;

  // Check if current fabric count is valid for selected pattern
  const fabricCountValid = useMemo(() => {
    if (patternChoice === 'auto') {
      return fabrics.length >= MIN_FABRICS && fabrics.length <= MAX_FABRICS;
    }
    if (!selectedPattern) {
      return false;
    }
    return fabrics.length >= effectiveMinFabrics && fabrics.length <= effectiveMaxFabrics;
  }, [patternChoice, selectedPattern, fabrics.length, effectiveMinFabrics, effectiveMaxFabrics]);

  // Generate validation message
  const fabricValidationMessage = useMemo(() => {
    if (patternChoice === 'auto') {
      if (fabrics.length < MIN_FABRICS) {
        return `Upload at least ${MIN_FABRICS} fabrics to generate a pattern`;
      }
      return null;
    }
    
    if (!selectedPattern) {
      return 'Please select a pattern';
    }

    if (!selectedPatternDetails) return null;

    if (fabrics.length < selectedPatternDetails.minFabrics) {
      const needed = selectedPatternDetails.minFabrics - fabrics.length;
      return `${selectedPatternDetails.name} requires at least ${selectedPatternDetails.minFabrics} fabrics. Please add ${needed} more.`;
    }
    
    if (fabrics.length > selectedPatternDetails.maxFabrics) {
      const excess = fabrics.length - selectedPatternDetails.maxFabrics;
      return `${selectedPatternDetails.name} uses at most ${selectedPatternDetails.maxFabrics} fabrics. Please remove ${excess} or choose a different pattern.`;
    }

    return null;
  }, [patternChoice, selectedPattern, fabrics.length, selectedPatternDetails]);

  const handleGenerateClick = () => {
    if (profile && fabricCountValid) {
      const patternId = patternChoice === 'manual' ? selectedPattern : undefined;
      generatePattern(profile.skillLevel, challengeMe, patternId);
    }
  };

  // Reset selected pattern when switching back to auto
  const handlePatternChoiceChange = (choice: 'auto' | 'manual') => {
    setPatternChoice(choice);
    if (choice === 'auto') {
      setSelectedPattern('');
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
                        onChange={() => handlePatternChoiceChange('auto')}
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
                        onChange={() => handlePatternChoiceChange('manual')}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-2">
                          I&apos;ll Choose My Pattern
                        </div>
                        
                        {patternChoice === 'manual' && (
                          <>
                            <select
                              value={selectedPattern}
                              onChange={(e) => setSelectedPattern(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select a pattern...</option>
                              {availablePatterns.map((patternOption) => (
                                <option key={patternOption.id} value={patternOption.id}>
                                  {patternOption.name} ({formatFabricRange(patternOption.minFabrics, patternOption.maxFabrics)})
                                </option>
                              ))}
                            </select>
                            
                            {/* Pattern requirements badge */}
                            {selectedPatternDetails && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex items-center text-blue-800">
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">{selectedPatternDetails.name}</span>
                                </div>
                                <p className="mt-1 text-sm text-blue-700">
                                  Requires {formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)}
                                  {fabrics.length > 0 && (
                                    <span className={`ml-2 font-medium ${fabricCountValid ? 'text-green-600' : 'text-red-600'}`}>
                                      (you have {fabrics.length})
                                    </span>
                                  )}
                                </p>
                              </div>
                            )}
                          </>
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
                  
                  <p className="text-gray-600 mb-4">
                    {patternChoice === 'manual' && selectedPatternDetails ? (
                      <>
                        <span className="font-medium">{selectedPatternDetails.name}</span> requires{' '}
                        <span className="font-medium text-indigo-600">
                          {formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)}
                        </span>
                      </>
                    ) : (
                      <>Upload {MIN_FABRICS}-{MAX_FABRICS} fabric images to generate your quilt pattern</>
                    )}
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-6">
                    Supported formats: JPG, PNG, WEBP (max 5MB per image)
                  </p>

                  <FabricDropzone
                    onFilesAdded={handleFilesAdded}
                    currentCount={fabrics.length}
                    maxFiles={effectiveMaxFabrics}
                  />
                  
                  {/* Fabric count indicator */}
                  {fabrics.length > 0 && (
                    <div className={`mt-4 text-sm ${fabricCountValid ? 'text-green-600' : 'text-amber-600'}`}>
                      {fabrics.length} of {patternChoice === 'manual' && selectedPatternDetails 
                        ? formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)
                        : `${MIN_FABRICS}-${MAX_FABRICS}`
                      } fabrics uploaded
                    </div>
                  )}
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

              {/* Validation Message */}
              {fabricValidationMessage && fabrics.length > 0 && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center text-amber-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{fabricValidationMessage}</span>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              {fabrics.length > 0 && (
                <GenerateButton
                  onClick={handleGenerateClick}
                  disabled={!fabricCountValid || generating}
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
