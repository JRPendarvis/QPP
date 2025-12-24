import { PatternDefinition } from '../types';
import { HOURGLASS_TEMPLATE } from './template';
import { HOURGLASS_PROMPT } from './prompt';

const Hourglass: PatternDefinition = {
  id: 'hourglass',
  name: 'Hourglass',
  template: HOURGLASS_TEMPLATE,
  prompt: HOURGLASS_PROMPT,
  minColors: 2,
  maxColors: 8,
   allowRotation: true,
  /**
   * Hourglass has 4 quarter-square triangles forming an hourglass shape
   * COLOR1 = background triangles (top-left, bottom-right)
   * COLOR2 = hourglass triangles (top-right, bottom-left)
   * With multiple fabrics, creates "scrappy" look by rotating hourglass colors
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
    
    // 3+ fabrics: background consistent, rotate hourglass colors for scrappy look
    const background = fabricColors[0];
    const hourglassOptions = fabricColors.slice(1);
    const hourglass = hourglassOptions[blockIndex % hourglassOptions.length];
    
    return [background, hourglass];
  }
};

export default Hourglass;