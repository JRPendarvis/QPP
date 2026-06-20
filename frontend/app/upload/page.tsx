"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import { useBorderState } from '@/hooks/useBorderState';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import PatternDisplay from '@/components/upload/PatternDisplay';
import ErrorDisplay from '@/components/upload/ErrorDisplay';
import FabricSearchBar from '@/components/fabrics/FabricSearchBar';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
import {
  FabricPreviewGrid,
  ValidationMessage,
  GenerateButton,
  PatternSelectionSection,
  UploadSection,
  FabricDropzone,
} from '@/components/upload';

import { useUserProfile, usePatternSelection } from './utils/hooks';
import { validateFabricCount, getFabricValidationMessage } from './utils/validation';
import { PatternChoice } from './utils/types';
import { getBorderName } from '@/utils/borderNaming';
import { formatFabricRange, SKILL_LEVELS } from '@/app/helpers/patternHelpers';
import fabricService, { FabricRecord } from '@/services/fabricService';
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
  const [savedFabrics, setSavedFabrics] = useState<FabricRecord[]>([]);
  const [loadingSavedFabrics, setLoadingSavedFabrics] = useState(true);
  const [addingSavedFabricId, setAddingSavedFabricId] = useState<string | null>(null);
  const [savedFabricSearch, setSavedFabricSearch] = useState('');
  const [liveUpdating, setLiveUpdating] = useState(false);
  const [liveUpdateError, setLiveUpdateError] = useState<string | null>(null);
  const [lastGeneratedFabricSignature, setLastGeneratedFabricSignature] = useState('');
  const [fabricYardageRefs, setFabricYardageRefs] = useState<Array<{ fabricId?: string; name: string; yardageAvailable: number | null; isLibrary: boolean } | null>>([]);
  const [generationAdjustmentSummary, setGenerationAdjustmentSummary] = useState<string[]>([]);
  const liveUpdateDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousCreditPercentRef = useRef<number | null>(null);
  const shownCreditAlertsRef = useRef<Set<number>>(new Set());

  // Filter saved fabrics based on search
  const filteredSavedFabrics = useMemo(() => {
    if (!savedFabricSearch.trim()) return savedFabrics;
    
    const query = savedFabricSearch.toLowerCase();
    return savedFabrics.filter((fabric) =>
      fabric.name.toLowerCase().includes(query) ||
      (fabric.type?.toLowerCase() || '').includes(query) ||
      (fabric.notes?.toLowerCase() || '').includes(query)
    );
  }, [savedFabrics, savedFabricSearch]);

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

    const thresholds = [50, 25, 10, 5];
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

  const buildUniqueStashPlan = useCallback((explicitQuiltSize?: string) => {
    const borderCount = borderConfiguration.enabled ? borderConfiguration.borders.length : 0;
    const patternCount = Math.max(0, fabrics.length - borderCount);
    const patternFabrics = fabrics.slice(0, patternCount);
    const borderFabrics = fabrics.slice(patternCount);
    const patternPreviews = previews.slice(0, patternCount);
    const borderPreviews = previews.slice(patternCount);
    const patternYardageRefs = fabricYardageRefs.slice(0, patternCount);
    const borderYardageRefs = fabricYardageRefs.slice(patternCount);

    const roleCount = Math.max(1, Math.min(patternCount || 1, 4));
    const splitSeed = [0.45, 0.3, 0.15, 0.1];
    const splits = Array.from({ length: roleCount }, (_, idx) => splitSeed[idx] || (1 / roleCount));

    const zipped = patternFabrics.map((fabric, index) => ({
      fabric,
      preview: patternPreviews[index],
      yardageRef: patternYardageRefs[index] || {
        name: fabric.name,
        yardageAvailable: null,
        isLibrary: false,
      },
      originalIndex: index,
    }));

    const sortedPattern = [...zipped].sort((a, b) => {
      const aYardage = a.yardageRef?.yardageAvailable;
      const bYardage = b.yardageRef?.yardageAvailable;

      if (aYardage === null && bYardage === null) return a.originalIndex - b.originalIndex;
      if (aYardage === null) return 1;
      if (bYardage === null) return -1;
      return bYardage - aYardage;
    });

    const wasReordered = sortedPattern.some((entry, index) => entry.originalIndex !== index);

    const sizeCatalog = [
      { key: 'baby', label: 'baby', width: 36, height: 52 },
      { key: 'lap', label: 'lap', width: 50, height: 65 },
      { key: 'default', label: 'default', width: 60, height: 72 },
      { key: 'twin', label: 'twin', width: 66, height: 90 },
      { key: 'full', label: 'full', width: 80, height: 90 },
      { key: 'queen', label: 'queen', width: 90, height: 95 },
      { key: 'king', label: 'king', width: 105, height: 95 },
    ] as const;

    const byAreaDesc = [...sizeCatalog].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const explicitSizeKey = explicitQuiltSize || 'default';
    const explicitTarget = sizeCatalog.find((entry) => entry.key === explicitSizeKey) || sizeCatalog.find((entry) => entry.key === 'default')!;
    const explicitArea = explicitTarget.width * explicitTarget.height;
    const candidates = byAreaDesc.filter((entry) => (entry.width * entry.height) <= explicitArea);

    const fitsCandidate = (candidate: (typeof sizeCatalog)[number]) => {
      const totalYards = (candidate.width * candidate.height / 1296) * 1.25;

      for (let idx = 0; idx < roleCount; idx += 1) {
        const required = Math.max(0.25, Number((totalYards * splits[idx]).toFixed(2)));
        const available = sortedPattern[idx]?.yardageRef?.yardageAvailable;

        if (available !== null && available !== undefined && required > available) {
          return false;
        }
      }

      return true;
    };

    const fittingSize = candidates.find((candidate) => fitsCandidate(candidate));
    if (!fittingSize) {
      const smallest = [...candidates].sort((a, b) => (a.width * a.height) - (b.width * b.height))[0];
      return {
        isPossible: false,
        reason: smallest
          ? `Not enough entered yardage to satisfy even ${smallest.label} size. Increase yardage for constrained roles or leave blank to buy as needed.`
          : 'Could not determine a valid size from current constraints.',
      } as const;
    }

    const plannedFabrics = [...sortedPattern.map((entry) => entry.fabric), ...borderFabrics];
    const plannedPreviews = [...sortedPattern.map((entry) => entry.preview), ...borderPreviews];
    const plannedYardageRefs = [...sortedPattern.map((entry) => entry.yardageRef), ...borderYardageRefs];
    const sizeKeyForApi = fittingSize.key === 'default' ? undefined : fittingSize.key;
    const wasSizeAdjusted = fittingSize.key !== explicitSizeKey;
    const buyAsNeededRoles: string[] = [];

    for (let idx = 0; idx < roleCount; idx += 1) {
      if (sortedPattern[idx]?.yardageRef?.yardageAvailable === null || sortedPattern[idx]?.yardageRef?.yardageAvailable === undefined) {
        const role = ['Background', 'Primary', 'Secondary', 'Accent'][idx] || `Fabric ${idx + 1}`;
        buyAsNeededRoles.push(role);
      }
    }

    const notes: string[] = [];
    if (wasReordered) {
      notes.push('Reordered fabrics so larger available yardage is assigned to higher-usage roles (Background, Primary, Secondary, Accent).');
    }
    if (wasSizeAdjusted) {
      notes.push(`Reduced quilt size from ${explicitTarget.label} to ${fittingSize.label} so required yardage does not exceed your entered amounts.`);
    }
    if (buyAsNeededRoles.length > 0) {
      notes.push(`Roles treated as buy-as-needed because yardage was left blank: ${buyAsNeededRoles.join(', ')}.`);
    }

    return {
      isPossible: true,
      plannedFabrics,
      plannedPreviews,
      plannedYardageRefs,
      effectiveQuiltSize: sizeKeyForApi,
      notes,
    } as const;
  }, [borderConfiguration, fabrics, previews, fabricYardageRefs]);

  const handlePatternChoiceChange = (choice: PatternChoice) => {
    setPatternChoice(choice);
    if (choice !== 'manual') {
      setSelectedPattern('');
      setFabricRoles([]);
    }
  };

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

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    void fabricService
      .list()
      .then((result) => {
        if (!cancelled) setSavedFabrics(result.fabrics.filter((item) => Boolean(item.imageUrl)));
      })
      .catch(() => {
        if (!cancelled) setSavedFabrics([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSavedFabrics(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const buildFileFromSavedFabric = async (fabric: FabricRecord): Promise<File> => {
    if (!fabric.imageUrl) {
      throw new Error('This saved fabric does not have a photo.');
    }

    const response = await fetch(fabric.imageUrl);
    if (!response.ok) {
      throw new Error('Unable to read saved fabric image');
    }

    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const safeName = fabric.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const rawFile = new File([blob], `${safeName || 'saved-fabric'}.${ext}`, { type: mimeType });

    // Keep saved-fabric imports aligned with dropzone uploads (<=5MB after compression).
    const { validFiles } = await processImageFiles([rawFile]);
    if (validFiles.length === 0) {
      throw new Error('Saved fabric image is too large to use (must be 5MB or less after compression).');
    }

    return validFiles[0];
  };

  const handleAddSavedFabricToQuilt = async (fabric: FabricRecord) => {
    if (fabrics.length >= effectiveMaxFabrics) {
      toast.error(`Maximum ${effectiveMaxFabrics} fabrics reached for this quilt setup.`);
      return;
    }

    setAddingSavedFabricId(fabric.id);
    try {
      const file = await buildFileFromSavedFabric(fabric);

      setFabrics((prev) => [...prev, file]);
      setPreviews((prev) => [...prev, fabric.imageUrl as string]);
      setFabricYardageRefs((prev) => [
        ...prev,
        {
          fabricId: fabric.id,
          name: fabric.name,
          yardageAvailable: fabric.yardageAvailable,
          isLibrary: true,
        },
      ]);
      toast.success(`${fabric.name} added to quilt fabrics.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not add this saved fabric photo. Please upload it manually.');
    } finally {
      setAddingSavedFabricId(null);
    }
  };

  const handleReplaceFabricWithSaved = async (index: number, savedFabricId: string) => {
    const selectedSavedFabric = savedFabrics.find((fabric) => fabric.id === savedFabricId);
    if (!selectedSavedFabric) {
      toast.error('Saved fabric not found.');
      return;
    }

    setAddingSavedFabricId(selectedSavedFabric.id);
    try {
      const file = await buildFileFromSavedFabric(selectedSavedFabric);

      if (index < 0 || index >= fabrics.length) {
        return;
      }

      setFabrics((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });

      setPreviews((prev) => {
        const updated = [...prev];
        updated[index] = selectedSavedFabric.imageUrl || updated[index];
        return updated;
      });

      setFabricYardageRefs((prev) => {
        const updated = [...prev];
        updated[index] = {
          fabricId: selectedSavedFabric.id,
          name: selectedSavedFabric.name,
          yardageAvailable: selectedSavedFabric.yardageAvailable,
          isLibrary: true,
        };
        return updated;
      });

      toast.success(`${selectedSavedFabric.name} applied to ${currentFabricLabels[index] || `Fabric ${index + 1}`}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not replace with saved fabric.');
    } finally {
      setAddingSavedFabricId(null);
    }
  };

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
      const patternOverride = patternChoice === 'unique'
        ? 'unique'
        : patternChoice === 'manual'
          ? selectedPattern
          : undefined;
      let effectiveQuiltSize = quiltSize || undefined;
      let fabricsForGeneration = fabrics;

      if (patternChoice === 'unique') {
        const plan = buildUniqueStashPlan(quiltSize || undefined);
        if (!plan.isPossible) {
          toast.error(plan.reason);
          toast.dismiss(loadingToast);
          setGenerating(false);
          return;
        }

        fabricsForGeneration = plan.plannedFabrics;
        effectiveQuiltSize = plan.effectiveQuiltSize;
        setFabrics(plan.plannedFabrics);
        setPreviews(plan.plannedPreviews);
        setFabricYardageRefs(plan.plannedYardageRefs);
        setGenerationAdjustmentSummary(plan.notes);

        if (plan.notes.length > 0) {
          toast(plan.notes.join(' '), {
            icon: '🧵',
            duration: 5000,
          });
        }
      } else {
        setGenerationAdjustmentSummary([]);
      }

      const usage = await generatePattern(
        currentSkill,
        challengeMe,
        patternOverride,
        effectiveQuiltSize,
        borderConfiguration.enabled ? borderConfiguration.borders : undefined,
        fabricsForGeneration
      );
      maybeAlertCreditThreshold(usage);
      setLastGeneratedFabricSignature(fabricsForGeneration.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join('|'));
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
          const patternOverride = patternChoice === 'unique'
            ? 'unique'
            : patternChoice === 'manual'
              ? selectedPattern
              : undefined;
          let effectiveQuiltSize = quiltSize || undefined;
          let fabricsForGeneration = fabrics;

          if (patternChoice === 'unique') {
            const plan = buildUniqueStashPlan(quiltSize || undefined);
            if (!plan.isPossible) {
              setLiveUpdateError(plan.reason);
              setLiveUpdating(false);
              return;
            }

            fabricsForGeneration = plan.plannedFabrics;
            effectiveQuiltSize = plan.effectiveQuiltSize;
            setFabrics(plan.plannedFabrics);
            setPreviews(plan.plannedPreviews);
            setFabricYardageRefs(plan.plannedYardageRefs);
            setGenerationAdjustmentSummary(plan.notes);
          }

          await generatePattern(
            currentSkill,
            challengeMe,
            patternOverride,
            effectiveQuiltSize,
            borderConfiguration.enabled ? borderConfiguration.borders : undefined,
            fabricsForGeneration
          );
          setLastGeneratedFabricSignature(fabricsForGeneration.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join('|'));
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
    buildUniqueStashPlan,
    fabrics,
    setFabrics,
    setPreviews,
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

                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <h2 className="text-lg font-semibold mb-3 text-gray-800">Step 2: Choose Quilt Size</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
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

                    {/* Border Configuration */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Would you like to add borders?
                        </label>
                        <button
                          onClick={() => toggleBorders(!borderConfiguration.enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            borderConfiguration.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                          aria-label="Toggle borders"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              borderConfiguration.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {borderConfiguration.enabled && (
                        <div className="space-y-3 mt-3">
                          {/* Border list */}
                          {borderConfiguration.borders.sort((a, b) => a.order - b.order).map((border, index) => {
                            const borderName = getBorderName(border.order, borderConfiguration.borders.length);
                            
                            return (
                              <div key={border.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-700">{borderName}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => reorderBorder(border.id, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                                    aria-label="Move up"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    onClick={() => reorderBorder(border.id, 'down')}
                                    disabled={index === borderConfiguration.borders.length - 1}
                                    className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                                    aria-label="Move down"
                                  >
                                    ↓
                                  </button>
                                  <button
                                    onClick={() => removeBorder(border.id)}
                                    className="p-1 text-red-500 hover:text-red-700 text-xs"
                                    aria-label="Remove"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Width (inches)</label>
                                <input
                                  type="number"
                                  min={0.5}
                                  max={12}
                                  step={0.5}
                                  value={border.width}
                                  onChange={(e) => updateBorder(border.id, { width: parseFloat(e.target.value) })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          );})}

                          {/* Add border button */}
                          {borderConfiguration.borders.length < 3 && (
                            <button
                              onClick={() => addBorder(0)}
                              className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                            >
                              + Add Border ({borderConfiguration.borders.length}/3)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

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

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Or use saved fabrics from your library</h3>
                        <p className="text-sm text-gray-600">Choose previously uploaded fabric photos to include in this quilt.</p>
                      </div>
                      <Link href="/fabrics" className="text-sm text-indigo-700 hover:text-indigo-800 font-medium">
                        Manage Fabric Library
                      </Link>
                    </div>

                    {loadingSavedFabrics ? (
                      <p className="text-sm text-gray-600">Loading saved fabrics...</p>
                    ) : savedFabrics.length === 0 ? (
                      <p className="text-sm text-gray-600">No saved fabric photos yet. Add them in Fabric Library first.</p>
                    ) : (
                      <>
                        {savedFabrics.length > 0 && (
                          <div className="mb-4">
                            <FabricSearchBar
                              onSearchChange={setSavedFabricSearch}
                              placeholder="Search your fabric library..."
                            />
                          </div>
                        )}
                        {filteredSavedFabrics.length === 0 ? (
                          <p className="text-sm text-gray-600">No fabrics match your search.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredSavedFabrics.map((fabric) => {
                          const disabled = addingSavedFabricId === fabric.id || fabrics.length >= effectiveMaxFabrics;
                          return (
                            <div key={fabric.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={fabric.imageUrl || ''}
                                alt={fabric.name}
                                className="w-full h-24 object-cover rounded-md border border-gray-200"
                              />
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-gray-800 truncate" title={fabric.name}>{fabric.name}</p>
                                <button
                                  type="button"
                                  onClick={() => void handleAddSavedFabricToQuilt(fabric)}
                                  disabled={disabled}
                                  className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium disabled:bg-gray-400"
                                >
                                  {addingSavedFabricId === fabric.id ? 'Adding...' : 'Use'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
              generatedFromUniqueMode={patternChoice === 'unique'}
              userTier={profile.subscriptionTier}
              usage={profile.usage}
              fabrics={fabrics}
              previews={previews}
              fabricLabels={currentFabricLabels}
              savedFabrics={savedFabrics}
              liveUpdating={liveUpdating}
              liveUpdateError={liveUpdateError}
              onReplaceFabric={handleReplaceFabricAt}
              onReplaceFabricWithSaved={handleReplaceFabricWithSaved}
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
