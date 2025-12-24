import { PatternDefinition } from '../types';
import { FOUR_PATCH_TEMPLATE } from './template';
import { FOUR_PATCH_PROMPT } from './prompt';

const FourPatch: PatternDefinition = {
  id: 'four-patch',
  name: 'Four Patch',
  template: FOUR_PATCH_TEMPLATE,
  prompt: FOUR_PATCH_PROMPT,
  minColors: 2,
  maxColors: 8,
   allowRotation: true,
  /**
   * Four Patch is a 2x2 grid of squares
   * COLOR1 = diagonal pair (top-left, bottom-right)
   * COLOR2 = opposite diagonal pair (top-right, bottom-left)
   * With multiple fabrics, creates "scrappy" look by rotating the second color
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
    
    // 3+ fabrics: first diagonal consistent, rotate second diagonal for scrappy look
    const diagonal1 = fabricColors[0];
    const diagonal2Options = fabricColors.slice(1);
    const diagonal2 = diagonal2Options[blockIndex % diagonal2Options.length];
    
    return [diagonal1, diagonal2];
  }
};

export default FourPatch;