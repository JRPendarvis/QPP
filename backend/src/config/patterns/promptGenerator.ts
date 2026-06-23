/**
 * Pattern Prompt Generator and Documentation
 *
 * This module provides helpers and guidance for creating consistent pattern prompts.
 * All pattern prompts should use the createPatternPrompt() factory to ensure type safety.
 */

import type { PatternPrompt } from '../../types/PatternPrompt';

/**
 * Factory function to create a pattern prompt with proper type checking.
 *
 * Use this when creating new pattern prompt files to ensure all required fields are present
 * and properly typed. This reduces boilerplate and catches missing fields at compile time.
 */
export function createPatternPrompt(data: PatternPrompt): PatternPrompt {
  return {
    patternName: data.patternName,
    recommendedFabricCount: data.recommendedFabricCount,
    characteristics: data.characteristics,
    fabricRoleGuidance: data.fabricRoleGuidance,
    cuttingInstructions: data.cuttingInstructions,
    assemblyNotes: data.assemblyNotes,
    commonMistakes: data.commonMistakes,
  };
}

// Backward-compatible export consumed by promptSchema.ts.
export const PATTERN_PROMPT_CREATION_GUIDE = {
  steps: [
    'Create prompt file under backend/src/config/patterns/{pattern-id}/prompt.ts',
    'Use createPatternPrompt() with all required fields',
    'Keep content specific to pattern geometry and fabric roles',
    'Include practical cutting and assembly notes for quilters',
  ],
} as const;

/**
 * Checklist for creating new pattern prompts:
 *
 * 1) Create prompt file: backend/src/config/patterns/{pattern-id}/prompt.ts
 * 2) Use createPatternPrompt() with all required fields
 * 3) Keep each section specific to the pattern's geometry and fabric roles
 * 4) Include practical cutting and assembly details for quilters
 */
