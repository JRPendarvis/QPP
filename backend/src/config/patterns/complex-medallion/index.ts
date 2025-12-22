import { PatternDefinition } from '../types';
import { COMPLEX_MEDALLION_TEMPLATE } from './template';
import { COMPLEX_MEDALLION_PROMPT } from './prompt';

const Checkerboard: PatternDefinition = {
  id: 'complex-medallion',
  name: 'Complex Medallion',
  template: COMPLEX_MEDALLION_TEMPLATE,
  prompt: COMPLEX_MEDALLION_PROMPT,
  minColors: 2,
  maxColors: 8,
  
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