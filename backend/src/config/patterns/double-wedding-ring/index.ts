import { PatternDefinition } from '../../../types/PatternDefinition';
import { DOUBLE_WEDDING_RING_TEMPLATE } from './template';
import { DOUBLE_WEDDING_RING_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const DoubleWeddingRing: PatternDefinition = {
  id: 'double-wedding-ring',
  name: 'Double Wedding Ring',
  enabled: false,
  template: DOUBLE_WEDDING_RING_TEMPLATE,
  prompt: DOUBLE_WEDDING_RING_PROMPT,
  minFabrics: 3,
  maxFabrics: 6,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background',
    'Ring Arc 1',
    'Ring Arc 2',
    'Melon Connectors',
    'Arc Variation 1',
    'Arc Variation 2',
  ],
  
  /**
   * Double Wedding Ring - stable positional colors for interlocking rings.
   * Background, arcs, and accent colors stay in their defined positions.
   */
  getColors: createStablePositional
};

export default DoubleWeddingRing;