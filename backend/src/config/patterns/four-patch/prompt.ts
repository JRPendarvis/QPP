import { PatternPrompt } from '../types';

export const FOUR_PATCH_PROMPT: PatternPrompt = {
  patternName: 'Four Patch',
  recommendedFabricCount: 2,
  
  characteristics: `Four Patch is a fundamental building-block pattern based on 2x2 units:
- Each four-patch unit is a 2x2 grid with matching colors on opposite diagonals
- The diagonal pairing creates visual continuity within each unit
- Foundation for many complex patterns (Double Four Patch, Sixteen Patch, etc.)
- Simple construction, perfect for beginners
- With multiple fabrics, different four-patch units can showcase different color combinations`,

  fabricRoleGuidance: `Four Patch fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): One diagonal pair (top-left, bottom-right)
- COLOR2 (SECONDARY): Opposite diagonal pair (top-right, bottom-left)

WITH 3 FABRICS:
- COLOR1 (BACKGROUND): Consistent across all units on one diagonal position
- COLOR2 (PRIMARY): Alternates with COLOR3 on remaining positions
- COLOR3 (ACCENT): Alternates with COLOR2 for variety

WITH 4 FABRICS:
- Colors are used in pairs — each pair shares a four-patch unit
- Pair 1: COLOR1/COLOR2 on opposite diagonals
- Pair 2: COLOR3/COLOR4 on opposite diagonals
- Units with different pairs alternate across the quilt

WITH 5-8 FABRICS (scrappy):
- COLOR1 (BACKGROUND): Consistent diagonal position across all blocks
- COLOR2-8 (PRIMARY options): Rotate through remaining positions block-to-block

Contrast within each pair defines the checkerboard effect; contrast between pairs adds variety across the quilt.`,

  cuttingInstructions: `Four Patch cutting specifics:
- Cut equal-sized squares from each fabric
- Four squares make one four-patch unit (two of each paired color)
- Strip piecing is efficient: sew strips together, crosscut, then join segments
- All squares within a unit must be identical size
- For scrappy quilts: cut squares from multiple fabrics`,

  assemblyNotes: `Assembly tips for Four Patch:
- Sew paired squares into two-patches first
- Join two-patches with seams nesting (press in opposite directions)
- For multi-unit layouts, arrange units before sewing to balance color placement
- Press final seams consistently for flat intersections
- For scrappy layouts: plan which fabric pairs go in which units`,

  commonMistakes: `Avoid these Four Patch mistakes:
- Placing same colors adjacent instead of diagonal within a unit
- Inconsistent square sizes (intersections won't align)
- Not planning color pair placement across multiple units
- Pressing all seams the same direction (seams won't nest)
- In scrappy versions: too many similar-value fabrics in one unit (loses contrast)`
};