import { PatternDefinition } from '../../../types/PatternDefinition';
import { LOG_CABIN_TEMPLATE } from './template';
import { LOG_CABIN_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const LogCabin: PatternDefinition = {
  id: 'log-cabin',
  name: 'Log Cabin',
  template: LOG_CABIN_TEMPLATE,
  prompt: LOG_CABIN_PROMPT,
  minFabrics: 3,
  maxFabrics: 8,
  allowRotation: false,  
  rotationStrategy: 'none',
  fabricRoles: [
    'Center (Hearth)',
    'Light Strip 1',
    'Dark Strip 1',
    'Light Strip 2',
    'Dark Strip 2',
    'Light Strip 3',
    'Dark Strip 3',
    'Light Strip 4',
  ],
  /**
   * Log Cabin - stable positional colors with light/dark alternation spiraling outward.
   * All 8 positions stay consistent: hearth center, then light/dark strips in concentric rounds.
   */
  getColors: createStablePositional
};

export default LogCabin;