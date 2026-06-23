import { PatternDefinition } from '../../../types/PatternDefinition';
import { HOURGLASS_TEMPLATE } from './template';
import { HOURGLASS_PROMPT } from './prompt';
import { createConditionalByCount } from '../colorAssignmentStrategies';

const Hourglass: PatternDefinition = {
  id: 'hourglass',
  name: 'Hourglass',
  template: HOURGLASS_TEMPLATE,
  prompt: HOURGLASS_PROMPT,
  minFabrics: 2,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'alternate-180',
  fabricRoles: [
    'Background Triangles',
    'Hourglass Triangles',
    'Hourglass Triangles 2',
    'Hourglass Triangles 3',
  ],

  /**
   * Hourglass - 4 quarter-square triangles forming an hourglass shape.
   * Background stays consistent, hourglass color rotates for scrappy look.
   */
  getColors: createConditionalByCount(
    // 2 fabrics: traditional consistent hourglass
    (colors) => [colors[0], colors[1] || colors[0]],
    // 3-4 fabrics: background consistent, rotate through hourglass colors
    (colors, opts) => {
      const blockIndex = opts.blockIndex ?? 0;
      const background = colors[0];
      const hourglassOptions = colors.slice(1);
      const hourglass = hourglassOptions[blockIndex % hourglassOptions.length];
      return [background, hourglass];
    },
    2
  )
};

export default Hourglass;