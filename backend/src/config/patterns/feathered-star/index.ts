import { PatternDefinition } from '../types';
import { 
  FEATHERED_STAR_TEMPLATE, 
  FEATHERED_STAR_4,
  FEATHERED_STAR_5 
} from './template';
import { FEATHERED_STAR_PROMPT } from './prompt';

const FeatheredStar: PatternDefinition = {
  id: 'feathered-star',
  name: 'Feathered Star',
  template: FEATHERED_STAR_TEMPLATE,
  prompt: FEATHERED_STAR_PROMPT,
  minColors: 3,
  maxColors: 5,
  allowRotation: true,
  
  /**
   * Feathered Star color assignments:
   * 
   * 3 colors:
   * - COLOR1: Star points + primary feathers
   * - COLOR2: Background
   * - COLOR3: Center square + accent feathers
   * 
   * 4 colors:
   * - COLOR1: Star points
   * - COLOR2: Background
   * - COLOR3: Feathers (alternating)
   * - COLOR4: Center square
   * 
   * 5 colors:
   * - COLOR1: Star points
   * - COLOR2: Background
   * - COLOR3: Primary feathers
   * - COLOR4: Secondary feathers (alternating)
   * - COLOR5: Center square
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const count = fabricColors.length;
    
    if (count < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0]
      ];
    }
    
    if (count === 3) {
      return [
        fabricColors[0],  // COLOR1: star points + primary feathers
        fabricColors[1],  // COLOR2: background
        fabricColors[2]   // COLOR3: center + accent feathers
      ];
    }
    
    if (count === 4) {
      return [
        fabricColors[0],  // COLOR1: star points
        fabricColors[1],  // COLOR2: background
        fabricColors[2],  // COLOR3: feathers
        fabricColors[3]   // COLOR4: center square
      ];
    }
    
    // 5+ colors
    return [
      fabricColors[0],  // COLOR1: star points
      fabricColors[1],  // COLOR2: background
      fabricColors[2],  // COLOR3: primary feathers
      fabricColors[3],  // COLOR4: secondary feathers
      fabricColors[4]   // COLOR5: center square
    ];
  },
  
  /**
   * Select template based on color count
   */
  getTemplate: (colors: string[]): string => {
    const count = colors.length;
    if (count >= 5) return FEATHERED_STAR_5;
    if (count === 4) return FEATHERED_STAR_4;
    return FEATHERED_STAR_TEMPLATE;
  }
};

export default FeatheredStar;