import { PatternPrompt } from '../types';

export const SIMPLE_SQUARES_PROMPT: PatternPrompt = {
  patternName: 'Simple Squares',
  recommendedFabricCount: 2,
  
  characteristics: `Simple Squares is the most basic and versatile quilt pattern:
- A grid of equal-sized squares
- Each fabric appears at least once; some may repeat for balance
- No triangles or complex piecing — just squares
- Perfect for showcasing fabric collections or novelty prints
- When tiled, creates a classic patchwork look
- Ideal beginner pattern`,

  fabricRoleGuidance: `Simple Squares fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1 (PRIMARY): Half of the squares
- COLOR2 (SECONDARY): Remaining squares
- Arranged to avoid same-color adjacency (checkerboard effect)

WITH 3 FABRICS:
- COLOR1-3: Distributed evenly across the grid
- Arranged to avoid same-color adjacency where possible

WITH 4 FABRICS:
- COLOR1-4: Each fabric fills roughly equal portions
- Can arrange in 2x2 repeating units or distribute randomly

WITH 5-8 FABRICS (scrappy):
- COLOR1-8: All fabrics distributed across the grid
- Each fabric appears at least once
- Arranged to maximize variety and avoid same-color adjacency

All fabrics are treated equally — no background/accent hierarchy. High contrast between fabrics creates a bold patchwork look; low contrast creates subtle texture.

Large-scale prints work well as each square showcases the fabric uninterrupted.`,

  cuttingInstructions: `Simple Squares cutting specifics:
- Cut all fabrics into equal-sized squares
- Add 1/2 inch seam allowance to desired finished size
- Number of squares per fabric depends on quilt size and layout
- Strip-cutting is efficient: cut strips, then crosscut into squares
- For scrappy quilts: cut equal numbers from each fabric for balance`,

  assemblyNotes: `Assembly tips for Simple Squares:
- Lay out all squares before sewing to finalize placement
- Sew squares into rows
- Press seams in alternating directions row by row
- Join rows with nested seams for crisp intersections
- Consider color value placement for visual balance
- For scrappy layouts: step back frequently to check overall distribution`,

  commonMistakes: `Avoid these Simple Squares mistakes:
- Sewing without planning layout first
- Placing same fabrics adjacent unintentionally (unless desired)
- Inconsistent seam allowances causing misaligned intersections
- Not pressing seams consistently
- In scrappy versions: clustering similar colors in one area of the quilt`
};