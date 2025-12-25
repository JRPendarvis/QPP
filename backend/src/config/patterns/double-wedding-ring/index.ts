import { PatternDefinition } from '../types';
import { DOUBLE_WEDDING_RING_TEMPLATE, DOUBLE_WEDDING_RING_4 } from './template';
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
   * Double Wedding Ring color assignments:
   * - COLOR1: Background - shows through ring centers
   * - COLOR2: Horizontal ring arcs (top/bottom of block)
   * - COLOR3: Vertical ring arcs (left/right of block)
   * - COLOR4: Corner melon connectors (accent, optional)
   * 
   * The horizontal and vertical distinction creates the interlocking effect when tiled.
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const count = fabricColors.length;
    
    if (count < 3) {
      // Minimum 3 colors needed
      return [
        fabricColors[0],                              // COLOR1: background
        fabricColors[1] || fabricColors[0],           // COLOR2: horizontal arcs
        fabricColors[1] || fabricColors[0]            // COLOR3: vertical arcs (same as horizontal if only 2)
      ];
    }
    
    if (count === 3) {
      // 3 colors: background + 2 ring colors
      return [
        fabricColors[0],  // COLOR1: background
        fabricColors[1],  // COLOR2: horizontal arcs
        fabricColors[2]   // COLOR3: vertical arcs
      ];
    }
    
    // 4+ colors: add accent for melon connectors
    return [
      fabricColors[0],  // COLOR1: background
      fabricColors[1],  // COLOR2: horizontal arcs
      fabricColors[2],  // COLOR3: vertical arcs
      fabricColors[3]   // COLOR4: corner melons (accent)
    ];
  },
  
  /**
   * Select template based on color count
   */
  getTemplate: (colors: string[]): string => {
    if (colors.length >= 4) {
      return DOUBLE_WEDDING_RING_4;
    }
    return DOUBLE_WEDDING_RING_TEMPLATE;
  }
};

export default DoubleWeddingRing;