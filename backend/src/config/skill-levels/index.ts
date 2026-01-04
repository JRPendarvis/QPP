/**
 * Skill Level Configuration
 * Consolidates skill level descriptions and pattern mappings
 */

import { getAllPatterns } from '../patterns';

/**
 * Skill Level Descriptions for Quilting
 * Defines the characteristics and capabilities for each skill level
 */
export const SKILL_LEVEL_DESCRIPTIONS: Record<string, string> = {
  beginner: 'Hobbyist - simple straight seams, basic blocks, limited piecing',
  advanced_beginner: 'Advanced Hobbyist - accurate 1/4" seams, simple piecing patterns, basic color coordination',
  intermediate: 'Intermediate - points matching, Y-seams and set-in seams, multiple block patterns',
  advanced: 'Advanced - intricate piecing, foundation paper piecing, curved seams, complex designs',
  expert: 'Expert - all techniques mastered, complex medallions, competition-level work',
};

/**
 * Pattern Organization by Skill Level
 * Maps each skill level to appropriate quilt patterns using pattern IDs
 */
export const PATTERNS_BY_SKILL: Record<string, string[]> = {
  beginner: [
    'simple-squares',
    'strip-quilt',
    'checkerboard',
    'rail-fence',
  ],
  advanced_beginner: [
    'four-patch',
    'nine-patch',
    'half-square-triangles',
    'hourglass',
  ],
  intermediate: [
    'flying-geese',
    'pinwheel',
    'log-cabin',
    'bow-tie',
    'grandmothers-flower-garden',
    'mosaic-star',
  ],
  advanced: [
    'sawtooth-star',
    'ohio-star',
    'churn-dash',
    'lone-star',
    'kaleidoscope-star',
  ],
  expert: [
    'mariners-compass',
    'new-york-beauty',
    'storm-at-sea',
    'double-wedding-ring',
    'drunkards-path',
    'pickle-dish',
    'complex-medallion',
  ],
};

/**
 * Get patterns for a skill level, filtering out disabled patterns
 * In development, all patterns are shown; in production, only enabled patterns
 */
export function getPatternsForSkillLevel(skillLevel: string): string[] {
  const enabledPatternIds = getAllPatterns()
    .filter(p => {
      if (process.env.NODE_ENV !== 'production') {
        return true;  // Show all patterns in development
      }
      return p.enabled !== false;  // Only show enabled patterns in production
    })
    .map(p => p.id);
  
  return (PATTERNS_BY_SKILL[skillLevel] || [])
    .filter(id => enabledPatternIds.includes(id));
}

/**
 * Get display name from pattern ID
 */
export function getPatternDisplayName(patternId: string): string {
  return patternId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get skill level for a pattern
 */
export function getPatternSkillLevel(patternId: string): string | undefined {
  for (const [level, patterns] of Object.entries(PATTERNS_BY_SKILL)) {
    if (patterns.includes(patternId)) {
      return level;
    }
  }
  return undefined;
}
