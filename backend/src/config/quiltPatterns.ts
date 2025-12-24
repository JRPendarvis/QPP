import { getPattern, getAllPatterns, PatternDefinition } from './patterns';
import { getPatternPrompt } from './prompts';
import { PATTERNS_BY_SKILL } from './patternsBySkill';

export interface QuiltPattern {
  id: string;
  name: string;
  skillLevel: string;
  description: string;
  recommendedFabricCount: number;
  minColors: number;
  maxColors: number;
  allowRotation: boolean;
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

/**
 * Build QuiltPattern from the new pattern system
 */
export function getQuiltPattern(patternId: string): QuiltPattern | undefined {
  const patternDef = getPattern(patternId);
  const prompt = getPatternPrompt(patternId);
  const skillLevel = getPatternSkillLevel(patternId);
  
  if (!patternDef) return undefined;
  
  return {
    id: patternDef.id,
    name: patternDef.name,
    skillLevel: skillLevel || 'intermediate',
    description: prompt.characteristics.split('\n')[0], // First line as short description
    recommendedFabricCount: typeof prompt.recommendedFabricCount === 'number' 
      ? prompt.recommendedFabricCount 
      : prompt.recommendedFabricCount?.min || 2,
    minColors: patternDef.minColors,
    maxColors: patternDef.maxColors,
    allowRotation: patternDef.allowRotation ?? true,
  };
}

/**
 * Get all patterns for a skill level
 */
export function getPatternsForSkillLevel(skillLevel: string): QuiltPattern[] {
  const patternIds = PATTERNS_BY_SKILL[skillLevel] || PATTERNS_BY_SKILL['beginner'];
  return patternIds
    .map((id: string) => getQuiltPattern(id))
    .filter((p): p is QuiltPattern => p !== undefined);
}

/**
 * Get a random pattern for a skill level
 */
export function getRandomPattern(skillLevel: string): QuiltPattern | undefined {
  const patterns = getPatternsForSkillLevel(skillLevel);
  if (patterns.length === 0) return undefined;
  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * Find a pattern by ID
 */
export function getPatternById(patternId: string): QuiltPattern | undefined {
  return getQuiltPattern(patternId);
}

/**
 * Calculate how well a pattern matches a given fabric count
 * Returns a score from 0-100, where 100 is perfect match
 */
export function calculateFabricCountScore(pattern: QuiltPattern, fabricCount: number): number {
  const { recommendedFabricCount, minColors, maxColors } = pattern;
  
  // Perfect match with recommended
  if (fabricCount === recommendedFabricCount) return 100;
  
  // Within supported range
  if (fabricCount >= minColors && fabricCount <= maxColors) {
    // Score based on distance from recommended
    const diff = Math.abs(fabricCount - recommendedFabricCount);
    return Math.max(60, 100 - (diff * 15));
  }
  
  // Below minimum
  if (fabricCount < minColors) {
    const diff = minColors - fabricCount;
    return Math.max(0, 50 - (diff * 20));
  }
  
  // Above maximum
  const diff = fabricCount - maxColors;
  return Math.max(0, 50 - (diff * 15));
}

/**
 * Get all patterns sorted by fabric count compatibility
 */
export function getPatternsSortedByFabricCount(fabricCount: number): QuiltPattern[] {
  const allPatterns = getAllPatterns()
    .map((p: PatternDefinition) => getQuiltPattern(p.id))
    .filter((p): p is QuiltPattern => p !== undefined);
  
  return allPatterns.sort((a: QuiltPattern, b: QuiltPattern) => 
    calculateFabricCountScore(b, fabricCount) - calculateFabricCountScore(a, fabricCount)
  );
}