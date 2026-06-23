import { PatternDefinition } from '../../../types/PatternDefinition';
import { CHECKERBOARD_TEMPLATE } from './template';
import { CHECKERBOARD_PROMPT } from './prompt';
import { createCheckerboard } from '../colorAssignmentStrategies';

const Checkerboard: PatternDefinition = {
  id: 'checkerboard',
  name: 'Checkerboard',
  template: CHECKERBOARD_TEMPLATE,
  prompt: CHECKERBOARD_PROMPT,
  minFabrics: 2,
  maxFabrics: 2,
  allowRotation: true,
  rotationStrategy: 'none',
  fabricRoles: [
    'Light Squares',
    'Dark Squares',
  ],

  /**
   * Checkerboard - alternates two colors based on position.
   * fabricColors[0] = Light (even positions: row + col = even)
   * fabricColors[1] = Dark (odd positions: row + col = odd)
   */
  getColors: createCheckerboard
};

export default Checkerboard;