import { PatternDefinition } from '../../../types/PatternDefinition';
import { COMPLEX_MEDALLION_TEMPLATE } from './template';
import { COMPLEX_MEDALLION_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const ComplexMedallion: PatternDefinition = {
  id: 'complex-medallion',
  name: 'Complex Medallion',
  enabled: false,
  template: COMPLEX_MEDALLION_TEMPLATE,
  prompt: COMPLEX_MEDALLION_PROMPT,
  minFabrics: 4,
  maxFabrics: 8,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Outermost Border',
    'Center Medallion',
    'Inner Border 1',
    'Inner Border 2',
    'Inner Border 3',
    'Inner Border 4',
    'Inner Border 5',
    'Inner Border 6',
  ],
  
  /**
   * Complex Medallion - stable positional colors for radiating borders.
   * All colors stay consistent across blocks for the medallion pattern to radiate properly.
   */
  getColors: createStablePositional
};

export default ComplexMedallion;