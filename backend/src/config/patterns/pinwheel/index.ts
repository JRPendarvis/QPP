import { PatternDefinition } from '../types';
import { PINWHEEL_TEMPLATE } from './template';
import { PINWHEEL_PROMPT } from './prompt';

const Pinwheel: PatternDefinition = {
  id: 'pinwheel',
  name: 'Pinwheel',
  template: PINWHEEL_TEMPLATE,
  prompt: PINWHEEL_PROMPT,
  minColors: 2,
  maxColors: 8,
   allowRotation: true,
  /**
   * Pinwheel has 4 half-square triangles creating a spinning effect
   * COLOR1 = background triangles, COLOR2 = blade triangles
   * With multiple fabrics, creates "scrappy" pinwheels by rotating blade colors
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
    
    // 3+ fabrics: background consistent, rotate blade colors for scrappy pinwheels
    const background = fabricColors[0];
    const bladeOptions = fabricColors.slice(1);
    const blade = bladeOptions[blockIndex % bladeOptions.length];
    
    return [background, blade];
  }
};

export default Pinwheel;