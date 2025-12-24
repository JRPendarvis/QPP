import { PatternDefinition } from '../types';
import { FEATHERED_STAR_TEMPLATE } from './template';
import { FEATHERED_STAR_PROMPT } from './prompt';

const FeatheredStar: PatternDefinition = {
  id: 'feathered-star',
  name: 'Feathered Star',
  template: FEATHERED_STAR_TEMPLATE,
  prompt: FEATHERED_STAR_PROMPT,
  minColors: 3,
  maxColors: 4,
   allowRotation: true,
  /**
   * Feathered Star has star points edged with tiny "feather" triangles
   * Complex, precision pattern - colors must stay CONSISTENT
   * COLOR1 = background, COLOR2 = star points, COLOR3 = feathers
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
    
    // Consistent colors every block - feathers require precision alignment
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default FeatheredStar;