import { PatternDefinition } from '../../../types/PatternDefinition';
import { SAWTOOTH_STAR_TEMPLATE } from './template';
import { SAWTOOTH_STAR_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const SawtoothStar: PatternDefinition = {
  id: 'sawtooth-star',
  name: 'Sawtooth Star',
  template: SAWTOOTH_STAR_TEMPLATE,
  prompt: SAWTOOTH_STAR_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background & Sky',
    'Star Points',
    'Center Square',
  ],
  
  /**
   * Sawtooth Star - 8-pointed star with stable positional colors.
   * Background, star points, and center stay in their defined positions.
   */
  getColors: createStablePositional
};

export default SawtoothStar;