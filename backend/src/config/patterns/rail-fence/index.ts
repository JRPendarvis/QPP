import { PatternDefinition } from '../types';
import { RAIL_FENCE_TEMPLATE } from './template';
import { RAIL_FENCE_PROMPT } from './prompt';

const RailFence: PatternDefinition = {
  id: 'rail-fence',
  name: 'Rail Fence',
  template: RAIL_FENCE_TEMPLATE,
  prompt: RAIL_FENCE_PROMPT,
  minColors: 3,
  maxColors: 4,
   allowRotation: false,
  /**
   * Rail Fence has 3 horizontal strips (rails) per block
   * Colors stay CONSISTENT across all blocks - the zigzag effect comes from rotation
   * COLOR1 = top rail, COLOR2 = middle rail, COLOR3 = bottom rail
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    if (fabricColors.length < 3) {
      // Need at least 3 for proper rail fence
      return [
        fabricColors[0],
        fabricColors[1] || fabricColors[0],
        fabricColors[0]
      ];
    }
    
    // Consistent colors every block - zigzag comes from block rotation, not color changes
    return [fabricColors[0], fabricColors[1], fabricColors[2]];
  }
};

export default RailFence;