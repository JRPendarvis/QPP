import { PatternDefinition } from '../../../types/PatternDefinition';
import { PICKLE_DISH_TEMPLATE } from './template';
import { PICKLE_DISH_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

const PickleDish: PatternDefinition = {
  id: 'pickle-dish',
  name: 'Pickle Dish',
  enabled: false,
  template: PICKLE_DISH_TEMPLATE,
  prompt: PICKLE_DISH_PROMPT,
  minFabrics: 4,
  maxFabrics: 6,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Background',
    'Arc Ring 1',
    'Arc Ring 2',
    'Melons/Centers',
    'Arc Ring 3',
    'Inner Details',
  ],
  
  /**
   * Pickle Dish - curved pieced arcs with stable positional colors.
   * Colors must stay consistent across blocks for arcs to align properly when tiled.
   */
  getColors: createStablePositional
};

export default PickleDish;