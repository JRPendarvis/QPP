import { PatternDefinition } from '../../../types/PatternDefinition';
import { NINE_PATCH_TEMPLATE } from './template';
import { NINE_PATCH_PROMPT } from './prompt';

const NinePatch: PatternDefinition = {
  id: 'nine-patch',
  name: 'Nine Patch',
  template: NINE_PATCH_TEMPLATE,
  prompt: NINE_PATCH_PROMPT,
  minFabrics: 2,
  maxFabrics: 5,
  allowRotation: true,
  rotationStrategy: 'alternate-180',
  
  /**
   * Nine Patch - classic 3x3 grid of squares
   * fabricColors[0] = Background (corners + center = 5 squares)
   * fabricColors[1] = Primary (cross/plus = 4 squares)
   * fabricColors[2] = Secondary (alternate cross color for scrappy look)
   * fabricColors[3] = Accent (more cross variety)
   * fabricColors[4] = Contrast (maximum cross variety)
   * 
   * Traditional: 5 corners/center squares + 4 cross squares
   * 
   * 2 fabrics: Classic nine patch (Background corners/center, Primary cross)
   * 3-5 fabrics: Scrappy - Background stays consistent, cross rotates
   * 
   * Returns: [corners_and_center, cross]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: traditional nine patch
      return [background, primary];
    }
    
    // 3-5 fabrics: Background consistent, rotate through Primary, Secondary, Accent, Contrast for cross
    const crossOptions = fabricColors.slice(1); // Primary, Secondary, Accent, Contrast
    const cross = crossOptions[blockIndex % crossOptions.length];
    
    return [background, cross];
  }
};

export default NinePatch;