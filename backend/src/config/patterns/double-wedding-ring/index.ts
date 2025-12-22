import { PatternDefinition } from '../types';
import { DOUBLE_WEDDING_RING_TEMPLATE } from './template';
import { DOUBLE_WEDDING_RING_PROMPT } from './prompt';

const DoubleWeddingRing: PatternDefinition = {
  id: 'double-wedding-ring',
  name: 'Double Wedding Ring',
  template: DOUBLE_WEDDING_RING_TEMPLATE,
  prompt: DOUBLE_WEDDING_RING_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Double Wedding Ring uses multiple colors in interlocking rings
   * With multiple fabrics, creates "scrappy" look by rotating the secondary colors
   * COLOR1 stays consistent; other colors rotate per block
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

export default DoubleWeddingRing;