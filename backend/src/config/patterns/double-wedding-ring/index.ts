import { PatternDefinition } from '../types';
import { DOUBLE_WEDDING_RING_TEMPLATE } from './template';
import { DOUBLE_WEDDING_RING_PROMPT } from './prompt';

const DoubleWeddingRing: PatternDefinition = {
  id: 'double-wedding-ring',
  name: 'Double Wedding Ring',
  template: DOUBLE_WEDDING_RING_TEMPLATE,
  prompt: DOUBLE_WEDDING_RING_PROMPT,
  minColors: 3,
  maxColors: 4,
   allowRotation: false,
  /**
   * Double Wedding Ring has interlocking curved rings
   * Colors must stay CONSISTENT for the rings to interlock properly
   * COLOR1 = background, COLOR2 = ring arcs, COLOR3 = melon connectors
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
    
    // Consistent colors every block - rings must align for interlocking effect
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default DoubleWeddingRing;