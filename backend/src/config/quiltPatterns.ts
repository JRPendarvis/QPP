export interface QuiltPattern {
  id: string;
  name: string;
  skillLevel: string;
  description: string;
  svgHint: string; // Hint for Claude on how to draw this pattern
  recommendedFabricCount?: number | { min: number; max: number }; // For best results
}

export const QUILT_PATTERNS_BY_SKILL: Record<string, QuiltPattern[]> = {
  beginner: [
    {
      id: 'simple-squares',
      name: 'Simple Squares',
      skillLevel: 'beginner',
      description: 'Classic grid of solid color squares arranged in rows',
      svgHint: 'Create a grid of solid colored squares in alternating or random pattern',
      recommendedFabricCount: { min: 3, max: 6 }
    },
    {
      id: 'strip-quilt',
      name: 'Strip Quilt',
      skillLevel: 'beginner',
      description: 'Long fabric strips sewn together vertically or horizontally',
      svgHint: 'Create vertical or horizontal strips of different colors',
      recommendedFabricCount: { min: 3, max: 8 }
    },
    {
      id: 'checkerboard',
      name: 'Checkerboard',
      skillLevel: 'beginner',
      description: 'Two-color alternating squares like a checkerboard',
      svgHint: 'Create alternating two-color checkerboard pattern',
      recommendedFabricCount: 2
    },
    {
      id: 'rail-fence',
      name: 'Rail Fence',
      skillLevel: 'beginner',
      description: 'Strips arranged to create a zigzag fence effect',
      svgHint: 'Create blocks with 3-4 strips that create a zigzag when rotated',
      recommendedFabricCount: { min: 3, max: 4 }
    },
  ],
  
  advanced_beginner: [
    {
      id: 'four-patch',
      name: 'Four Patch',
      skillLevel: 'advanced_beginner',
      description: 'Simple 2x2 grid blocks in alternating colors',
      svgHint: 'Each block has 4 squares (2x2) in alternating colors',
      recommendedFabricCount: 2
    },
    {
      id: 'nine-patch',
      name: 'Nine Patch',
      skillLevel: 'advanced_beginner',
      description: 'Classic 3x3 grid blocks with alternating fabrics',
      svgHint: 'Each block has 9 squares (3x3) in checkerboard or alternating pattern',
      recommendedFabricCount: { min: 2, max: 3 }
    },
    {
      id: 'half-square-triangles',
      name: 'Half-Square Triangles',
      skillLevel: 'advanced_beginner',
      description: 'Squares divided diagonally creating triangle patterns',
      svgHint: 'Each block is split diagonally creating two triangles',
      recommendedFabricCount: 2
    },
    {
      id: 'hourglass',
      name: 'Hourglass',
      skillLevel: 'advanced_beginner',
      description: 'Four triangles meeting in the center creating hourglass shape',
      svgHint: 'Four triangles pointing to center creating hourglass effect',
      recommendedFabricCount: 2
    },
    {
      id: 'bow-tie',
      name: 'Bow Tie',
      skillLevel: 'advanced_beginner',
      description: 'Four squares in corners with triangles creating bow tie',
      svgHint: 'Corner squares with triangles forming bow tie in center',
      recommendedFabricCount: { min: 2, max: 3 }
    },
  ],
  
  intermediate: [
    {
      id: 'flying-geese',
      name: 'Flying Geese',
      skillLevel: 'intermediate',
      description: 'Triangles arranged to look like geese flying in formation',
      svgHint: 'Large triangles pointing in same direction with small triangles on sides',
      recommendedFabricCount: { min: 2, max: 3 }
    },
    {
      id: 'pinwheel',
      name: 'Pinwheel',
      skillLevel: 'intermediate',
      description: 'Four triangles rotating around center point like a pinwheel',
      svgHint: 'Four triangles rotating clockwise or counterclockwise around center',
      recommendedFabricCount: { min: 2, max: 4 }
    },
    {
      id: 'log-cabin',
      name: 'Log Cabin',
      skillLevel: 'intermediate',
      description: 'Strips arranged around center square in light and dark halves',
      svgHint: 'Center square with strips building outward, half light half dark',
      recommendedFabricCount: { min: 4, max: 8 }
    },
    {
      id: 'sawtooth-star',
      name: 'Sawtooth Star',
      skillLevel: 'intermediate',
      description: 'Eight-pointed star with sawtooth edges',
      svgHint: 'Star pattern with triangular points creating sawtooth effect',
      recommendedFabricCount: 3
    },
    {
      id: 'ohio-star',
      name: 'Ohio Star',
      skillLevel: 'intermediate',
      description: 'Classic star pattern with quarter-square triangles',
      svgHint: 'Star with center square, corner squares, and triangular points',
      recommendedFabricCount: 3
    },
    {
      id: 'churn-dash',
      name: 'Churn Dash',
      skillLevel: 'intermediate',
      description: 'Traditional pattern resembling old butter churn dasher',
      svgHint: 'Nine-patch variation with triangles creating X pattern',
      recommendedFabricCount: 3
    },
  ],
  
  advanced: [
    {
      id: 'lone-star',
      name: 'Lone Star',
      skillLevel: 'advanced',
      description: 'Large eight-pointed star radiating from center',
      svgHint: 'Large central star with diamond shapes radiating outward',
      recommendedFabricCount: { min: 5, max: 8 }
    },
    {
      id: 'mariners-compass',
      name: "Mariner's Compass",
      skillLevel: 'advanced',
      description: 'Circular compass design with pointed rays',
      svgHint: 'Circular pattern with pointed rays emanating from center',
      recommendedFabricCount: { min: 4, max: 6 }
    },
    {
      id: 'new-york-beauty',
      name: 'New York Beauty',
      skillLevel: 'advanced',
      description: 'Curved piecing with radiating points in corners',
      svgHint: 'Curved arcs with pointed triangles radiating from corners',
      recommendedFabricCount: { min: 3, max: 5 }
    },
    {
      id: 'storm-at-sea',
      name: 'Storm at Sea',
      skillLevel: 'advanced',
      description: 'Complex interlocking curved shapes creating wave effect',
      svgHint: 'Interlocking diamonds and curves creating turbulent sea effect',
      recommendedFabricCount: { min: 3, max: 4 }
    },
    {
      id: 'drunkards-path',
      name: "Drunkard's Path",
      skillLevel: 'advanced',
      description: 'Curved piecing creating winding path patterns',
      svgHint: 'Quarter circles creating curved interlocking path',
      recommendedFabricCount: 2
    },
  ],
  
  expert: [
    {
      id: 'feathered-star',
      name: 'Feathered Star',
      skillLevel: 'expert',
      description: 'Intricate star with feathered triangular points',
      svgHint: 'Complex star with multiple small triangles creating feathered effect',
      recommendedFabricCount: { min: 3, max: 5 }
    },
    {
      id: 'grandmothers-flower-garden',
      name: "Grandmother's Flower Garden",
      skillLevel: 'expert',
      description: 'Hexagonal patches arranged in flower patterns',
      svgHint: 'Hexagons arranged to create flower shapes',
      recommendedFabricCount: { min: 5, max: 12 }
    },
    {
      id: 'double-wedding-ring',
      name: 'Double Wedding Ring',
      skillLevel: 'expert',
      description: 'Interlocking rings created with curved piecing',
      svgHint: 'Interlocking circular rings with curved piecing',
      recommendedFabricCount: { min: 4, max: 8 }
    },
    {
      id: 'pickle-dish',
      name: 'Pickle Dish',
      skillLevel: 'expert',
      description: 'Curved petals radiating from center medallion',
      svgHint: 'Curved petal shapes radiating from circular center',
      recommendedFabricCount: { min: 4, max: 6 }
    },
    {
      id: 'complex-medallion',
      name: 'Complex Medallion',
      skillLevel: 'expert',
      description: 'Intricate central medallion with multiple borders',
      svgHint: 'Central focal design with multiple intricate surrounding borders',
      recommendedFabricCount: { min: 6, max: 10 }
    },
  ],
};

