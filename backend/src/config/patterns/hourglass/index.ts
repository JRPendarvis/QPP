import { PatternDefinition } from '../types';
import { HOURGLASS_TEMPLATE } from './template';
import { HOURGLASS_PROMPT } from './prompt';

const Hourglass: PatternDefinition = {
  id: 'hourglass',
  name: 'Hourglass',
  template: HOURGLASS_TEMPLATE,
  prompt: HOURGLASS_PROMPT,
  minFabrics: 2,
  maxFabrics: 4,
  allowRotation: true,
  rotationStrategy: 'alternate-180',

  /**
   * Hourglass has 4 quarter-square triangles (QST) forming an hourglass shape
   * fabricColors[0] = Background (top-left and bottom-right triangles)
   * fabricColors[1] = Primary (top-right and bottom-left triangles - the hourglass)
   * fabricColors[2] = Secondary (alternate hourglass color for scrappy look)
   * fabricColors[3] = Accent (additional hourglass variation)
   * 
   * 2 fabrics: Traditional consistent hourglass (Background + Primary)
   * 3-4 fabrics: Scrappy hourglasses - Background stays consistent, hourglass rotates
   * 
   * Returns: [background_triangles, hourglass_triangles]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: traditional consistent hourglass
      return [background, primary];
    }
    
    // 3-4 fabrics: Background consistent, rotate through Primary, Secondary, Accent
    const hourglassOptions = fabricColors.slice(1); // Primary, Secondary, Accent
    const hourglass = hourglassOptions[blockIndex % hourglassOptions.length];
    
    return [background, hourglass];
  }
};

export default Hourglass;