"use client";

import { useState, useMemo, useEffect } from 'react';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import { useBorderState } from '@/hooks/useBorderState';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import PatternDisplay from '@/components/upload/PatternDisplay';
import ErrorDisplay from '@/components/upload/ErrorDisplay';
import BorderControl from '@/components/upload/BorderControl';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
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
  const [fabricRoles, setFabricRoles] = useState<string[]>([]);
  const [quiltSize, setQuiltSize] = useState<string>('');

  // Border state management
  const {
    borderConfiguration,
    toggleBorders,
    addBorder,
    removeBorder,
    updateBorder,
    reorderBorder,
  } = useBorderState(0);

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

  const totalImageSize = fabrics && fabrics.length > 0
    ? fabrics.reduce((sum, f) => sum + (f.size || 0), 0)
    : 0;

  const { currentSkill, targetSkill, availablePatterns } = usePatternSelection(profile, challengeMe);

  const selectedPatternDetails = useMemo(() => {
    if (patternChoice === 'manual' && selectedPattern) {
      return availablePatterns.find((p: PatternDetails) => p.id === selectedPattern) || null;
    }
    return null;
  }, [patternChoice, selectedPattern, availablePatterns]);

  const effectiveMaxFabrics = selectedPatternDetails?.maxFabrics ?? MAX_FABRICS;

  const fabricCountValid = useMemo(
    () => validateFabricCount(
      patternChoice,
      selectedPattern,
      selectedPatternDetails,
      fabrics.length
    ),
    [patternChoice, selectedPattern, selectedPatternDetails, fabrics.length]
  );

  const fabricValidationMessage = useMemo(
    () => getFabricValidationMessage(
      patternChoice,
      selectedPattern,
      selectedPatternDetails,
      fabrics.length
    ),
    [patternChoice, selectedPattern, selectedPatternDetails, fabrics.length]
  );

  const handlePatternChoiceChange = (choice: PatternChoice) => {
    setPatternChoice(choice);
    if (choice === 'auto') {
      setSelectedPattern('');
      setFabricRoles([]);
    }
  };

  useEffect(() => {
    if (patternChoice === 'manual' && selectedPattern) {
      api.get(`/api/patterns/${selectedPattern}/fabric-roles`)
        .then(response => {
          if (response.data.success && response.data.data.fabricRoles) {
            setFabricRoles(response.data.data.fabricRoles);
          }
        })
        .catch(err => {
          console.error('Failed to fetch fabric roles:', err);
          setFabricRoles([]);
        });
    } else {
      setFabricRoles([]);
    }
  }, [patternChoice, selectedPattern]);

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

  const handleGenerate = async () => {
    const loadingToast = toast.loading('Generating your quilt pattern! This may take a moment...');
    setGenerating(true);
    try {
      await generatePattern(
        currentSkill,
        challengeMe,
        patternChoice === 'manual' ? selectedPattern : undefined,
        quiltSize || undefined,
        borderConfiguration.enabled ? borderConfiguration.borders : undefined
      );
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
    } finally {
      setGenerating(false);
    }
  };

  const handleFilesAddedWrapper = (files: FileList | File[]) => {
    if (files instanceof FileList) {
      handleFilesAdded(Array.from(files));
    } else {
      handleFilesAdded(files);
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
      <Toaster position="bottom-right" />
      <Navigation />

      <div className="py-8 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <UploadHeader />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          
          <ErrorDisplay error={error} />

          {!pattern && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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

                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Step 2: Choose Quilt Size</h2>
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-600">
                      Choose your desired quilt size (optional)
                    </label>
                    <select
                      value={quiltSize}
                      onChange={(e) => setQuiltSize(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-700 transition-colors"
                    >
                      <option value="">Default (60×72 inches)</option>
                      <option value="baby">Baby (36×52 inches)</option>
                      <option value="lap">Lap/Throw (50×65 inches)</option>
                      <option value="twin">Twin (66×90 inches)</option>
                      <option value="full">Full/Double (80×90 inches)</option>
                      <option value="queen">Queen (90×95 inches)</option>
                      <option value="king">King (105×95 inches)</option>
                    </select>
                    {quiltSize && (
                      <p className="text-sm text-gray-500 mt-1">
                        Selected: {quiltSize.charAt(0).toUpperCase() + quiltSize.slice(1)} size
                      </p>
                    )}
                  </div>
                </div>

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

              {fabrics.length > 0 && (
                <div className="mb-6 border-2 border-gray-200 rounded-lg p-4">
                  <BorderControl
                    enabled={borderConfiguration.enabled}
                    borders={borderConfiguration.borders}
                    fabricNames={fabrics.map((f, idx) => f.name || `Fabric ${idx + 1}`)}
                    onToggle={toggleBorders}
                    onAdd={addBorder}
                    onRemove={removeBorder}
                    onUpdate={updateBorder}
                    onReorder={reorderBorder}
                  />
                </div>
              )}

              <GenerateButton
                onClick={handleGenerate}
                disabled={generating || !fabricCountValid || !!fabricValidationMessage}
                generating={generating}
                fabricCount={fabrics.length}
              />

              {fabrics.length > 0 && (
                <div className="my-6">
                  <FabricPreviewGrid
                    previews={previews}
                    fabrics={fabrics}
                    onRemove={removeFabric}
                    onClearAll={clearAll}
                    onReorder={handleFabricReorder}
                    fabricRoles={fabricRoles.length > 0 ? fabricRoles : undefined}
                  />
                </div>
              )}

              <ValidationMessage 
                message={fabricValidationMessage && fabrics.length > 0 ? fabricValidationMessage : null} 
              />
            </>
          )}

          {pattern && !generating && (
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
