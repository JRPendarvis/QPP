import { PatternDefinition } from '../types';
import { STORM_AT_SEA_TEMPLATE } from './template';
import { STORM_AT_SEA_PROMPT } from './prompt';

const StormAtSea: PatternDefinition = {
  id: 'storm-at-sea',
  name: 'Storm at Sea',
  template: STORM_AT_SEA_TEMPLATE,
  prompt: STORM_AT_SEA_PROMPT,
  minColors: 3,
  maxColors: 4,
   allowRotation: false,
  /**
   * Storm at Sea creates an optical illusion of waves
   * Colors must stay CONSISTENT across all blocks for the wave effect to work
   * COLOR1 = background, COLOR2 = waves/diamonds, COLOR3 = accent centers
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      // Need at least 3 for the wave illusion
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0]
      ];
    }
    
    // Consistent colors every block - wave illusion requires alignment
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default StormAtSea;