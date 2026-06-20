'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import PatternVisualization from './PatternVisualization';
import PatternMetadata from './PatternMetadata';
import PatternInstructions from './PatternInstructions';
import DownloadSection from './DownloadSection';
import ErrorStates from './ErrorStates';

interface SavedFabricOption {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface QuiltPattern {
  id?: string;
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
  fabricRequirements?: Array<{
    role: string;
    yards: number;
    description: string;
    inches?: number;
  }>;
  autoSelection?: {
    selectedBy: 'ai' | 'deterministic';
    reason?: string;
    targetSkillLevel?: string;
  };
  selectionRationale?: {
    mode: 'unique';
    reason?: string;
    targetSkillLevel?: string;
  };
  meta?: {
    isUnique?: boolean;
    uniqueVersion?: string;
    localOnly?: boolean;
  };
}

const DEFAULT_REQUIREMENT_ROLES = ['Background', 'Primary', 'Secondary', 'Accent'];

function buildDisplayFabricRequirements(pattern: QuiltPattern, fabricCount: number) {
  if (pattern.fabricRequirements && pattern.fabricRequirements.length > 0) {
    return pattern.fabricRequirements;
  }

  const requirementCount = Math.max(1, Math.min(fabricCount || 4, DEFAULT_REQUIREMENT_ROLES.length));
  const splits = [0.45, 0.3, 0.15, 0.1];
  const estimatedTotalYards = 4.5;

  return Array.from({ length: requirementCount }, (_, index) => {
    const role = DEFAULT_REQUIREMENT_ROLES[index] || `Fabric ${index + 1}`;
    const split = splits[index] || (1 / requirementCount);

    return {
      role,
      yards: Math.max(0.25, Number((estimatedTotalYards * split).toFixed(2))),
      description: `${role} fabric for this quilt layout.`,
    };
  });
}

function parseEstimatedSize(value?: string): { width: number; height: number } | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace(/inches|inch|"/g, '').trim();
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return null;
  }

  return { width, height };
}

function formatEstimatedSize(width: number, height: number): string {
  return `${Math.max(20, Math.round(width))}x${Math.max(20, Math.round(height))} inches`;
}

interface Usage {
  credits: {
    used: number;
    limit: number;
    remaining: number;
  };
  downloads: {
    used: number;
    limit: number;
    remaining: number;
  };
  resetDate?: string;
  daysUntilReset?: number;
}

interface PatternDisplayProps {
  pattern: QuiltPattern;
  generatedFromUniqueMode?: boolean;
  userTier: string;
  usage?: Usage;
  fabrics: File[];
  previews: string[];
  fabricLabels?: string[];
  fabricYardageRefs?: Array<{ name: string; yardageAvailable: number | null } | null>;
  generationAdjustmentSummary?: string[];
  savedFabrics: SavedFabricOption[];
  liveUpdating?: boolean;
  liveUpdateError?: string | null;
  onReplaceFabric: (index: number, file: File) => void;
  onReplaceFabricWithSaved: (index: number, savedFabricId: string) => void;
  onRemoveFabric: (index: number) => void;
  onMoveFabric: (fromIdx: number, toIdx: number) => void;
  onStartOver: () => void;
}

