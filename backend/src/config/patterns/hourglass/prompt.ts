import { PatternPrompt } from '../types';

export const HOURGLASS_PROMPT: PatternPrompt = {
  patternName: 'Hourglass',
  recommendedFabricCount: 2,
  
  characteristics: `Hourglass is a simple but dynamic block divided by both diagonals:
- Square divided into four triangles meeting at center point
- Opposite triangles share the same color (top+bottom, left+right)
- Creates the visual effect of two interlocking bow-ties or an hourglass shape
- With 2 colors: Classic hourglass with strong X pattern
- With 4 colors: Each triangle unique
- With 5-8 colors: Multiple hourglass units in a 2x2 grid
- When tiled, creates dramatic zigzag and diamond patterns`,

  fabricRoleGuidance: `For Hourglass specifically:
- 2 colors: COLOR1 top+bottom triangles, COLOR2 left+right triangles
- 3 colors: Top, bottom, and left+right each distinct
- 4 colors: Each triangle unique
- 5-8 colors: Color pairs distributed across 2x2 hourglass grid
- High contrast between opposite triangle pairs emphasizes the hourglass shape
- Rotation when tiling creates different secondary patterns`,

  cuttingInstructions: `Hourglass cutting specifics:
- Made from quarter-square triangles (QST)
- Method 1: Cut two squares, make HSTs, then cut and re-sew into QSTs
- Method 2: Cut squares, mark both diagonals, sew, cut apart
- Starting squares should be 1 1/4" larger than finished block size
- Each hourglass requires 4 triangles (2 of each opposing color)`,

  assemblyNotes: `Assembly tips for Hourglass:
- Make two half-square triangles first (opposite color pairs)
- Place HSTs right sides together with opposite colors aligned
- Draw diagonal, sew 1/4" on each side, cut apart
- Press seams open or to one side consistently
- Trim to exact size before joining blocks`,

  commonMistakes: `Avoid these Hourglass mistakes:
- Stretching bias edges (all edges are bias in this block)
- Opposite triangles not matching colors (breaks hourglass effect)
- Inconsistent seam allowances (center point won't meet)
- Not trimming to size (blocks won't tile evenly)
- Pressing inconsistently (seams won't nest when tiled)`
};