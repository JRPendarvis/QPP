import { PatternDefinition } from '../types';
import { NINE_PATCH_TEMPLATE } from './template';
import { NINE_PATCH_PROMPT } from './prompt';

const NinePatch: PatternDefinition = {
  id: 'nine-patch',
  name: 'Nine Patch',
  template: NINE_PATCH_TEMPLATE,
  prompt: NINE_PATCH_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Nine Patch is a 3x3 grid of squares
   * Traditional: corners + center = COLOR1, cross/plus = COLOR2
   * With multiple fabrics, creates "scrappy" look by rotating the cross colors
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;

    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    
    if (fabricColors.length === 2) {
      return [fabricColors[0], fabricColors[1]];
    }
    
    // 3+ fabrics: corners/center consistent, rotate cross colors for scrappy look
    const cornersAndCenter = fabricColors[0];
    const crossOptions = fabricColors.slice(1);
    const cross = crossOptions[blockIndex % crossOptions.length];
    
    return [cornersAndCenter, cross];
  }
};

export default NinePatch;