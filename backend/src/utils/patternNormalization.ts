// src/utils/patternNormalization.ts

import { getAllPatterns } from '../config/patterns';

/**
 * Normalize pattern input to ID format.
 * Handles both IDs ('strip-quilt') and display names ('Strip Quilt')
 *
 * IMPORTANT:
 * - This MUST be the single source of truth.
 * - Export BOTH named + default to avoid import mismatches.
 */
export function normalizePatternId(input: string | undefined): string {
  if (!input || input === 'auto') return 'auto';

  const validIds = ['auto', ...getAllPatterns().map((p) => p.id)];

  // Already in ID format?
  if (validIds.includes(input)) return input;

  // Convert display name -> id
  // "Drunkard's Path" -> 'drunkards-path'
  const normalizedId = String(input)
    .toLowerCase()
    .replace(/['’]/g, '')   // remove apostrophes (both types)
    .replace(/\s+/g, '-')   // spaces -> dash
    .replace(/--+/g, '-');  // collapse repeated dashes

  if (validIds.includes(normalizedId)) {
    console.log(`📋 Normalized pattern: "${input}" -> "${normalizedId}"`);
    return normalizedId;
  }

  console.warn(`⚠️ Unknown pattern: "${input}" (normalized: "${normalizedId}") - falling back to auto`);
  return 'auto';
}

// Also provide default export to prevent runtime mismatches.
export default normalizePatternId;
