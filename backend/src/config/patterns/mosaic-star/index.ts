import { PatternDefinition } from '../../../types/PatternDefinition';
import { MOSAIC_STAR_TEMPLATE } from './template';
import { MOSAIC_STAR_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const MosaicStar: PatternDefinition = {
  id: 'mosaic-star',
  name: 'Mosaic Star',
  template: MOSAIC_STAR_TEMPLATE,
  prompt: MOSAIC_STAR_PROMPT,
  minFabrics: 3,
  maxFabrics: 5,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background',
    'Star Points',
    'Feathers (Tiny Triangles)',
    'Center Square',
    'Alternate Feathers',
  ],

  /**
   * Mosaic Star - stable positional colors for star with feathered detail.
   * All positions stay consistent across blocks.
   */
  getColors: createStablePositional
};

export default MosaicStar;