// Helper function to get patterns for a specific skill level
export function getPatternsForSkillLevel(skillLevel: string): QuiltPattern[] {
  return QUILT_PATTERNS_BY_SKILL[skillLevel] || QUILT_PATTERNS_BY_SKILL['beginner'];
}

// Helper function to get a random pattern for a skill level
export function getRandomPattern(skillLevel: string): QuiltPattern {
  const patterns = getPatternsForSkillLevel(skillLevel);
  return patterns[Math.floor(Math.random() * patterns.length)];
}

// Helper function to find a pattern by ID
export function getPatternById(patternId: string): QuiltPattern | undefined {
  for (const patterns of Object.values(QUILT_PATTERNS_BY_SKILL)) {
    const found = patterns.find(p => p.id === patternId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Calculate how well a pattern matches a given fabric count
 * Returns a score from 0-100, where 100 is perfect match
 */
export function calculateFabricCountScore(pattern: QuiltPattern, fabricCount: number): number {
  if (!pattern.recommendedFabricCount) {
    // No recommendation - return neutral score
    return 50;
  }

  const recommended = pattern.recommendedFabricCount;
  
  if (typeof recommended === 'number') {
    // Exact match is best
    if (fabricCount === recommended) return 100;
    // Close matches get high scores
    const diff = Math.abs(fabricCount - recommended);
    return Math.max(0, 100 - (diff * 25));
  } else {
    // Range recommendation
    if (fabricCount >= recommended.min && fabricCount <= recommended.max) {
      // Within range - score based on how centered it is
      const range = recommended.max - recommended.min;
      const center = (recommended.min + recommended.max) / 2;
      const distanceFromCenter = Math.abs(fabricCount - center);
      return 100 - (distanceFromCenter / range) * 20;
    } else if (fabricCount < recommended.min) {
      // Below minimum
      const diff = recommended.min - fabricCount;
      return Math.max(0, 70 - (diff * 20));
    } else {
      // Above maximum
      const diff = fabricCount - recommended.max;
      return Math.max(0, 70 - (diff * 15));
    }
  }
}