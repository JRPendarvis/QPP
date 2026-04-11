"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import { useBorderState } from '@/hooks/useBorderState';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import PatternDisplay from '@/components/upload/PatternDisplay';
import ErrorDisplay from '@/components/upload/ErrorDisplay';
import BlockDesigner, { BlockData } from '@/components/BlockDesigner';
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
import { PatternChoice, PatternDetails } from './utils/types';
import { getBorderName } from '@/utils/borderNaming';
import { formatFabricRange, SKILL_LEVELS } from '@/app/helpers/patternHelpers';

export default function UploadPage() {
  const { user, loading, profile } = useUserProfile();
  const [designMode, setDesignMode] = useState<'ai-pattern' | 'custom-block'>('ai-pattern');
  const [selectedPatternTemplate, setSelectedPatternTemplate] = useState<string>('');
  const [patternTemplates, setPatternTemplates] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingPatternTemplates, setLoadingPatternTemplates] = useState(true);
  const [templateBlockData, setTemplateBlockData] = useState<{ 
    gridSize: number; 
    gridData: string[][]; 
    svgTemplate?: string;
    patternName?: string;
  } | null>(null);
  const [patternChoice, setPatternChoice] = useState<PatternChoice>('auto');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [challengeMe, setChallengeMe] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fabricRoles, setFabricRoles] = useState<string[]>([]);
  const [quiltSize, setQuiltSize] = useState<string>('');

  // Fetch pattern templates for custom block design
  useEffect(() => {
    async function fetchPatternTemplates() {
      try {
        const response = await api.get('/api/blocks/pattern-templates');
        if (response.data.success && response.data.data) {
          setPatternTemplates(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch pattern templates:', error);
      } finally {
        setLoadingPatternTemplates(false);
      }
    }
    fetchPatternTemplates();
  }, []);

  // Fetch selected pattern template block structure
  useEffect(() => {
    async function fetchTemplateBlockData() {
      if (!selectedPatternTemplate) {
        setTemplateBlockData(null);
        return;
      }

      try {
        const response = await api.get(`/api/blocks/pattern-templates/${selectedPatternTemplate}`);
        if (response.data.success && response.data.data) {
          console.log('Loaded template data:', response.data.data);
          setTemplateBlockData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch template block data:', error);
      }
    }
    fetchTemplateBlockData();
  }, [selectedPatternTemplate]);

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

  // Calculate effective max fabrics including border fabrics
  const borderFabricsNeeded = borderConfiguration.enabled ? borderConfiguration.borders.length : 0;
  const effectiveMaxFabrics = (selectedPatternDetails?.maxFabrics ?? MAX_FABRICS) + borderFabricsNeeded;

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

  const handleAIRearrange = (assignments: { background?: string; primary?: string; secondary?: string; accent?: string }) => {
    // Create a map of filename to index for quick lookup
    const fabricIndexMap = new Map<string, number>();
    fabrics.forEach((fabric, index) => {
      fabricIndexMap.set(fabric.name, index);
    });

    // Build ordered list of indices based on AI recommendations
    const orderedIndices: number[] = [];
    const usedIndices = new Set<number>();

    // Add in priority order: background, primary, secondary, accent
    const roles = ['background', 'primary', 'secondary', 'accent'] as const;
    for (const role of roles) {
      const filename = assignments[role];
      if (filename) {
        const index = fabricIndexMap.get(filename);
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

  const handleBlockDesignComplete = async (blockData: BlockData) => {
    setGenerating(true);
    const loadingToast = toast.loading('Saving your block and generating pattern...');

    try {
      // First, save the block
      const fabricAssignments = {
        background: previews[0] || null,
        primary: previews[1] || null,
        secondary: previews[2] || null,
        accent: previews[3] || null,
      };

      const blockResponse = await api.post('/api/blocks', {
        ...blockData,
        blockSize: templateBlockData ? templateBlockData.gridSize * templateBlockData.gridSize : 9,
      });

      if (!blockResponse.data.success) {
        throw new Error('Failed to save block');
      }

      const savedBlock = blockResponse.data.data;

      // Then generate a quilt pattern from it
      const patternResponse = await api.post(`/api/blocks/${savedBlock.id}/generate-pattern`, {
        quiltWidth: 5,
        quiltHeight: 5,
        fabricAssignments,
      });

      if (patternResponse.data.success) {
        toast.success('Block saved and pattern generated!', { id: loadingToast });
        // Redirect to library to view the pattern
        setTimeout(() => {
          window.location.href = '/library';
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate pattern', { id: loadingToast });
      console.error('Block generation error:', error);
    } finally {
      setGenerating(false);
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

      <div className="py-8 px-4" style={{backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="max-w-7xl mx-auto">
          <UploadHeader />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          
          {/* Design Mode Selection */}
          <div className="mb-8 border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Design Method</h2>
            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50" 
                style={{
                  borderColor: designMode === 'ai-pattern' ? '#B91C1C' : '#E5E7EB',
                  backgroundColor: designMode === 'ai-pattern' ? '#FEF2F2' : 'white'
                }}>
                <input
                  type="radio"
                  name="designMode"
                  value="ai-pattern"
                  checked={designMode === 'ai-pattern'}
                  onChange={(e) => setDesignMode(e.target.value as 'ai-pattern' | 'custom-block')}
                  className="mt-1 h-4 w-4 text-red-700 focus:ring-red-700"
                  style={{accentColor: '#B91C1C'}}
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">AI-Generated Quilt Pattern</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Upload your fabrics and let AI create a complete quilt pattern from traditional designs
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                style={{
                  borderColor: designMode === 'custom-block' ? '#B91C1C' : '#E5E7EB',
                  backgroundColor: designMode === 'custom-block' ? '#FEF2F2' : 'white'
                }}>
                <input
                  type="radio"
                  name="designMode"
                  value="custom-block"
                  checked={designMode === 'custom-block'}
                  onChange={(e) => setDesignMode(e.target.value as 'ai-pattern' | 'custom-block')}
                  className="mt-1 h-4 w-4 text-red-700 focus:ring-red-700"
                  style={{accentColor: '#B91C1C'}}
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Custom Block Design</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Design your own quilt block in a grid, then use it to create a repeating quilt pattern
                  </div>
                </div>
              </label>
            </div>
          </div>

          <ErrorDisplay error={error} />

          {!pattern && (
            <>
              {designMode === 'ai-pattern' ? (
                // AI Pattern Mode - Original Flow
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <PatternSelectionSection
                      patternChoice={patternChoice}
                      setPatternChoice={handlePatternChoiceChange}
                      selectedPattern={selectedPattern}
                      setSelectedPattern={setSelectedPattern}
                      availablePatterns={availablePatterns}
                      selectedPatternDetails={selectedPatternDetails}
                      fabricsLength={fabrics.length}
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
                </div>
              </div>

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
                    onAIRearrange={handleAIRearrange}
                    fabricRoles={fabricRoles.length > 0 ? fabricRoles : undefined}
                    borderConfiguration={borderConfiguration}
                  />
                </div>
              )}

              <ValidationMessage 
                message={fabricValidationMessage && fabrics.length > 0 ? fabricValidationMessage : null} 
              />
            </>
              ) : (
                // Custom Block Design Mode
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <h2 className="text-lg font-semibold mb-3 text-gray-800">Step 1: Choose Pattern Template</h2>
                      <div className="space-y-3">
                        <label className="block text-sm text-gray-600 mb-2">
                          Select a pattern block to use as your starting template
                        </label>
                        {loadingPatternTemplates ? (
                          <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500">
                            Loading pattern templates...
                          </div>
                        ) : (
                          <select
                            value={selectedPatternTemplate}
                            onChange={(e) => setSelectedPatternTemplate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="">Select a pattern block...</option>
                            {patternTemplates.map((template) => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedPatternTemplate 
                            ? `Use the ${patternTemplates.find(t => t.id === selectedPatternTemplate)?.name} block as your starting design`
                            : 'Choose a pattern to load its block structure'}
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-3">
                        Step 2: Upload Your Fabric Images
                      </h2>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload 2-4 fabrics to use in your block design
                      </p>
                      <FabricDropzone
                        onFilesAdded={handleFilesAddedWrapper}
                        currentCount={fabrics.length}
                        maxFiles={4}
                        totalSize={totalImageSize}
                      />
                    </div>
                  </div>

                  {fabrics.length > 0 && (
                    <div className="my-6">
                      <FabricPreviewGrid
                        previews={previews}
                        fabrics={fabrics}
                        onRemove={removeFabric}
                        onClearAll={clearAll}
                        onReorder={handleFabricReorder}
                      />
                    </div>
                  )}

                  {fabrics.length >= 2 && selectedPatternTemplate && templateBlockData && (
                    <div className="mt-6">
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                          📋 Pattern Template: {templateBlockData.patternName}
                        </p>
                        <p className="text-xs text-blue-700">
                          Preview shows the actual pattern with your fabrics.
                        </p>
                      </div>

                      {/* SVG Pattern Preview */}
                      {templateBlockData.svgTemplate && fabrics.length >= 2 && (
                        <div className="flex justify-center">
                          <div className="border-4 border-gray-800 rounded-lg overflow-hidden" style={{ width: '300px', height: '300px' }}>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}
                              dangerouslySetInnerHTML={{
                                __html: templateBlockData.svgTemplate
                                  .replace(/COLOR1/g, previews[0] ? `url(#bg-${Date.now()})` : '#D1D5DB')
                                  .replace(/COLOR2/g, previews[1] ? `url(#primary-${Date.now()})` : '#9CA3AF')
                                  .replace(/COLOR3/g, previews[2] ? `url(#secondary-${Date.now()})` : '#FDE047')
                                  .replace(/COLOR4/g, previews[3] ? `url(#accent-${Date.now()})` : '#F59E0B') +
                                  (previews[0] ? `<defs><pattern id="bg-${Date.now()}" patternUnits="userSpaceOnUse" width="100" height="100"><image href="${previews[0]}" width="100" height="100"/></pattern></defs>` : '') +
                                  (previews[1] ? `<defs><pattern id="primary-${Date.now()}" patternUnits="userSpaceOnUse" width="100" height="100"><image href="${previews[1]}" width="100" height="100"/></pattern></defs>` : '') +
                                  (previews[2] ? `<defs><pattern id="secondary-${Date.now()}" patternUnits="userSpaceOnUse" width="100" height="100"><image href="${previews[2]}" width="100" height="100"/></pattern></defs>` : '') +
                                  (previews[3] ? `<defs><pattern id="accent-${Date.now()}" patternUnits="userSpaceOnUse" width="100" height="100"><image href="${previews[3]}" width="100" height="100"/></pattern></defs>` : '')
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
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
