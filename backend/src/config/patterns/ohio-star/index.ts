import { PatternDefinition } from '../../../types/PatternDefinition';
import { OHIO_STAR_TEMPLATE } from './template';
import { OHIO_STAR_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const OhioStar: PatternDefinition = {
  id: 'ohio-star',
  name: 'Ohio Star',
  template: OHIO_STAR_TEMPLATE,
  prompt: OHIO_STAR_PROMPT,
  minFabrics: 3,
  maxFabrics: 4,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background Corners',
    'Star Points',
    'Center Square',
    'Accent Star Points',
  ],
  
  /**
   * Ohio Star - classic 8-pointed star with stable positional colors.
   * Background corners, star points, center, and accent stay in their assigned positions.
   */
  getColors: createStablePositional
};

export default OhioStar;