export default function PatternDisplay({
  pattern,
  generatedFromUniqueMode = false,
  userTier,
  usage,
  fabrics,
  previews,
  fabricLabels,
  fabricYardageRefs = [],
  generationAdjustmentSummary = [],
  savedFabrics,
  liveUpdating = false,
  liveUpdateError = null,
  onReplaceFabric,
  onReplaceFabricWithSaved,
  onRemoveFabric,
  onMoveFabric,
  onStartOver,
}: PatternDisplayProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSavedByIndex, setSelectedSavedByIndex] = useState<Record<number, string>>({});
  const [canUseCameraCapture, setCanUseCameraCapture] = useState(false);
  const galleryInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const cameraInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasTouch = navigator.maxTouchPoints > 0;
    setCanUseCameraCapture(coarsePointer || hasTouch);
  }, []);

  const hasDownloadsRemaining = usage?.downloads?.remaining
    ? usage.downloads.remaining > 0
    : true;
  const isLocalFallback = Boolean(pattern.meta?.localOnly);
  const displayDescription = pattern.description?.trim() || 'A custom quilt layout generated from your selected fabrics and skill level.';
  const displayFabricRequirements = buildDisplayFabricRequirements(pattern, previews.length);
  const availabilityCheck = useMemo(() => {
    const mapped: Array<{ role: string; requiredYards: number; availableYards: number; shortageYards: number; name: string }> = [];
    const buyAsNeededRoles: string[] = [];

    displayFabricRequirements.forEach((requirement, index) => {
      const yardageRef = fabricYardageRefs[index];
      if (!yardageRef || yardageRef.yardageAvailable === null) {
        buyAsNeededRoles.push(requirement.role);
        return;
      }

      const shortageYards = Math.max(0, Number((requirement.yards - yardageRef.yardageAvailable).toFixed(2)));
      mapped.push({
        role: requirement.role,
        requiredYards: requirement.yards,
        availableYards: yardageRef.yardageAvailable,
        shortageYards,
        name: yardageRef.name,
      });
    });

    const buyAsNeededCount = buyAsNeededRoles.length;
    if (mapped.length === 0 && buyAsNeededCount <= 0) {
      return null;
    }

    const totalRequired = Number(mapped.reduce((sum, item) => sum + item.requiredYards, 0).toFixed(2));
    const totalAvailable = Number(mapped.reduce((sum, item) => sum + item.availableYards, 0).toFixed(2));
    const totalShortage = Number(mapped.reduce((sum, item) => sum + item.shortageYards, 0).toFixed(2));

    return {
      mapped,
      totalRequired,
      totalAvailable,
      totalShortage,
      hasShortage: totalShortage > 0,
      hasPartialCoverage: mapped.length < displayFabricRequirements.length,
      buyAsNeededCount,
      buyAsNeededRoles,
    };
  }, [displayFabricRequirements, fabricYardageRefs]);
  const fitToAvailable = useMemo(() => {
    if (!availabilityCheck || !availabilityCheck.hasShortage) {
      return null;
    }

    const ratioValues = availabilityCheck.mapped
      .filter((item) => item.requiredYards > 0)
      .map((item) => item.availableYards / item.requiredYards);

    if (ratioValues.length === 0) {
      return null;
    }

    const fitRatio = Math.max(0.35, Math.min(1, Math.min(...ratioValues)));
    const fittedRequirements = displayFabricRequirements.map((requirement, index) => {
      const mapped = availabilityCheck.mapped.find((item) => item.role === requirement.role);
      if (!mapped) {
        return {
          ...requirement,
          yards: Math.max(0.25, Number((requirement.yards * fitRatio).toFixed(2))),
        };
      }

      return {
        ...requirement,
        yards: Math.max(0.25, Number(Math.min(requirement.yards, mapped.availableYards).toFixed(2))),
      };
    });

    const parsedSize = parseEstimatedSize(pattern.estimatedSize);
    const dimensionScale = Math.sqrt(fitRatio);
    const fittedSize = parsedSize
      ? formatEstimatedSize(parsedSize.width * dimensionScale, parsedSize.height * dimensionScale)
      : pattern.estimatedSize;

    return {
      fitRatio,
      fittedRequirements,
      fittedSize,
    };
  }, [availabilityCheck, displayFabricRequirements, pattern.estimatedSize]);
  const activeFabricRequirements = fitToAvailable?.fittedRequirements || displayFabricRequirements;
  const activeEstimatedSize = fitToAvailable?.fittedSize || pattern.estimatedSize;
  const activeAvailabilityCheck = useMemo(() => {
    const mapped: Array<{ role: string; requiredYards: number; availableYards: number; shortageYards: number; name: string }> = [];
    const buyAsNeededRoles: string[] = [];

    activeFabricRequirements.forEach((requirement, index) => {
      const yardageRef = fabricYardageRefs[index];
      if (!yardageRef || yardageRef.yardageAvailable === null) {
        buyAsNeededRoles.push(requirement.role);
        return;
      }

      const shortageYards = Math.max(0, Number((requirement.yards - yardageRef.yardageAvailable).toFixed(2)));
      mapped.push({
        role: requirement.role,
        requiredYards: requirement.yards,
        availableYards: yardageRef.yardageAvailable,
        shortageYards,
        name: yardageRef.name,
      });
    });

    const buyAsNeededCount = buyAsNeededRoles.length;
    if (mapped.length === 0 && buyAsNeededCount <= 0) {
      return null;
    }

    const totalRequired = Number(mapped.reduce((sum, item) => sum + item.requiredYards, 0).toFixed(2));
    const totalAvailable = Number(mapped.reduce((sum, item) => sum + item.availableYards, 0).toFixed(2));
    const totalShortage = Number(mapped.reduce((sum, item) => sum + item.shortageYards, 0).toFixed(2));

    return {
      mapped,
      totalRequired,
      totalAvailable,
      totalShortage,
      hasShortage: totalShortage > 0,
      hasPartialCoverage: mapped.length < activeFabricRequirements.length,
      buyAsNeededCount,
      buyAsNeededRoles,
    };
  }, [activeFabricRequirements, fabricYardageRefs]);
  const requirementStatuses = useMemo(() => {
    return activeFabricRequirements.map((requirement, index) => {
      const yardageRef = fabricYardageRefs[index];
      if (!yardageRef || yardageRef.yardageAvailable === null) {
        return {
          mode: 'buy' as const,
          text: 'Buy as needed',
        };
      }

      const shortage = Math.max(0, Number((requirement.yards - yardageRef.yardageAvailable).toFixed(2)));
      if (shortage > 0) {
        return {
          mode: 'short' as const,
          text: `Have ${yardageRef.yardageAvailable.toFixed(2)} yd | Short ${shortage.toFixed(2)} yd`,
        };
      }

      return {
        mode: 'enough' as const,
        text: `Have ${yardageRef.yardageAvailable.toFixed(2)} yd | Enough`,
      };
    });
  }, [activeFabricRequirements, fabricYardageRefs]);

  const shouldShowAutoSelection = Boolean(pattern.autoSelection) && !generatedFromUniqueMode && !pattern.meta?.isUnique;
  const shouldShowUniqueRationale = (generatedFromUniqueMode || pattern.meta?.isUnique) && Boolean(pattern.selectionRationale);

  const handleDownload = async () => {
    if (!pattern.id) {
      setError(isLocalFallback
        ? 'Download unavailable for local fallback preview. Regenerate to create a downloadable pattern.'
        : 'Cannot download: No pattern ID available');
      return;
    }

    if (!hasDownloadsRemaining) {
      router.push('/pricing');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to download patterns');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patterns/${pattern.id}/download`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pattern.patternName.replace(/\s+/g, '_')}_Pattern.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Refresh the page to update usage counts
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Your Custom Pattern is Ready!
        </h2>
        {pattern.meta?.isUnique && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-2">
            Unique Quilt
          </span>
        )}
        <p className="text-gray-600">
          Review your pattern below or download the complete PDF with full instructions
        </p>
      </div>

      {shouldShowAutoSelection && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-indigo-900 mb-1">
            Why QuiltPlannerPro chose this pattern
          </p>
          <p className="text-sm text-indigo-800">
            {pattern.autoSelection.reason || 'Pattern selected using deterministic logic based on your fabrics and skill level.'}
          </p>
          {pattern.autoSelection.targetSkillLevel && (
            <p className="text-xs text-indigo-700 mt-1">
              Target skill level used: {pattern.autoSelection.targetSkillLevel}
            </p>
          )}
        </div>
      )}

      {shouldShowUniqueRationale && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-emerald-900 mb-1">
            Why QuiltPlannerPro generated this unique quilt
          </p>
          <p className="text-sm text-emerald-800">
            {pattern.selectionRationale?.reason || 'Generated from your fabrics and skill level without using a catalog pattern.'}
          </p>
          {pattern.selectionRationale?.targetSkillLevel && (
            <p className="text-xs text-emerald-700 mt-1">
              Target skill level used: {pattern.selectionRationale.targetSkillLevel}
            </p>
          )}
        </div>
      )}

      {generationAdjustmentSummary.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">Automatic stash-fit adjustments</p>
          <div className="space-y-1">
            {generationAdjustmentSummary.map((note, index) => (
              <p key={index} className="text-sm text-blue-800">• {note}</p>
            ))}
          </div>
        </div>
      )}

      {/* Error States */}
      <ErrorStates error={error} patternData={pattern} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Pattern Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{pattern.patternName}</h3>
          <PatternVisualization visualSvg={pattern.visualSvg} patternName={pattern.patternName} />
        </div>

        {/* Live Fabric Swap */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Live Fabric Swap</h3>
              <p className="text-sm text-gray-600 mt-1">
                Replace, remove, or reorder fabrics here. Your pattern updates automatically.
              </p>
            </div>
            {liveUpdating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                Updating pattern...
              </span>
            )}
          </div>

          {liveUpdateError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {liveUpdateError}
            </div>
          )}

          <div className="overflow-y-auto pr-1" style={{ maxHeight: '980px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previews.map((preview, index) => {
                const label = fabricLabels?.[index] || `Fabric ${index + 1}`;
                const isFirst = index === 0;
                const isLast = index === previews.length - 1;

                return (
                  <div key={`${preview}-${index}`} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 mb-2">{label}</p>
                    <div className="aspect-square rounded-md overflow-hidden border border-gray-200 mb-2">
                      <Image
                        src={preview}
                        alt={fabrics[index]?.name || `Fabric ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-3" title={fabrics[index]?.name || `Fabric ${index + 1}`}>
                      {fabrics[index]?.name || `Fabric ${index + 1}`}
                    </p>

                    <div className="space-y-2">
                      <div className={`grid gap-2 ${canUseCameraCapture ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <button
                          type="button"
                          disabled={liveUpdating}
                          onClick={() => galleryInputRefs.current[index]?.click()}
                          className="w-full inline-flex justify-center items-center px-3 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          Choose From Library
                        </button>
                        {canUseCameraCapture && (
                          <button
                            type="button"
                            disabled={liveUpdating}
                            onClick={() => cameraInputRefs.current[index]?.click()}
                            className="w-full inline-flex justify-center items-center px-3 py-2 rounded-md bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                          >
                            Open Camera
                          </button>
                        )}
                      </div>
                      {canUseCameraCapture && (
                        <p className="text-[11px] text-gray-500">Use Open Camera for a fresh shot, or Choose From Library for an existing photo.</p>
                      )}
                      <input
                        ref={(el) => {
                          galleryInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={liveUpdating}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            onReplaceFabric(index, file);
                          }
                          event.currentTarget.value = '';
                        }}
                      />
                      {canUseCameraCapture && (
                        <input
                          ref={(el) => {
                            cameraInputRefs.current[index] = el;
                          }}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          disabled={liveUpdating}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              onReplaceFabric(index, file);
                            }
                            event.currentTarget.value = '';
                          }}
                        />
                      )}

                      <div className="space-y-1">
                        <select
                          value={selectedSavedByIndex[index] || ''}
                          disabled={liveUpdating || savedFabrics.length === 0}
                          onChange={(event) => {
                            const selectedId = event.target.value;
                            setSelectedSavedByIndex((prev) => ({
                              ...prev,
                              [index]: selectedId,
                            }));
                          }}
                          className="w-full px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 disabled:bg-gray-100"
                        >
                          <option value="">Choose saved fabric</option>
                          {savedFabrics.map((savedFabric) => (
                            <option key={savedFabric.id} value={savedFabric.id}>
                              {savedFabric.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectedSaved = selectedSavedByIndex[index];
                            if (selectedSaved) {
                              onReplaceFabricWithSaved(index, selectedSaved);
                            }
                          }}
                          disabled={liveUpdating || !selectedSavedByIndex[index] || savedFabrics.length === 0}
                          className="w-full px-2 py-1 rounded border border-indigo-300 text-xs text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Use Saved
                        </button>
                        {savedFabrics.length === 0 && (
                          <p className="text-[11px] text-gray-500">No saved fabrics in library yet.</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => onMoveFabric(index, index - 1)}
                          disabled={liveUpdating || isFirst}
                          className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Left
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveFabric(index, index + 1)}
                          disabled={liveUpdating || isLast}
                          className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Right
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveFabric(index)}
                          disabled={liveUpdating || previews.length <= 1}
                          className="px-2 py-1 rounded border border-red-300 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Metadata */}
      <PatternMetadata
        difficulty={pattern.difficulty}
        estimatedSize={activeEstimatedSize}
        description={displayDescription}
        fabricLayout={pattern.fabricLayout}
      />

      {fitToAvailable && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-teal-900 mb-1">Auto-fit to your available fabric</p>
          <p className="text-sm text-teal-800">
            Requirements were scaled to match your entered yardage. Estimated quilt size was adjusted to approximately {fitToAvailable.fittedSize}.
          </p>
        </div>
      )}

      {/* Fabric Requirements */}
      {activeFabricRequirements.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🧵 Fabric Requirements</h3>
          <p className="text-sm text-gray-600 mb-4">
            Fabric amounts based on 42" usable width with 15% extra for seam allowances
          </p>
          <div className="space-y-3">
            {activeFabricRequirements.map((req, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{req.role}:</span>
                  <span className="text-gray-600 ml-2 text-sm">{req.description}</span>
                  <p className={`text-xs mt-1 ${
                    requirementStatuses[idx]?.mode === 'short'
                      ? 'text-amber-700'
                      : requirementStatuses[idx]?.mode === 'enough'
                        ? 'text-emerald-700'
                        : 'text-gray-500'
                  }`}>
                    {requirementStatuses[idx]?.text}
                  </p>
                </div>
                <span className="font-bold text-indigo-600 ml-4 whitespace-nowrap">
                  {req.inches ? `${req.inches}"` : `${req.yards} yards`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              💡 <strong>Shopping Tip:</strong> These amounts include extra fabric for mistakes and seam allowances. 
              Always verify fabric availability before cutting!
            </p>
          </div>
        </div>
      )}

      {availabilityCheck && (
        <div className={`rounded-lg border p-6 ${availabilityCheck.hasShortage ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fabric Availability Check</h3>
          <p className="text-sm text-gray-700 mb-4">
            Compared required yardage to your entered yardage values for uploaded fabrics.
          </p>
          <div className="space-y-2 mb-4">
            {activeAvailabilityCheck.mapped.map((item, index) => (
              <div key={`${item.role}-${index}`} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                <span className="text-gray-800">
                  <strong>{item.role}</strong> ({item.name})
                </span>
                <span className={item.shortageYards > 0 ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                  Need {item.requiredYards.toFixed(2)} yd | Have {item.availableYards.toFixed(2)} yd
                  {item.shortageYards > 0 ? ` | Short ${item.shortageYards.toFixed(2)} yd` : ' | Enough'}
                </span>
              </div>
            ))}
          </div>
          {activeAvailabilityCheck.mapped.length > 0 && (
            <p className="text-sm text-gray-800">
              Total required: <strong>{activeAvailabilityCheck.totalRequired.toFixed(2)} yd</strong> | Total available: <strong>{activeAvailabilityCheck.totalAvailable.toFixed(2)} yd</strong>
            </p>
          )}
          {activeAvailabilityCheck.hasShortage ? (
            <p className="text-sm text-amber-800 mt-2 font-medium">
              You are short by {activeAvailabilityCheck.totalShortage.toFixed(2)} yd across mapped fabrics. Consider swapping fabrics, changing quilt size, or adding yardage.
            </p>
          ) : (
            <p className="text-sm text-emerald-800 mt-2 font-medium">
              Great news: entered yardage is enough for the current requirement estimate.
            </p>
          )}
          {activeAvailabilityCheck.buyAsNeededCount > 0 && (
            <p className="text-sm text-gray-700 mt-2">
              {activeAvailabilityCheck.buyAsNeededCount} fabric role(s) are set to buy-as-needed (blank yardage), so the app is showing how much you need rather than enforcing limits.
            </p>
          )}
          {activeAvailabilityCheck.buyAsNeededRoles.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              Buy-as-needed roles: {activeAvailabilityCheck.buyAsNeededRoles.join(', ')}.
            </p>
          )}
          {activeAvailabilityCheck.hasPartialCoverage && (
            <p className="text-xs text-gray-600 mt-2">
              You can enter yardage on each uploaded fabric card to enforce stash limits, or leave blank to buy as needed.
            </p>
          )}
        </div>
      )}

      {/* Pattern Instructions */}
      <PatternInstructions
        instructions={pattern.instructions}
        onDownload={handleDownload}
        downloading={downloading}
        patternId={pattern.id}
      />

      {/* Download Section */}
      <DownloadSection
        onDownload={handleDownload}
        downloading={downloading}
        patternId={pattern.id}
        isLocalFallback={isLocalFallback}
        userTier={userTier}
        downloadsRemaining={usage?.downloads?.remaining}
      />

      {/* Start Over Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartOver}
          className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
        >
          ← Start Over (Create New Pattern)
        </button>
      </div>
    </div>
  );
}
