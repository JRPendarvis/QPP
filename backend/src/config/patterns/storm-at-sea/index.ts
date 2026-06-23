import { PatternDefinition } from '../../../types/PatternDefinition';
import { STORM_AT_SEA_TEMPLATE } from './template';
import { STORM_AT_SEA_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const StormAtSea: PatternDefinition = {
  id: 'storm-at-sea',
  name: 'Storm at Sea',
  enabled: false,
  template: STORM_AT_SEA_TEMPLATE,
  prompt: STORM_AT_SEA_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: false,
  rotationStrategy: 'parity-2x2',
  fabricRoles: [
    'Background',
    'Waves/Diamonds',
    'Square Centers',
    'Accent',
  ],
  
  /**
   * Storm at Sea - stable positional colors for optical wave illusion.
   * Colors must stay consistent for wave pattern to emerge when blocks are tiled.
   */
  getColors: createStablePositional
};

export default StormAtSea;