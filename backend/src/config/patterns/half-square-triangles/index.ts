import { PatternDefinition } from '../types';
import { HALF_SQUARE_TRIANGLES_TEMPLATE } from './template';
import { HALF_SQUARE_TRIANGLES_PROMPT } from './prompt';

const HalfSquareTriangles: PatternDefinition = {
  id: 'half-square-triangles',
  name: 'Half Square Triangles',
  template: HALF_SQUARE_TRIANGLES_TEMPLATE,
  prompt: HALF_SQUARE_TRIANGLES_PROMPT,
  minFabrics: 2,
  maxFabrics: 6,
  allowRotation: true,
  
  /**
   * Half Square Triangle (HST) - the most versatile quilting unit
   * fabricColors[0] = Background (one triangle, typically consistent)
   * fabricColors[1] = Primary (other triangle)
   * fabricColors[2] = Secondary (alternate triangle color for scrappy look)
   * fabricColors[3] = Accent (more triangle variety)
   * fabricColors[4] = Contrast (additional variety)
   * fabricColors[5] = Additional (maximum scrappy effect)
   * 
   * Each HST block is a square divided diagonally into 2 triangles
   * 
   * 2 fabrics: Traditional consistent HST (Background + Primary)
   * 3-6 fabrics: Scrappy HSTs - Background stays consistent, other triangle rotates
   * 
   * Returns: [triangle1, triangle2]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const blockIndex = opts.blockIndex ?? 0;
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    
    if (fabricColors.length < 3) {
      // 2 fabrics: consistent HST
      return [background, primary];
    }
    
    // 3-6 fabrics: Background consistent, rotate through Primary, Secondary, Accent, Contrast, Additional
    const triangleOptions = fabricColors.slice(1); // All non-background fabrics
    const triangle2 = triangleOptions[blockIndex % triangleOptions.length];
    
    return [background, triangle2];
  }
};

export default HalfSquareTriangles;