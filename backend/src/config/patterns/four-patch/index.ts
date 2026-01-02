import { PatternDefinition } from '../../../types/PatternDefinition';
import { FOUR_PATCH_TEMPLATE } from './template';
import { FOUR_PATCH_PROMPT } from './prompt';

const FourPatch: PatternDefinition = {
  id: 'four-patch',
  name: 'Four Patch',
  template: FOUR_PATCH_TEMPLATE,
  prompt: FOUR_PATCH_PROMPT,
  minFabrics: 3,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'alternate-180',
  
  /**
   * Four Patch color assignments:
   * fabricColors[0] = Background (typically used in 2 diagonal squares)
   * fabricColors[1] = Primary (typically used in 1-2 squares)
   * fabricColors[2] = Secondary (typically used in 1-2 squares)
   * fabricColors[3] = Accent (optional - used in remaining square for 4-fabric version)
   * 
   * Each block is a 2x2 grid (4 squares total)
   * Layout: [TL] [TR]
   *         [BL] [BR]
   * 
   * 3 fabrics: Creates diagonal contrast or checkerboard patterns
   * 4 fabrics: Each square can be different, maximum variety
   * 
   * Returns: [top-left, top-right, bottom-left, bottom-right]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || secondary;
    
    if (fabricColors.length < 4) {
      // 3 fabrics: Create diagonal patterns that rotate across blocks
      const patterns = [
        [background, primary, secondary, background],    // Background diagonal
        [primary, secondary, background, primary],       // Primary diagonal
        [secondary, background, primary, secondary],     // Secondary diagonal
        [background, secondary, primary, background],    // Background diagonal, swapped
      ];
      const pattern = patterns[blockIndex % patterns.length];
      return pattern;
    }
    
    // 4 fabrics: Rotate all 4 colors through positions
    const rotations = [
      [background, primary, secondary, accent],    // Original
      [primary, accent, background, secondary],    // Rotated 90°
      [accent, secondary, primary, background],    // Rotated 180°
      [secondary, background, accent, primary],    // Rotated 270°
    ];
    const rotation = rotations[blockIndex % rotations.length];
    return rotation;
  }
};

export default FourPatch;