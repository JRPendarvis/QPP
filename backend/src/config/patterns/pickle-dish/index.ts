import { PatternDefinition } from '../types';
import { PICKLE_DISH_TEMPLATE } from './template';
import { PICKLE_DISH_PROMPT } from './prompt';

const PickleDish: PatternDefinition = {
  id: 'pickle-dish',
  name: 'Pickle Dish',
  template: PICKLE_DISH_TEMPLATE,
  prompt: PICKLE_DISH_PROMPT,
  minColors: 3,
  maxColors: 4,
  
  /**
   * Pickle Dish has curved arcs with pointed "teeth" creating an interlocking effect
   * Colors must stay CONSISTENT across all blocks for the curves to connect
   * COLOR1 = background, COLOR2 = arc teeth, COLOR3 = melon centers
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[1] || fabricColors[0]
      ];
    }
    
    // Consistent colors every block - curves must align across blocks
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default PickleDish;