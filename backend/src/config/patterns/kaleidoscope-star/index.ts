import { PatternDefinition } from '../../../types/PatternDefinition';
import { KALEIDOSCOPE_STAR_TEMPLATE } from './template';
import { KALEIDOSCOPE_STAR_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const KaleidoscopeStar: PatternDefinition = {
  id: 'kaleidoscope-star',
  name: 'Kaleidoscope Star',
  template: KALEIDOSCOPE_STAR_TEMPLATE,
  prompt: KALEIDOSCOPE_STAR_PROMPT,
  minFabrics: 3,
  maxFabrics: 5,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background Corners',
    'Star Points',
    'Center Square',
    'Accent Star Points',
    'Additional Accent',
  ],
  
  /**
   * Kaleidoscope Star - classic 8-pointed star with stable positional colors.
   * All positions (background, star, center, accents) stay consistent.
   */
  getColors: createStablePositional
};

export default KaleidoscopeStar;
