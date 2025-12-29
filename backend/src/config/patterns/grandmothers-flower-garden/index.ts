// index.ts
import { PatternDefinition } from '../types';
import { GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE } from './template';
import { GRANDMOTHERS_FLOWER_GARDEN_PROMPT } from './prompt';

const GrandmothersFlowerGarden: PatternDefinition = {
  id: 'grandmothers-flower-garden',
  name: "Grandmother's Flower Garden",
  template: GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE,
  prompt: GRANDMOTHERS_FLOWER_GARDEN_PROMPT,
  minColors: 3,
  maxColors: 5,
  allowRotation: false,
  /**
   * Grandmother's Flower Garden color roles:
   * COLOR1 = background/pathway
   * COLOR2 = flower center
   * COLOR3 = inner petals (positions 1, 3, 5)
   * COLOR4 = outer petals (positions 2, 4, 6) - falls back to COLOR3 if not provided
   * COLOR5 = second flower center for variety - falls back to COLOR2 if not provided
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const len = fabricColors.length;
    
    // Minimum 3 colors: background, center, petals
    if (len < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0]
      ];
    }
    
    // 3 colors: background, center, all petals same
    if (len === 3) {
      return [
        fabricColors[0],  // background
        fabricColors[1],  // center
        fabricColors[2],  // inner petals
        fabricColors[2],  // outer petals (same)
        fabricColors[1]   // alternate center (same)
      ];
    }
    
    // 4 colors: background, center, inner petals, outer petals
    if (len === 4) {
      return [
        fabricColors[0],  // background
        fabricColors[1],  // center
        fabricColors[2],  // inner petals
        fabricColors[3],  // outer petals
        fabricColors[1]   // alternate center (same as primary)
      ];
    }
    
    // 5 colors: full variety
    return [
      fabricColors[0],  // background
      fabricColors[1],  // center
      fabricColors[2],  // inner petals
      fabricColors[3],  // outer petals
      fabricColors[4]   // alternate center for row variation
    ];
  }
};

export default GrandmothersFlowerGarden;