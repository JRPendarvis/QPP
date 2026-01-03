import { PatternDefinition } from '../../../types/PatternDefinition';
import { RAIL_FENCE_TEMPLATE } from './template';
import { RAIL_FENCE_PROMPT } from './prompt';

const RailFence: PatternDefinition = {
  id: 'rail-fence',
  name: 'Rail Fence',
  template: RAIL_FENCE_TEMPLATE,
  prompt: RAIL_FENCE_PROMPT,
  minFabrics: 3,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'alternate-90',
  fabricRoles: [
    'Top Rail',
    'Middle Rail',
    'Bottom Rail',
    'Accent Rail',
  ],
  
  /**
   * Rail Fence - 3 horizontal strips creating zigzag pattern when rotated
   * fabricColors[0] = Background (top rail)
   * fabricColors[1] = Primary (middle rail)
   * fabricColors[2] = Secondary (bottom rail)
   * fabricColors[3] = Accent (optional - can replace any rail for variety)
   * 
   * Colors stay CONSISTENT across all blocks - the zigzag effect comes from 
   * rotating blocks 90° when tiling (vertical, horizontal, vertical, horizontal...)
   * 
   * 3 fabrics: Traditional rail fence (3 rails)
   * 4 fabrics: Allows for variation (can use 4th fabric in place of any rail)
   * 
   * Returns: [top_rail, middle_rail, bottom_rail]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    
    // For 3-fabric version, return the three rails
    return [background, primary, secondary];
  }
};

export default RailFence;