import { PatternDefinition } from '../types';
import { FLYING_GEESE_TEMPLATE } from './template';
import { FLYING_GEESE_PROMPT } from './prompt';

const FlyingGeese: PatternDefinition = {
  id: 'flying-geese',
  name: 'Flying Geese',
  template: FLYING_GEESE_TEMPLATE,
  prompt: FLYING_GEESE_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Flying Geese has a large center triangle (goose) flanked by two small triangles (sky)
   * COLOR1 = sky/background triangles on sides
   * COLOR2 = goose triangle (the "flying" element)
   * With multiple fabrics, creates "scrappy" flock by rotating goose colors
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;

    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    
    if (fabricColors.length === 2) {
      return [fabricColors[0], fabricColors[1]];
    }
    
    // 3+ fabrics: sky consistent, rotate goose colors for scrappy flock
    const sky = fabricColors[0];
    const gooseOptions = fabricColors.slice(1);
    const goose = gooseOptions[blockIndex % gooseOptions.length];
    
    return [sky, goose];
  }
};

export default FlyingGeese;