import { PatternDefinition } from '../types';
import { COMPLEX_MEDALLION_TEMPLATE } from './template';
import { COMPLEX_MEDALLION_PROMPT } from './prompt';

const ComplexMedallion: PatternDefinition = {
  id: 'complex-medallion',
  name: 'Complex Medallion',
  template: COMPLEX_MEDALLION_TEMPLATE,
  prompt: COMPLEX_MEDALLION_PROMPT,
  minColors: 3,
  maxColors: 5,
  
  /**
   * Complex Medallion has a central focal point with radiating borders/frames
   * Colors must stay CONSISTENT for the medallion to radiate properly
   * COLOR1 = background, COLOR2 = center medallion, COLOR3 = inner border, COLOR4 = outer border
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[0]
      ];
    }
    
    // Consistent colors every block - medallion radiates from center
    return fabricColors.slice(0, Math.min(fabricColors.length, 5));
  }
};

export default ComplexMedallion;