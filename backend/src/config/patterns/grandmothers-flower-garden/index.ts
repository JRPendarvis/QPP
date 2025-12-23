import { PatternDefinition } from '../types';
import { GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE } from './template';
import { GRANDMOTHERS_FLOWER_GARDEN_PROMPT } from './prompt';

const GrandmothersFlowerGarden: PatternDefinition = {
  id: 'grandmothers-flower-garden',
  name: "Grandmother's Flower Garden",
  template: GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE,
  prompt: GRANDMOTHERS_FLOWER_GARDEN_PROMPT,
  minColors: 3,
  maxColors: 4,
  
  /**
   * Grandmother's Flower Garden uses hexagons to create flower clusters
   * Center hexagon (flower center) + ring of petals + pathway/background
   * Colors must stay CONSISTENT for the garden to bloom properly
   * COLOR1 = flower center, COLOR2 = petals, COLOR3 = pathway/background
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0]
      ];
    }
    
    // Consistent colors every block - hexagon flowers must align
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default GrandmothersFlowerGarden;