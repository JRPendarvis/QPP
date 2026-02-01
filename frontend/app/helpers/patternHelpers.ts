// Pattern-related constants and helpers
import api from '@/lib/api';

export const SKILL_LEVELS: Record<string, string> = {
  beginner: 'Beginner',
  advanced_beginner: 'Advanced Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export const SKILL_HIERARCHY = [
  'beginner',
  'advanced_beginner',
  'intermediate',
  'advanced',
  'expert',
];

export const NEXT_LEVEL: Record<string, string> = {
  beginner: 'advanced_beginner',
  advanced_beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'expert',
  expert: 'expert',
};

export interface PatternOption {
  id: string;
  name: string;
  minFabrics?: number;
  maxFabrics: number;
  skillLevel: string;
  minColors: number;
  description: string;
  recommendedFabricCount: number | null;
  allowRotation: boolean;
}

let cachedPatterns: PatternOption[] | null = null;

/**
 * Fetch all available patterns from the backend
 * Results are cached after first call
 */
export async function fetchAllPatterns(): Promise<PatternOption[]> {
  if (cachedPatterns) {
    return cachedPatterns;
  }

  try {
    const response = await api.get('/patterns/list');
    if (response.data.success && response.data.data) {
      // Map backend response to frontend interface
      cachedPatterns = response.data.data.map((p: any) => ({
        ...p,
        minFabrics: p.minColors, // Backend uses minColors, frontend expects minFabrics
      }));
      return cachedPatterns!;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch patterns:', error);
    return [];
  }
}

/**
 * Get patterns available for a specific skill level
 * Includes all patterns from current level and below
 */
export function getPatternsForSkillLevel(skillLevel: string, allPatterns: PatternOption[] = []): PatternOption[] {
  const skillIndex = SKILL_HIERARCHY.indexOf(skillLevel);
  if (skillIndex === -1) {
    return [];
  }

  // Get all skill levels up to and including the target level
  const availableSkillLevels = SKILL_HIERARCHY.slice(0, skillIndex + 1);

  // Filter patterns by skill level
  return allPatterns.filter(pattern => 
    pattern.skillLevel && availableSkillLevels.includes(pattern.skillLevel)
  );
}

export function formatFabricRange(min: number, max: number): string {
  if (min === max) {
    return `${min} fabric${min !== 1 ? 's' : ''}`;
  }
  return `${min}-${max} fabrics`;
}
