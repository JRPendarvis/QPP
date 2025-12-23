import { PatternDefinition } from '../types';
import { DRUNKARDS_PATH_TEMPLATE } from './template';
import { DRUNKARDS_PATH_PROMPT } from './prompt';

const DrunkardsPath: PatternDefinition = {
  id: 'drunkards-path',
  name: "Drunkard's Path",
  template: DRUNKARDS_PATH_TEMPLATE,
  prompt: DRUNKARDS_PATH_PROMPT,
  minColors: 2,
  maxColors: 2,
  
  /**
   * Drunkard's Path has a quarter circle creating curved, winding paths
   * Colors must stay CONSISTENT - the path effect comes from block rotation
   * COLOR1 = background, COLOR2 = quarter circle (path)
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    
    // Consistent colors every block - curves must align for path effect
    return [fabricColors[0], fabricColors[1]];
  }
};

export default DrunkardsPath;