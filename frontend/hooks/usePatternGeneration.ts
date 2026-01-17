"use client";
import { useState, useCallback } from 'react';
import { useFabricState, MAX_FABRICS, MIN_FABRICS } from './useFabricState';
import { QuiltPattern, UsePatternGenerationReturn } from '@/types';
import { PatternStateManager } from '@/utils/patternStateManager';
import { PatternGenerationWorkflow } from '@/services/patternGenerationWorkflow';
import { WorkflowCallbackFactory } from '@/utils/workflowCallbackFactory';

/**
 * Pattern Generation Hook
 * 
 * Manages the complete workflow for generating quilt patterns from fabric images,
 * including fabric upload, validation, API communication, and state management.
 * 
 * @returns {UsePatternGenerationReturn} Pattern generation state and actions
 * 
 * @example
 * ```tsx
 * const {
 *   fabrics,
 *   handleFilesAdded,
 *   generatePattern,
 *   pattern,
 *   generating,
 *   error
 * } = usePatternGeneration();
 * 
 * // Upload fabrics
 * handleFilesAdded(files);
 * 
 * // Generate pattern
 * await generatePattern('intermediate', false, 'strip-quilt');
 * ```
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: State management and coordination only
 * - Dependency Inversion: Depends on workflow and service abstractions
 * - Open/Closed: Extend by modifying services, not this hook
 */
export function usePatternGeneration(): UsePatternGenerationReturn {
  const fabricState = useFabricState();
  const [generating, setGenerating] = useState(false);
  const [pattern, setPattern] = useState<QuiltPattern | null>(null);
  const [error, setError] = useState('');

  /**
   * Clear all state (fabrics and pattern)
   */
  const clearAll = useCallback(() => {
    fabricState.clearAll();
    setPattern(null);
    setError('');
  }, [fabricState]);

  /**
   * Reset pattern only while keeping fabrics for regeneration
   */
  const resetPattern = useCallback(() => {
    PatternStateManager.resetWithScroll(
      fabricState.fabrics.length,
      setPattern,
      setError,
      setGenerating
    );
  }, [fabricState.fabrics.length]);

  /**
   * Generate a quilt pattern from uploaded fabrics
   * 
   * @param userSkillLevel - Target skill level for the pattern
   * @param challengeMe - Whether to increase difficulty by one level
   * @param selectedPattern - Optional specific pattern ID to generate
   * @param quiltSize - Optional desired quilt size
   * @param borders - Optional border configuration
   */
  const generatePattern = useCallback(
    async (userSkillLevel: string, challengeMe: boolean, selectedPattern?: string, quiltSize?: string, borders?: any) => {
      const callbacks = WorkflowCallbackFactory.createPatternCallbacks(
        setGenerating,
        setError,
        setPattern
      );
      
      await PatternGenerationWorkflow.execute(
        fabricState.fabrics,
        userSkillLevel,
        challengeMe,
        selectedPattern,
        quiltSize,
        borders,
        callbacks
      );
    },
    [fabricState.fabrics]
  );

  return {
    // Fabric state
    fabrics: fabricState.fabrics,
    previews: fabricState.previews,
    handleFilesAdded: fabricState.handleFilesAdded,
    removeFabric: fabricState.removeFabric,
    setFabrics: fabricState.setFabrics,
    setPreviews: fabricState.setPreviews,
    
    // Pattern state
    generating,
    pattern,
    error,
    
    // Constants
    MAX_FABRICS,
    MIN_FABRICS,
    
    // Actions
    clearAll,
    resetPattern,
    generatePattern,
  };
}