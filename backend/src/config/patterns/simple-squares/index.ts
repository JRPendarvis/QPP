import { PatternDefinition } from '../../../types/PatternDefinition';
import { SIMPLE_SQUARES_TEMPLATE } from './template';
import { SIMPLE_SQUARES_PROMPT } from './prompt';
import { createDiagonalRotation } from '../colorAssignmentStrategies';

const SimpleSquares: PatternDefinition = {
  id: 'simple-squares',
  name: 'Simple Squares',
  template: SIMPLE_SQUARES_TEMPLATE,
  prompt: SIMPLE_SQUARES_PROMPT,
  minFabrics: 2,
  maxFabrics: 8,
  allowRotation: true,
  rotationStrategy: 'random',
  fabricRoles: [
    'Color 1',
    'Color 2',
    'Color 3',
    'Color 4',
    'Color 5',
    'Color 6',
    'Color 7',
    'Color 8',
  ],
  
  /**
   * Simple Squares - each block is a single solid square.
   * Rotates through all available colors by diagonal position (row + col)
   * to create organic patchwork and prevent banding effects.
   * 
   * With 1 fabric: All blocks same color (solid quilt)
   * With 2+ fabrics: Blocks rotate through colors for scrappy look
   */
  getColors: createDiagonalRotation,
};

export default SimpleSquares;