import { PatternDefinition } from '../types';
import { CHECKERBOARD_TEMPLATE } from './template';
import { CHECKERBOARD_PROMPT } from './prompt';

const Checkerboard: PatternDefinition = {
  id: 'checkerboard',
  name: 'Checkerboard',
  template: CHECKERBOARD_TEMPLATE,
  prompt: CHECKERBOARD_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Checkerboard uses 2 colors in alternating squares
   * With multiple fabrics, creates "scrappy" look by rotating the second color
   * COLOR1 stays consistent; COLOR2 rotates per block
   */
  getColors: (fabricColors: string[], blockIndex: number = 0): string[] => {
    if (fabricColors.length < 2) {
      return [fabricColors[0], fabricColors[0]];
    }
    
    if (fabricColors.length === 2) {
      return [fabricColors[0], fabricColors[1]];
    }
    
    // 3+ fabrics: first is always primary, rotate through rest for alternating squares
    const primary = fabricColors[0];
    const secondaryOptions = fabricColors.slice(1);
    const secondary = secondaryOptions[blockIndex % secondaryOptions.length];
    
    return [primary, secondary];
  }
};

export default Checkerboard;