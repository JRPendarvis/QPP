import { PatternDefinition } from '../../../types/PatternDefinition';
import { RAIL_FENCE_TEMPLATE } from './template';
import { RAIL_FENCE_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const RailFence: PatternDefinition = {
  id: 'rail-fence',
  name: 'Rail Fence',
  template: RAIL_FENCE_TEMPLATE,
  prompt: RAIL_FENCE_PROMPT,
  minFabrics: 3,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'alternate-90',
  fabricRoles: [
    'Top Rail',
    'Middle Rail',
    'Bottom Rail',
    'Accent Rail',
  ],
  
  /**
   * Rail Fence - stable positional colors for three horizontal strips.
   * Colors stay consistent across blocks; zigzag effect comes from block rotation.
   */
  getColors: createStablePositional
};

export default RailFence;