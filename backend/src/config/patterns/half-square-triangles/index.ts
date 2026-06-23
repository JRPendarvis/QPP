import { PatternDefinition } from '../../../types/PatternDefinition';
import { HALF_SQUARE_TRIANGLES_TEMPLATE } from './template';
import { HALF_SQUARE_TRIANGLES_PROMPT } from './prompt';
import { createConditionalByCount } from '../colorAssignmentStrategies';

const HalfSquareTriangles: PatternDefinition = {
  id: 'half-square-triangles',
  name: 'Half Square Triangles',
  template: HALF_SQUARE_TRIANGLES_TEMPLATE,
  prompt: HALF_SQUARE_TRIANGLES_PROMPT,
  minFabrics: 2,
  maxFabrics: 8,
  allowRotation: true,
  rotationStrategy: 'random',
  fabricRoles: [
    'Background Triangles',
    'Primary Triangles',
    'Secondary Triangles',
    'Accent Triangles',
    'Contrast Triangles',
    'Additional Triangles 1',
    'Additional Triangles 2',
    'Additional Triangles 3',
  ],
  
  /**
   * Half Square Triangles - versatile quilting unit with two triangles per block.
   * Background stays consistent, other triangle rotates through available colors for scrappy look.
   */
  getColors: createConditionalByCount(
    // 2 fabrics: traditional consistent HST
    (colors) => [colors[0], colors[1] || colors[0]],
    // 3+ fabrics: background consistent, rotate through remaining colors
    (colors, opts) => {
      const blockIndex = opts.blockIndex ?? 0;
      const background = colors[0];
      const triangleOptions = colors.slice(1);
      const triangle2 = triangleOptions[blockIndex % triangleOptions.length];
      return [background, triangle2];
    },
    2
  )
};

export default HalfSquareTriangles;