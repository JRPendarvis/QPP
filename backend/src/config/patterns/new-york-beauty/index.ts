import { PatternDefinition } from '../types';
import { NEW_YORK_BEAUTY_TEMPLATE } from './template';
import { NEW_YORK_BEAUTY_PROMPT } from './prompt';

const NewYorkBeauty: PatternDefinition = {
  id: 'new-york-beauty',
  name: 'New York Beauty',
  template: NEW_YORK_BEAUTY_TEMPLATE,
  prompt: NEW_YORK_BEAUTY_PROMPT,
  minColors: 3,
  maxColors: 4,
  
  /**
   * New York Beauty has curved arcs with pointed spikes radiating from a corner
   * Colors must stay CONSISTENT for the dramatic arc effect to work
   * COLOR1 = background, COLOR2 = arc base, COLOR3 = spikes
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
    
    // Consistent colors every block - arcs and spikes must align
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default NewYorkBeauty;