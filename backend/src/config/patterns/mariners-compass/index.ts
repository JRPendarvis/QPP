import { PatternDefinition } from '../types';
import { MARINERS_COMPASS_TEMPLATE } from './template';
import { MARINERS_COMPASS_PROMPT } from './prompt';

const MarinersCompass: PatternDefinition = {
  id: 'mariners-compass',
  name: "Mariner's Compass",
  template: MARINERS_COMPASS_TEMPLATE,
  prompt: MARINERS_COMPASS_PROMPT,
  minColors: 3,
  maxColors: 4,
  
  /**
   * Mariner's Compass has radiating points like a compass rose
   * Colors must stay CONSISTENT for the precision star effect
   * COLOR1 = background, COLOR2 = primary points, COLOR3 = secondary points
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[0]
      ];
    }
    
    // Consistent colors every block - precision compass requires alignment
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default MarinersCompass;