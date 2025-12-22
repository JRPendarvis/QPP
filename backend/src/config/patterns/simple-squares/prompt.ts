import { PatternPrompt } from '../types';

export const SIMPLE_SQUARES_PROMPT: PatternPrompt = {
  patternName: 'Simple Squares',
  recommendedFabricCount: 3,
  
  characteristics: `Simple Squares is the most basic and versatile quilt pattern:
- A grid of equal-sized squares
- Grid size adjusts based on number of fabrics (2-8)
- Each fabric appears at least once; some may repeat for balance
- No triangles or complex piecing — just squares
- Perfect for showcasing fabric collections or novelty prints
- When tiled, creates a classic patchwork look`,

  fabricRoleGuidance: `For Simple Squares specifically:
- All fabrics are treated equally — no background/accent hierarchy
- COLOR1 through COLOR8 fill squares based on how many fabrics are provided
- Fabrics are distributed to avoid same-color adjacency where possible
- High contrast between fabrics creates a bold look; low contrast creates subtle texture
- Large-scale prints work well as they're showcased uninterrupted`,

  cuttingInstructions: `Simple Squares cutting specifics:
- Cut all fabrics into equal-sized squares
- Add 1/2 inch seam allowance to desired finished size
- Number of squares per fabric depends on quilt size and layout
- Strip-cutting is efficient: cut strips, then crosscut into squares`,

  assemblyNotes: `Assembly tips for Simple Squares:
- Lay out all squares before sewing to finalize placement
- Sew squares into rows
- Press seams in alternating directions row by row
- Join rows with nested seams for crisp intersections
- Consider color value placement for visual balance`,

  commonMistakes: `Avoid these Simple Squares mistakes:
- Sewing without planning layout first
- Placing same fabrics adjacent unintentionally (unless desired)
- Inconsistent seam allowances causing misaligned intersections
- Not pressing seams consistently`
};