import { PatternDefinition } from '../types';
import { STRIP_QUILT_TEMPLATE } from './template';
import { STRIP_QUILT_PROMPT } from './prompt';

const StripQuilt: PatternDefinition = {
  id: 'strip-quilt',
  name: 'Strip Quilt',
  template: STRIP_QUILT_TEMPLATE,
  prompt: STRIP_QUILT_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Strip Quilt uses horizontal strips of different fabrics
   * All colors appear in sequence within each block
   * Consistent across blocks for a cohesive striped look
   */
  getColors: (
    fabricColors: string[], 
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0], fabricColors[0]];
    }
    
    // Strip quilt shows all colors in order - consistent across blocks
    return fabricColors;
  }
};

export default StripQuilt;