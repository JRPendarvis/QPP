import { PatternDefinition } from '../../../types/PatternDefinition';
import { NINE_PATCH_TEMPLATE } from './template';
import { NINE_PATCH_PROMPT } from './prompt';
import { createConditionalByCount } from '../colorAssignmentStrategies';

const NinePatch: PatternDefinition = {
  id: 'nine-patch',
  name: 'Nine Patch',
  template: NINE_PATCH_TEMPLATE,
  prompt: NINE_PATCH_PROMPT,
  minFabrics: 2,
  maxFabrics: 5,
  allowRotation: true,
  rotationStrategy: 'alternate-180',
  fabricRoles: [
    'Corners & Center',
    'Cross Squares',
    'Cross Squares 2',
    'Cross Squares 3',
    'Cross Squares 4',
  ],
  
  /**
   * Nine Patch - classic 3x3 grid (corners + center stay constant, cross rotates).
   * 
   * 2 fabrics: Traditional nine patch (5 background, 4 cross)
   * 3+ fabrics: Scrappy - background consistent, cross rotates through remaining colors
   * 
   * Returns: [corners_and_center_color, cross_color]
   */
  getColors: createConditionalByCount(
    // 2 fabrics: traditional layout
    (colors, _opts) => {
      const background = colors[0];
      const cross = colors[1] || background;
      return [background, cross];
    },
    // 3+ fabrics: background fixed, cross rotates through Secondary, Accent, Contrast, etc.
    (colors, opts) => {
      const background = colors[0];
      const crossOptions = colors.slice(1); // Primary, Secondary, Accent, Contrast
      const cross = crossOptions[(opts.blockIndex ?? 0) % crossOptions.length];
      return [background, cross];
    },
    2
  )
};

export default NinePatch;