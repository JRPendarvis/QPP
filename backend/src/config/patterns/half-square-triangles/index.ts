import { PatternDefinition } from '../types';
import { HALF_SQUARE_TRIANGLES_TEMPLATE } from './template';
import { HALF_SQUARE_TRIANGLES_PROMPT } from './prompt';

const HalfSquareTriangles: PatternDefinition = {
  id: 'half-square-triangles',
  name: 'Half Square Triangles',
  template: HALF_SQUARE_TRIANGLES_TEMPLATE,
  prompt: HALF_SQUARE_TRIANGLES_PROMPT,
  minColors: 2,
  maxColors: 8,
  
  /**
   * Half Square Triangle (HST) is a square divided diagonally into 2 triangles
   * The most versatile quilting unit - basis for many patterns
   * COLOR1 = one triangle, COLOR2 = other triangle
   * With multiple fabrics, creates "scrappy" look by rotating the second triangle color
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
    
    // 3+ fabrics: first triangle consistent, rotate second triangle for scrappy look
    const triangle1 = fabricColors[0];
    const triangle2Options = fabricColors.slice(1);
    const triangle2 = triangle2Options[blockIndex % triangle2Options.length];
    
    return [triangle1, triangle2];
  }
};

export default HalfSquareTriangles;