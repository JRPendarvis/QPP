import { PatternDefinition } from '../../../types/PatternDefinition';
import { PINWHEEL_TEMPLATE } from './template';
import { PINWHEEL_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';
import buildPinwheelPlan from './plan';

const Pinwheel: PatternDefinition = {
  id: 'pinwheel',
  name: 'Pinwheel',
  template: PINWHEEL_TEMPLATE,
  prompt: PINWHEEL_PROMPT,

  minFabrics: 2,
  maxFabrics: 4,

  // Pinwheel identity comes from rotation, not color shuffling
  allowRotation: true,
  rotationStrategy: 'alternate-90',

  fabricRoles: [
    'Background',
    'Blades (Primary)',
    'Blades (Secondary)',
    'Blades (Accent)',
  ],

  /**
   * Pinwheel - position-based color assignment.
   * Colors stay in their defined positions; no rotation across blocks.
   */
  getColors: createStablePositional,
};

export default Pinwheel;

// Named export used by deterministic instruction generation
export { buildPinwheelPlan };
