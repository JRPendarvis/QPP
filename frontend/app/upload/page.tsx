"use client";


  //
const NEXT_LEVEL: Record<string, string> = {
  beginner: 'advanced_beginner',
  advanced_beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'expert',
  expert: 'expert',
};

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

function getPatternsForSkillLevel(skillLevel: string): { id: string; name: string; minFabrics: number; maxFabrics: number }[] {
  const SKILL_HIERARCHY = [
    'beginner',
    'advanced_beginner',
    'intermediate',
    'advanced',
    'expert',
  ];
  const skillIndex = SKILL_HIERARCHY.indexOf(skillLevel);
  if (skillIndex === -1) return PATTERN_OPTIONS['beginner'] || [];
  const availablePatterns: { id: string; name: string; minFabrics: number; maxFabrics: number }[] = [];
  for (let i = 0; i <= skillIndex; i++) {
    const levelPatterns = PATTERN_OPTIONS[SKILL_HIERARCHY[i]] || [];
    availablePatterns.push(...levelPatterns);
  }
  return availablePatterns;
}

function formatFabricRange(min: number, max: number): string {
  if (min === max) {
    return `${min} fabric${min !== 1 ? 's' : ''}`;
  }
  return `${min}-${max} fabrics`;
}

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { RoleAssignments, handleRoleChange } from '../helpers/roleAssignments';
// Fabric roles for assignment
const FABRIC_ROLES = [
  { key: 'background', label: 'Background' },
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
];
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import FabricDropzone from '@/components/upload/FabricDropzone';
import FabricPreviewGrid from '@/components/upload/FabricPreviewGrid';

import UploadSection from '@/components/upload/UploadSection';
import RoleAssignmentSection from '@/components/upload/RoleAssignmentSection';
import ValidationMessage from '@/components/upload/ValidationMessage';
import PatternDisplay from '@/components/upload/PatternDisplay';
import api from '@/lib/api';

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


  // State for user-assigned fabric roles
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignments>({
    background: null,
    primary: null,
    secondary: null,
    accent: null,
  });

  const {
    fabrics,
    previews,

    pattern,
    error,
    MAX_FABRICS,
    MIN_FABRICS,
    handleFilesAdded,
    removeFabric,
    clearAll,
    resetPattern,

    setFabrics,
    setPreviews,
    generatePattern,
  } = usePatternGeneration();

  // Compute total uploaded image size directly from fabrics
  const totalImageSize = fabrics && fabrics.length > 0
    ? fabrics.reduce((sum, f) => sum + (f.size || 0), 0)
    : 0;

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
  }, [patternChoice, selectedPattern, fabrics.length, effectiveMinFabrics, effectiveMaxFabrics, MIN_FABRICS, MAX_FABRICS]);

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
  }, [patternChoice, selectedPattern, fabrics.length, selectedPatternDetails, MIN_FABRICS]);


  // Handler: when user changes a role for a fabric




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

                <UploadSection
                  patternChoice={patternChoice}
                  selectedPatternDetails={selectedPatternDetails}
                  MIN_FABRICS={MIN_FABRICS}
                  MAX_FABRICS={MAX_FABRICS}
                  fabricsLength={fabrics.length}
                  formatFabricRange={formatFabricRange}
                  fabricCountValid={fabricCountValid}
                />
                <FabricDropzone
                  onFilesAdded={handleFilesAdded}
                  currentCount={fabrics.length}
                  maxFiles={effectiveMaxFabrics}
                  totalSize={totalImageSize}
                />
              </div>

              {/* Fabric Preview Grid with drag-and-drop role assignment UI */}
              {fabrics.length > 0 && (
                <div className="mb-6">
                  <FabricPreviewGrid
                    previews={previews}
                    fabrics={fabrics}
                    onRemove={removeFabric}
                    onClearAll={clearAll}
                    onReorder={(fromIdx, toIdx) => {
                      if (fromIdx === toIdx) return;
                      // Reorder fabrics and previews arrays
                      const newFabrics = [...fabrics];
                      const [movedFabric] = newFabrics.splice(fromIdx, 1);
                      newFabrics.splice(toIdx, 0, movedFabric);
                      const newPreviews = [...previews];
                      const [movedPreview] = newPreviews.splice(fromIdx, 1);
                      newPreviews.splice(toIdx, 0, movedPreview);
                      setFabrics(newFabrics);
                      setPreviews(newPreviews);
                    }}
                  />
                  <RoleAssignmentSection
                    fabrics={fabrics}
                    FABRIC_ROLES={FABRIC_ROLES}
                    roleAssignments={roleAssignments}
                    setRoleAssignments={setRoleAssignments}
                    handleRoleChange={handleRoleChange}
                  />
                </div>
              )}

              {/* Validation Message */}
              <ValidationMessage message={fabricValidationMessage && fabrics.length > 0 ? fabricValidationMessage : null} />

              {/* Generate Button (always visible) */}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-3 rounded-md text-white font-semibold transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    generatePattern(currentSkill, challengeMe, patternChoice === 'manual' ? selectedPattern : undefined);
                  }}
                  data-testid="generate-button"
                >
                  Generate Pattern
                </button>
              </div>
            </>
          )}

          {pattern && (
            <PatternDisplay
              pattern={pattern}
              userTier={profile.subscriptionTier}
              usage={profile.usage}
              onStartOver={() => {
                resetPattern();
                setRoleAssignments({ background: null, primary: null, secondary: null, accent: null });
                setSelectedPattern('');
                setPatternChoice('auto');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
