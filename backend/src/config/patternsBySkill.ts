/**
 * Pattern Organization by Skill Level
 * Maps each skill level to appropriate quilt patterns
 * Uses pattern IDs for consistency with pattern system
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
  ],
  advanced: [
    'sawtooth-star',
    'ohio-star',
    'churn-dash',
    'lone-star',
  ],
  expert: [
    'mariners-compass',
    'new-york-beauty',
    'storm-at-sea',
    'double-wedding-ring',
    'drunkards-path',
    'feathered-star',
    'pickle-dish',
    'complex-medallion',
  ],
};

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