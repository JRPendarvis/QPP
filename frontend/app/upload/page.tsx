"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import { useBorderState } from '@/hooks/useBorderState';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import PatternDisplay from '@/components/upload/PatternDisplay';
import ErrorDisplay from '@/components/upload/ErrorDisplay';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
import {
  FabricPreviewGrid,
  ValidationMessage,
  GenerateButton,
  PatternSelectionSection,
  QuiltSizeSection,
  UploadSection,
  SavedFabricLibrarySection,
  FabricDropzone,
} from '@/components/upload';

import {
  CREDIT_ALERT_THRESHOLDS,
} from './utils/constants';
import { useSavedFabricLibrary } from './utils/useSavedFabricLibrary';
import { useUserProfile, usePatternSelection } from './utils/hooks';
import { prepareGenerationRequest } from './utils/generation';
import { validateFabricCount, getFabricValidationMessage } from './utils/validation';
import { FabricYardageRef, PatternChoice } from './utils/types';
import { formatFabricRange, SKILL_LEVELS } from '@/app/helpers/patternHelpers';
import { processImageFiles } from '@/utils/imageCompression';

export default function UploadPage() {
  const router = useRouter();
  const { user, loading, profile } = useUserProfile();
  const [patternChoice, setPatternChoice] = useState<PatternChoice>('auto');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [challengeMe, setChallengeMe] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fabricRoles, setFabricRoles] = useState<string[]>([]);
  const [quiltSize, setQuiltSize] = useState<string>('');
  const [liveUpdating, setLiveUpdating] = useState(false);
  const [liveUpdateError, setLiveUpdateError] = useState<string | null>(null);
  const [lastGeneratedFabricSignature, setLastGeneratedFabricSignature] = useState('');
  const [fabricYardageRefs, setFabricYardageRefs] = useState<Array<FabricYardageRef | null>>([]);
  const [generationAdjustmentSummary, setGenerationAdjustmentSummary] = useState<string[]>([]);
  const liveUpdateDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousCreditPercentRef = useRef<number | null>(null);
  const shownCreditAlertsRef = useRef<Set<number>>(new Set());

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
    latestUsage,
  } = usePatternGeneration();

  const maybeAlertCreditThreshold = useCallback((usage: { used: number; limit: number; remaining: number } | null | undefined) => {
    if (!usage) return;
    if (!Number.isFinite(usage.limit) || usage.limit <= 0) return;

    const remainingPercent = (usage.remaining / usage.limit) * 100;
    const previousPercent = previousCreditPercentRef.current;
    previousCreditPercentRef.current = remainingPercent;

    const thresholds = [...CREDIT_ALERT_THRESHOLDS];
    const crossed = thresholds.filter((threshold) => {
      if (shownCreditAlertsRef.current.has(threshold)) return false;
      if (previousPercent === null) return remainingPercent <= threshold;
      return previousPercent > threshold && remainingPercent <= threshold;
    });

    if (crossed.length === 0) return;

    const triggeredThreshold = crossed[crossed.length - 1];
    shownCreditAlertsRef.current.add(triggeredThreshold);

    const toastId = `credit-threshold-${triggeredThreshold}`;

    if (triggeredThreshold <= 25) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Credit alert: {triggeredThreshold}% remaining ({usage.remaining} credits left).
          </p>
          <button
            type="button"
            className="self-start px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
            onClick={() => {
              toast.dismiss(t.id);
              router.push('/pricing');
            }}
          >
            Upgrade Plan
          </button>
        </div>
      ), {
        id: toastId,
        icon: '⚠️',
        duration: 8000,
      });
      return;
    }

    toast(`Credit alert: ${triggeredThreshold}% remaining (${usage.remaining} credits left).`, {
      id: toastId,
      icon: '⚠️',
      duration: 6000,
    });
  }, [router]);

  const totalImageSize = fabrics && fabrics.length > 0
    ? fabrics.reduce((sum, f) => sum + (f.size || 0), 0)
    : 0;

  const { currentSkill, targetSkill, availablePatterns } = usePatternSelection(profile, challengeMe);

  const selectedPatternDetails = useMemo(() => {
    if (patternChoice === 'manual' && selectedPattern) {
      return availablePatterns.find((p) => p.id === selectedPattern) || null;
    }
    return null;
  }, [patternChoice, selectedPattern, availablePatterns]);

  // Backend enforces an absolute max total fabric upload count.
  // Pattern and border requirements must fit within this cap.
  const borderFabricsNeeded = borderConfiguration.enabled ? borderConfiguration.borders.length : 0;
  const effectiveMaxFabrics = Math.min(
    MAX_FABRICS,
    (selectedPatternDetails?.maxFabrics ?? MAX_FABRICS) + borderFabricsNeeded
  );

  const fabricCountValid = useMemo(
    () => validateFabricCount(
      patternChoice,
      selectedPattern,
      selectedPatternDetails,
      fabrics.length,
      borderFabricsNeeded
    ),
    [patternChoice, selectedPattern, selectedPatternDetails, fabrics.length, borderFabricsNeeded]
  );

  const fabricValidationMessage = useMemo(
    () => getFabricValidationMessage(
      patternChoice,
      selectedPattern,
      selectedPatternDetails,
      fabrics.length,
      borderFabricsNeeded
    ),
    [patternChoice, selectedPattern, selectedPatternDetails, fabrics.length, borderFabricsNeeded]
  );

  const maxTotalFabricsMessage = useMemo(() => {
    if (fabrics.length <= MAX_FABRICS) {
      return null;
    }
    return `Maximum ${MAX_FABRICS} total fabrics allowed (including borders). Please remove ${fabrics.length - MAX_FABRICS}.`;
  }, [fabrics.length, MAX_FABRICS]);

  const generationValidationMessage = fabricValidationMessage || maxTotalFabricsMessage;

  const currentFabricSignature = useMemo(
    () => fabrics.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join('|'),
    [fabrics]
  );

  const currentFabricLabels = useMemo(() => {
    if (fabricRoles.length >= fabrics.length) {
      return fabricRoles.slice(0, fabrics.length);
    }
    return fabrics.map((_, index) => `Fabric ${index + 1}`);
  }, [fabricRoles, fabrics]);

  const {
    savedFabrics,
    loadingSavedFabrics,
    addingSavedFabricId,
    filteredSavedFabrics,
    setSavedFabricSearch,
    handleAddSavedFabricToQuilt,
    handleReplaceFabricWithSaved,
  } = useSavedFabricLibrary({
    user,
    fabricsLength: fabrics.length,
    effectiveMaxFabrics,
    currentFabricLabels,
    setFabrics,
    setPreviews,
    setFabricYardageRefs,
  });



  const handlePatternChoiceChange = (choice: PatternChoice) => {
    setPatternChoice(choice);
    if (choice !== 'manual') {
      setSelectedPattern('');
      setFabricRoles([]);
    }
  };

  useEffect(() => {
    if (currentSkill === 'expert' && challengeMe) {
      setChallengeMe(false);
    }
  }, [currentSkill, challengeMe]);

  const handleSelectedPatternChange = (id: string) => {
    setSelectedPattern(id);
    if (!id) {
      setFabricRoles([]);
    }
  };

  useEffect(() => {
    if (patternChoice !== 'manual' || !selectedPattern) {
      return;
    }

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
  }, [patternChoice, selectedPattern]);

  const handleFabricReorder = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const newFabrics = [...fabrics];
    const [movedFabric] = newFabrics.splice(fromIdx, 1);
    newFabrics.splice(toIdx, 0, movedFabric);
    const newPreviews = [...previews];
    const [movedPreview] = newPreviews.splice(fromIdx, 1);
    newPreviews.splice(toIdx, 0, movedPreview);
    const newRefs = [...fabricYardageRefs];
    const [movedRef] = newRefs.splice(fromIdx, 1);
    newRefs.splice(toIdx, 0, movedRef);
    setFabrics(newFabrics);
    setPreviews(newPreviews);
    setFabricYardageRefs(newRefs);
  };

  const handleReplaceFabricAt = (index: number, file: File, showToast = true) => {
    if (index < 0 || index >= fabrics.length) return;

    void (async () => {
      const { validFiles } = await processImageFiles([file]);
      if (validFiles.length === 0) {
        toast.error('This image is too large. Please choose an image that can be compressed below 5MB.');
        return;
      }

      const processedFile = validFiles[0];
      const previewUrl = URL.createObjectURL(processedFile);

      setFabrics((prev) => {
        const updated = [...prev];
        updated[index] = processedFile;
        return updated;
      });

      setPreviews((prev) => {
        const updated = [...prev];
        updated[index] = previewUrl;
        return updated;
      });

      setFabricYardageRefs((prev) => {
        const updated = [...prev];
        updated[index] = {
          name: processedFile.name,
          yardageAvailable: null,
          isLibrary: false,
        };
        return updated;
      });

      if (showToast) {
        toast.success(`Replaced ${currentFabricLabels[index] || `Fabric ${index + 1}`}`);
      }
    })();
  };

  const handleAIRearrange = (assignments: { background?: string; primary?: string; secondary?: string; accent?: string }) => {
    // Create a map of filename to ALL matching indices to support duplicate filenames.
    const fabricIndexMap = new Map<string, number[]>();
    fabrics.forEach((fabric, index) => {
      const key = fabric.name.trim().toLowerCase();
      const existing = fabricIndexMap.get(key) || [];
      existing.push(index);
      fabricIndexMap.set(key, existing);
    });

    const resolveIndexForName = (filename?: string): number | undefined => {
      if (!filename) return undefined;

      const key = filename.trim().toLowerCase();
      const indices = fabricIndexMap.get(key);
      if (!indices || indices.length === 0) {
        return undefined;
      }

      // Consume the next unused index for this name.
      return indices.shift();
    };

    // Build ordered list of indices based on AI recommendations
    const orderedIndices: number[] = [];
    const usedIndices = new Set<number>();

    // Add in priority order: background, primary, secondary, accent
    const roles = ['background', 'primary', 'secondary', 'accent'] as const;
    for (const role of roles) {
      const filename = assignments[role];
      if (filename) {
        const index = resolveIndexForName(filename);
        if (index !== undefined && !usedIndices.has(index)) {
          orderedIndices.push(index);
          usedIndices.add(index);
        }
      }
    }

    // Add any remaining fabrics that weren't assigned a role
    fabrics.forEach((_, index) => {
      if (!usedIndices.has(index)) {
        orderedIndices.push(index);
      }
    });

    // Reorder fabrics and previews based on the new order
    const newFabrics = orderedIndices.map(i => fabrics[i]);
    const newPreviews = orderedIndices.map(i => previews[i]);
    const newRefs = orderedIndices.map(i => fabricYardageRefs[i] || null);

    setFabrics(newFabrics);
    setPreviews(newPreviews);
    setFabricYardageRefs(newRefs);
  };

  const handleRemoveFabricAt = (index: number) => {
    removeFabric(index);
    setFabricYardageRefs((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleUpdateFabricYardage = (index: number, value: string) => {
    setFabricYardageRefs((prev) => {
      const updated = [...prev];
      const existing = updated[index] || {
        name: fabrics[index]?.name || `Fabric ${index + 1}`,
        yardageAvailable: null,
        isLibrary: false,
      };

      const trimmed = value.trim();
      if (!trimmed) {
        updated[index] = {
          ...existing,
          yardageAvailable: null,
        };
        return updated;
      }

      const parsed = Number(trimmed);
      updated[index] = {
        ...existing,
        yardageAvailable: Number.isFinite(parsed) && parsed >= 0 ? parsed : null,
      };
      return updated;
    });
  };

  const handleClearAll = () => {
    clearAll();
    setFabricYardageRefs([]);
  };

  useEffect(() => {
    setFabricYardageRefs((prev) => {
      const next = fabrics.map((fabric, index) => {
        const existing = prev[index];
        if (existing) {
          return {
            ...existing,
            name: fabric.name || existing.name,
          };
        }

        return {
          name: fabric.name,
          yardageAvailable: null,
          isLibrary: false,
        };
      });

      if (
        prev.length === next.length &&
        prev.every((item, index) => {
          const candidate = next[index];
          return item?.name === candidate?.name
            && item?.yardageAvailable === candidate?.yardageAvailable
            && item?.isLibrary === candidate?.isLibrary
            && item?.fabricId === candidate?.fabricId;
        })
      ) {
        return prev;
      }

      return next;
    });
  }, [fabrics]);

  const handleGenerate = async () => {
    if (generationValidationMessage) {
      toast.error(generationValidationMessage);
      return;
    }

    const loadingToast = toast.loading('Generating your quilt pattern! This may take a moment...');
    setGenerating(true);
    setLiveUpdateError(null);
    try {
      const generationRequest = prepareGenerationRequest({
        patternChoice,
        selectedPattern,
        quiltSize,
        fabrics,
      });

      if (generationRequest.blockingReason) {
        toast.error(generationRequest.blockingReason);
        toast.dismiss(loadingToast);
        setGenerating(false);
        return;
      }
      {
        setGenerationAdjustmentSummary([]);
      }

      const usage = await generatePattern(
        currentSkill,
        challengeMe,
        generationRequest.patternOverride,
        generationRequest.effectiveQuiltSize,
        borderConfiguration.enabled ? borderConfiguration.borders : undefined,
        generationRequest.fabricsForGeneration
      );
      maybeAlertCreditThreshold(usage);
      setLastGeneratedFabricSignature(generationRequest.fabricsForGeneration.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join('|'));
      toast.dismiss(loadingToast);
    } catch {
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

  useEffect(() => {
    maybeAlertCreditThreshold(profile?.usage?.credits);
  }, [profile?.usage?.credits?.used, profile?.usage?.credits?.remaining, profile?.usage?.credits?.limit, maybeAlertCreditThreshold]);

  useEffect(() => {
    maybeAlertCreditThreshold(latestUsage);
  }, [latestUsage?.used, latestUsage?.remaining, latestUsage?.limit, maybeAlertCreditThreshold]);

  useEffect(() => {
    if (!pattern) {
      setLiveUpdateError(null);
      return;
    }

    if (currentFabricSignature === lastGeneratedFabricSignature) {
      return;
    }

    if (!fabricCountValid || !!generationValidationMessage) {
      setLiveUpdateError(
        generationValidationMessage ||
          'Cannot update pattern right now. Please adjust fabric count first.'
      );
      return;
    }

    if (liveUpdateDebounceRef.current) {
      clearTimeout(liveUpdateDebounceRef.current);
    }

    liveUpdateDebounceRef.current = setTimeout(() => {
      void (async () => {
        setLiveUpdating(true);
        setLiveUpdateError(null);
        try {
          const generationRequest = prepareGenerationRequest({
            patternChoice,
            selectedPattern,
            quiltSize,
            fabrics,
          });

          if (generationRequest.blockingReason) {
            setLiveUpdateError(generationRequest.blockingReason);
            setLiveUpdating(false);
            return;
          }

          await generatePattern(
            currentSkill,
            challengeMe,
            generationRequest.patternOverride,
            generationRequest.effectiveQuiltSize,
            borderConfiguration.enabled ? borderConfiguration.borders : undefined,
            generationRequest.fabricsForGeneration
          );
          setLastGeneratedFabricSignature(generationRequest.fabricsForGeneration.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join('|'));
        } catch {
          setLiveUpdateError('Could not refresh pattern after fabric changes. Your previous pattern is still shown.');
        } finally {
          setLiveUpdating(false);
        }
      })();
    }, 700);

    return () => {
      if (liveUpdateDebounceRef.current) {
        clearTimeout(liveUpdateDebounceRef.current);
      }
    };
  }, [
    pattern,
    currentFabricSignature,
    lastGeneratedFabricSignature,
    fabricCountValid,
    generationValidationMessage,
    generatePattern,
    currentSkill,
    challengeMe,
    patternChoice,
    selectedPattern,
    quiltSize,
    fabrics,
    borderConfiguration,
  ]);

  const handleStartOver = () => {
    setGenerationAdjustmentSummary([]);
    resetPattern();
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

      <div className="py-8 px-4" style={{backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
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
                      setPatternChoice={handlePatternChoiceChange}
                      selectedPattern={selectedPattern}
                      setSelectedPattern={handleSelectedPatternChange}
                      availablePatterns={availablePatterns}
                      selectedPatternDetails={selectedPatternDetails}
                      formatFabricRange={formatFabricRange}
                      challengeMe={challengeMe}
                      setChallengeMe={setChallengeMe}
                      SKILL_LEVELS={SKILL_LEVELS}
                      targetSkill={targetSkill}
                      currentSkill={currentSkill}
                    />

                    <QuiltSizeSection
                      quiltSize={quiltSize}
                      setQuiltSize={setQuiltSize}
                      borderConfiguration={borderConfiguration}
                      toggleBorders={toggleBorders}
                      addBorder={addBorder}
                      removeBorder={removeBorder}
                      updateBorder={updateBorder}
                      reorderBorder={reorderBorder}
                    />

                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Step 3: Upload Your Fabric Images
                  </h2>
                  <UploadSection
                    patternChoice={patternChoice}
                    selectedPatternDetails={selectedPatternDetails}
                    MIN_FABRICS={MIN_FABRICS}
                    MAX_FABRICS={MAX_FABRICS}
                    fabricsLength={fabrics.length}
                    formatFabricRange={formatFabricRange}
                    fabricCountValid={fabricCountValid}
                    borderFabricsNeeded={borderFabricsNeeded}
                  />

                  <FabricDropzone
                    onFilesAdded={handleFilesAddedWrapper}
                    currentCount={fabrics.length}
                    maxFiles={effectiveMaxFabrics}
                    totalSize={totalImageSize}
                  />

                  <SavedFabricLibrarySection
                    loadingSavedFabrics={loadingSavedFabrics}
                    savedFabrics={savedFabrics}
                    filteredSavedFabrics={filteredSavedFabrics}
                    addingSavedFabricId={addingSavedFabricId}
                    currentFabricCount={fabrics.length}
                    effectiveMaxFabrics={effectiveMaxFabrics}
                    onSearchChange={setSavedFabricSearch}
                    onAddSavedFabricToQuilt={(fabric) => void handleAddSavedFabricToQuilt(fabric)}
                  />
                </div>
              </div>

              <GenerateButton
                onClick={handleGenerate}
                disabled={generating || !fabricCountValid || !!generationValidationMessage}
                generating={generating}
                fabricCount={fabrics.length}
              />

              {fabrics.length > 0 && (
                <div className="my-6">
                  <FabricPreviewGrid
                    previews={previews}
                    fabrics={fabrics}
                    onRemove={handleRemoveFabricAt}
                    onClearAll={handleClearAll}
                    onReorder={handleFabricReorder}
                    onAIRearrange={handleAIRearrange}
                    onUsageUpdate={maybeAlertCreditThreshold}
                    fabricRoles={fabricRoles.length > 0 ? fabricRoles : undefined}
                    borderConfiguration={borderConfiguration}
                    fabricYardageRefs={fabricYardageRefs}
                    onUpdateYardage={handleUpdateFabricYardage}
                  />
                </div>
              )}

              <ValidationMessage 
                message={generationValidationMessage && fabrics.length > 0 ? generationValidationMessage : null} 
              />
            </>
          )}

          {pattern && (
            <PatternDisplay
              pattern={pattern}
              userTier={profile.subscriptionTier}
              usage={profile.usage}
              fabrics={fabrics}
              previews={previews}
              fabricLabels={currentFabricLabels}
              savedFabrics={savedFabrics}
              liveUpdating={liveUpdating}
              liveUpdateError={liveUpdateError}
              onReplaceFabric={handleReplaceFabricAt}
              onReplaceFabricWithSaved={(index, savedFabricId) => handleReplaceFabricWithSaved(index, savedFabricId, fabrics)}
              onRemoveFabric={handleRemoveFabricAt}
              onMoveFabric={handleFabricReorder}
              fabricYardageRefs={fabricYardageRefs}
              generationAdjustmentSummary={generationAdjustmentSummary}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </main>
    </div>
  );
}
