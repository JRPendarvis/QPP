import { PatternDefinition } from '../types';
import { LONE_STAR_TEMPLATE } from './template';
import { LONE_STAR_PROMPT } from './prompt';

const LoneStar: PatternDefinition = {
  id: 'lone-star',
  name: 'Lone Star',
  template: LONE_STAR_TEMPLATE,
  prompt: LONE_STAR_PROMPT,
  minColors: 3,
  maxColors: 6,
   allowRotation: false,
  /**
   * Lone Star (Star of Bethlehem) has 8 diamond points radiating from center
   * Colors must stay CONSISTENT to create the graduated/radiating effect
   * COLOR1 = background, COLOR2 = inner diamonds, COLOR3 = outer diamonds
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
    
    // Consistent colors every block - radiating star requires perfect alignment
    return fabricColors.slice(0, Math.min(fabricColors.length, 6));
  }
};

export default LoneStar;