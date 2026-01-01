"use client";

import { useState, useMemo } from 'react';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import PatternDisplay from '@/components/upload/PatternDisplay';
import {
  FabricPreviewGrid,
  ValidationMessage,
  GenerateButton,
} from '@/components/upload';

import { useUserProfile, usePatternSelection } from './utils/hooks';
import { validateFabricCount, getFabricValidationMessage } from './utils/validation';
import { PatternSelectionSection, UploadSectionContainer } from './utils/components';
import { PatternChoice, PatternDetails } from './utils/types';

export default function UploadPage() {
  const { user, loading, profile } = useUserProfile();
  const [patternChoice, setPatternChoice] = useState<PatternChoice>('auto');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [challengeMe, setChallengeMe] = useState(false);
  const [generating, setGenerating] = useState(false);

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

  // Compute total uploaded image size
  const totalImageSize = fabrics && fabrics.length > 0
    ? fabrics.reduce((sum, f) => sum + (f.size || 0), 0)
    : 0;

  // Get available patterns based on skill level
  const { currentSkill, targetSkill, availablePatterns } = usePatternSelection(profile, challengeMe);

  // Get selected pattern details
  const selectedPatternDetails = useMemo(() => {
    if (patternChoice === 'manual' && selectedPattern) {
      return availablePatterns.find((p: PatternDetails) => p.id === selectedPattern) || null;
    }
    return null;
  }, [patternChoice, selectedPattern, availablePatterns]);

  // Determine effective max fabrics
  const effectiveMaxFabrics = selectedPatternDetails?.maxFabrics ?? MAX_FABRICS;

  // Validate fabric count
  const fabricCountValid = useMemo(
    () => validateFabricCount(
      patternChoice,
      selectedPattern,
      selectedPatternDetails,
      fabrics.length
    ),
    [patternChoice, selectedPattern, selectedPatternDetails, fabrics.length]
  );

  // Generate validation message
  const fabricValidationMessage = useMemo(
    () => getFabricValidationMessage(
      patternChoice,
      selectedPattern,
      selectedPatternDetails,
      fabrics.length
    ),
    [patternChoice, selectedPattern, selectedPatternDetails, fabrics.length]
  );

  // Handle pattern choice change
  const handlePatternChoiceChange = (choice: PatternChoice) => {
    setPatternChoice(choice);
    if (choice === 'auto') {
      setSelectedPattern('');
    }
  };

  // Handle fabric reorder
  const handleFabricReorder = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const newFabrics = [...fabrics];
    const [movedFabric] = newFabrics.splice(fromIdx, 1);
    newFabrics.splice(toIdx, 0, movedFabric);
    const newPreviews = [...previews];
    const [movedPreview] = newPreviews.splice(fromIdx, 1);
    newPreviews.splice(toIdx, 0, movedPreview);
    setFabrics(newFabrics);
    setPreviews(newPreviews);
  };

  // Handle generate pattern
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generatePattern(
        currentSkill,
        challengeMe,
        patternChoice === 'manual' ? selectedPattern : undefined
      );
    } finally {
      setGenerating(false);
    }
  };

  // Handle files added - convert FileList to File[] if needed
  const handleFilesAddedWrapper = (files: FileList | File[]) => {
    if (files instanceof FileList) {
      handleFilesAdded(Array.from(files));
    } else {
      handleFilesAdded(files);
    }
  };

  // Loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated
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
              {/* Side-by-side layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PatternSelectionSection
                  patternChoice={patternChoice}
                  onPatternChoiceChange={handlePatternChoiceChange}
                  selectedPattern={selectedPattern}
                  onSelectedPatternChange={setSelectedPattern}
                  availablePatterns={availablePatterns}
                  selectedPatternDetails={selectedPatternDetails}
                  fabricsLength={fabrics.length}
                  fabricCountValid={fabricCountValid}
                  challengeMe={challengeMe}
                  onChallengeMeChange={setChallengeMe}
                  targetSkill={targetSkill}
                  currentSkill={currentSkill}
                />

                <UploadSectionContainer
                  patternChoice={patternChoice}
                  selectedPatternDetails={selectedPatternDetails}
                  MIN_FABRICS={MIN_FABRICS}
                  MAX_FABRICS={MAX_FABRICS}
                  fabricsLength={fabrics.length}
                  fabricCountValid={fabricCountValid}
                  onFilesAdded={handleFilesAddedWrapper}
                  effectiveMaxFabrics={effectiveMaxFabrics}
                  totalImageSize={totalImageSize}
                />
              </div>

              {/* Fabric Preview Grid */}
              {fabrics.length > 0 && (
                <div className="mb-6">
                  <FabricPreviewGrid
                    previews={previews}
                    fabrics={fabrics}
                    onRemove={removeFabric}
                    onClearAll={clearAll}
                    onReorder={handleFabricReorder}
                  />
                </div>
              )}

              {/* Validation Message */}
              <ValidationMessage 
                message={fabricValidationMessage && fabrics.length > 0 ? fabricValidationMessage : null} 
              />
            </>
          )}

          {/* Generate Button - Always visible */}
          <GenerateButton
            onClick={handleGenerate}
            disabled={generating || !fabricCountValid || !!fabricValidationMessage}
            generating={generating}
            fabricCount={fabrics.length}
          />

          {generating && (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-indigo-700 font-medium">Generating your pattern...</span>
            </div>
          )}

          {pattern && !generating && (
            <PatternDisplay
              pattern={pattern}
              userTier={profile.subscriptionTier}
              usage={profile.usage}
              onStartOver={() => {
                resetPattern();
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