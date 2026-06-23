import { PatternDefinition } from '../../../types/PatternDefinition';
import { FOUR_PATCH_TEMPLATE } from './template';
import { FOUR_PATCH_PROMPT } from './prompt';
import { createConditionalByCount } from '../colorAssignmentStrategies';

const FourPatch: PatternDefinition = {
  id: 'four-patch',
  name: 'Four Patch',
  template: FOUR_PATCH_TEMPLATE,
  prompt: FOUR_PATCH_PROMPT,
  minFabrics: 3,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background',
    'Primary',
    'Secondary',
    'Accent',
  ],
  
  /**
   * Four Patch - 2x2 grid (4 squares per block)
   * 
   * 3 fabrics: Diagonal patterns rotate across blocks
   * 4 fabrics: All 4 colors rotate through positions (90° rotations)
   * 
   * Returns: [top-left, top-right, bottom-left, bottom-right]
   */
  getColors: createConditionalByCount(
    // 3-fabric: diagonal patterns
    (colors, opts) => {
      const bg = colors[0];
      const primary = colors[1];
      const secondary = colors[2];
      const patterns = [
        [bg, primary, secondary, bg],           // Background diagonal
        [primary, secondary, bg, primary],      // Primary diagonal
        [secondary, bg, primary, secondary],    // Secondary diagonal
        [bg, secondary, primary, bg],           // Background diagonal, swapped
      ];
      const pattern = patterns[(opts.blockIndex ?? 0) % patterns.length];
      return pattern;
    },
    // 4+ fabrics: rotate all 4 through positions
    (colors, opts) => {
      const [bg, primary, secondary, accent] = colors;
      const rotations = [
        [bg, primary, secondary, accent],       // Original
        [primary, accent, bg, secondary],       // Rotated 90°
        [accent, secondary, primary, bg],       // Rotated 180°
        [secondary, bg, accent, primary],       // Rotated 270°
      ];
      const rotation = rotations[(opts.blockIndex ?? 0) % rotations.length];
      return rotation;
    },
    3
  )
};

export default FourPatch;