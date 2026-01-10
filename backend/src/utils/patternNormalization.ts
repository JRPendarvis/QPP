// src/utils/patternNormalization.ts

import { getAllPatterns } from '../config/patterns';

/**
 * Get valid pattern IDs from the pattern registry
 */
export function getValidPatternIds(): string[] {
  return ['auto', ...getAllPatterns().map((p) => p.id)];
}

/**
 * Normalize pattern input to ID format
 * Handles both IDs ('strip-quilt') and display names ('Strip Quilt')
 */
export function normalizePatternId(input: string | undefined): string {
  if (!input || input === 'auto') return 'auto';

  const validIds = getValidPatternIds();
  if (validIds.includes(input)) {
    return input;
  }

  const normalizedId = input
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/\s+/g, '-') // Spaces to dashes
    .replace(/--+/g, '-'); // Collapse multiple dashes

  if (validIds.includes(normalizedId)) {
    console.log(`📋 Normalized pattern: "${input}" -> "${normalizedId}"`);
    return normalizedId;
  }

  console.warn(`⚠️ Unknown pattern: "${input}" (normalized: "${normalizedId}") - falling back to auto`);
  return 'auto';
}

/**
 * Resolve patternId for deterministic instruction generation
 * Maps user-friendly pattern names to their canonical IDs
 */
export function resolvePatternIdForDeterministic(patternToUse: string, claudePattern: any): string {
  // If user explicitly chose a known pattern, use it
  if (patternToUse && patternToUse !== 'auto') {
    return patternToUse;
  }

  // Otherwise extract from Claude's LLM output
  const llmName = String(claudePattern?.patternName || '')
    .trim()
    .toLowerCase();

  if (llmName.includes('bow') && llmName.includes('tie')) return 'bow-tie';
  if (llmName.includes('pinwheel')) return 'pinwheel';

  // Default fallback
  return patternToUse || 'auto';
}
