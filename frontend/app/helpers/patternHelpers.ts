// Pattern-related constants and helpers

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

export const PATTERN_OPTIONS: Record<string, { id: string; name: string; minFabrics: number; maxFabrics: number }[]> = {
  beginner: [
    { id: 'simple-squares', name: 'Simple Squares', minFabrics: 2, maxFabrics: 8 },
    { id: 'strip-quilt', name: 'Strip Quilt', minFabrics: 3, maxFabrics: 8 },
    { id: 'checkerboard', name: 'Checkerboard', minFabrics: 2, maxFabrics: 2 },
    { id: 'rail-fence', name: 'Rail Fence', minFabrics: 3, maxFabrics: 5 },
  ],
  advanced_beginner: [
    { id: 'four-patch', name: 'Four Patch', minFabrics: 3, maxFabrics: 8 },
    { id: 'nine-patch', name: 'Nine Patch', minFabrics: 2, maxFabrics: 9 },
    { id: 'half-square-triangles', name: 'Half-Square Triangles', minFabrics: 2, maxFabrics: 8 },
    { id: 'hourglass', name: 'Hourglass', minFabrics: 2, maxFabrics: 4 },
    { id: 'bow-tie', name: 'Bow Tie', minFabrics: 2, maxFabrics: 3 },
  ],
  intermediate: [
    { id: 'flying-geese', name: 'Flying Geese', minFabrics: 2, maxFabrics: 8 },
    { id: 'pinwheel', name: 'Pinwheel', minFabrics: 2, maxFabrics: 4 },
    { id: 'log-cabin', name: 'Log Cabin', minFabrics: 3, maxFabrics: 8 },
    { id: 'sawtooth-star', name: 'Sawtooth Star', minFabrics: 2, maxFabrics: 3 },
    { id: 'ohio-star', name: 'Ohio Star', minFabrics: 2, maxFabrics: 3 },
    { id: 'churn-dash', name: 'Churn Dash', minFabrics: 2, maxFabrics: 3 },
  ],
  advanced: [
    { id: 'lone-star', name: 'Lone Star', minFabrics: 3, maxFabrics: 8 },
    { id: 'mariners-compass', name: "Mariner's Compass", minFabrics: 4, maxFabrics: 6 },
    { id: 'new-york-beauty', name: 'New York Beauty', minFabrics: 4, maxFabrics: 5 },
    { id: 'storm-at-sea', name: 'Storm at Sea', minFabrics: 3, maxFabrics: 4 },
    { id: 'drunkards-path', name: "Drunkard's Path", minFabrics: 2, maxFabrics: 2 },
  ],
  expert: [
    { id: 'feathered-star', name: 'Feathered Star', minFabrics: 3, maxFabrics: 5 },
    { id: 'grandmothers-flower-garden', name: "Grandmother's Flower Garden", minFabrics: 3, maxFabrics: 8 },
    { id: 'pickle-dish', name: 'Pickle Dish', minFabrics: 4, maxFabrics: 6 },
    { id: 'complex-medallion', name: 'Complex Medallion', minFabrics: 3, maxFabrics: 8 },
  ],
};

export function getPatternsForSkillLevel(skillLevel: string) {
  const skillIndex = SKILL_HIERARCHY.indexOf(skillLevel);
  if (skillIndex === -1) {
    return PATTERN_OPTIONS['beginner'] || [];
  }
  const availablePatterns = [];
  for (let i = 0; i <= skillIndex; i++) {
    const levelPatterns = PATTERN_OPTIONS[SKILL_HIERARCHY[i]] || [];
    availablePatterns.push(...levelPatterns);
  }
  return availablePatterns;
}

export function formatFabricRange(min: number, max: number): string {
  if (min === max) {
    return `${min} fabric${min !== 1 ? 's' : ''}`;
  }
  return `${min}-${max} fabrics`;
}
