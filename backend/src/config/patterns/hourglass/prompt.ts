import { PatternPrompt } from '../types';

export const HOURGLASS_PROMPT: PatternPrompt = {
  patternName: 'Hourglass',
  recommendedFabricCount: 2,
  
  characteristics: `Hourglass is a simple but dynamic block divided by both diagonals:
- Square divided into four triangles meeting at center point
- Opposite triangles share the same color (top+bottom, left+right)
- Creates the visual effect of two interlocking bow-ties or an hourglass shape
- When tiled, creates dramatic zigzag and diamond patterns
- Made from quarter-square triangles (QST)
- Rotation when tiling creates different secondary patterns`,

  fabricRoleGuidance: `Hourglass fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): Top and bottom triangles — forms the hourglass shape
- COLOR2 (BACKGROUND): Left and right triangles — frames the hourglass

WITH 3 FABRICS:
- COLOR1 (PRIMARY): Top triangle
- COLOR2 (SECONDARY): Bottom triangle
- COLOR3 (BACKGROUND): Left and right triangles — consistent framing

WITH 4 FABRICS:
- COLOR1: Top triangle
- COLOR2: Bottom triangle
- COLOR3: Left triangle
- COLOR4: Right triangle
- Each triangle is unique — creates a pinwheel-like effect

WITH 5-8 FABRICS (scrappy):
- COLOR1 (BACKGROUND): Consistent left+right triangles across all blocks
- COLOR2-8 (PRIMARY options): Top and bottom triangles rotate colors block-to-block
- Creates variety while maintaining the hourglass structure

High contrast between opposite triangle pairs (top+bottom vs. left+right) emphasizes the hourglass shape.`,

  cuttingInstructions: `Hourglass cutting specifics:
- Made from quarter-square triangles (QST)
- Method 1: Cut two squares, make HSTs, then cut and re-sew into QSTs
- Method 2: Cut squares, mark both diagonals, sew, cut apart
- Starting squares should be 1 1/4" larger than finished block size
- Each hourglass requires 4 triangles (2 of each opposing color)
- For scrappy quilts: cut triangles from multiple fabrics for top/bottom positions`,

  assemblyNotes: `Assembly tips for Hourglass:
- Make two half-square triangles first (opposite color pairs)
- Place HSTs right sides together with opposite colors aligned
- Draw diagonal, sew 1/4" on each side, cut apart
- Press seams open or to one side consistently
- Trim to exact size before joining blocks
- For scrappy layouts: keep left+right triangles consistent, vary top+bottom`,

  commonMistakes: `Avoid these Hourglass mistakes:
- Stretching bias edges (all edges are bias in this block)
- Opposite triangles not matching colors (breaks hourglass effect)
- Inconsistent seam allowances (center point won't meet)
- Not trimming to size (blocks won't tile evenly)
- Pressing inconsistently (seams won't nest when tiled)
- In scrappy versions: varying all four triangles instead of keeping opposite pairs consistent`
};