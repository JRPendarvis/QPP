import { PatternPrompt } from '../types';

export const HALF_SQUARE_TRIANGLES_PROMPT: PatternPrompt = {
  patternName: 'Half-Square Triangles',
  recommendedFabricCount: 2,
  
  characteristics: `Half-Square Triangles (HST) is the fundamental diagonal-split unit in quilting:
- Each HST unit is a square divided diagonally into two triangles
- Each unit uses a pair of fabrics — one per triangle
- Foundation for countless patterns: pinwheels, chevrons, zigzags, stars, and more
- Rotation and arrangement of HSTs creates infinite design possibilities
- Simple construction, endlessly versatile
- Orientation is critical — triangle direction creates the pattern`,

  fabricRoleGuidance: `Half-Square Triangle fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): One triangle in each HST unit
- COLOR2 (BACKGROUND): Opposite triangle in each HST unit

WITH 3 FABRICS:
- COLOR1 (BACKGROUND): Consistent triangle position across all units
- COLOR2 (PRIMARY): Opposite triangle in half the units
- COLOR3 (ACCENT): Opposite triangle in remaining units, alternating with COLOR2

WITH 4 FABRICS:
- Colors are used in pairs — each pair shares one HST unit
- Pair 1: COLOR1/COLOR2 on opposite triangles
- Pair 2: COLOR3/COLOR4 on opposite triangles
- Different pairs alternate across the quilt

WITH 5-8 FABRICS (scrappy):
- COLOR1 (BACKGROUND): Consistent triangle position across all units
- COLOR2-8 (PRIMARY options): Opposite triangles rotate through available colors block-to-block

Contrast within each pair defines the diagonal split. Contrast between pairs adds variety across the quilt.

Note: Triangle orientation is not randomized — consistent direction is essential for the pattern to emerge.`,

  cuttingInstructions: `Half-Square Triangle cutting specifics:
- Traditional method: Cut squares, draw diagonal, sew both sides, cut apart (yields 2 HSTs)
- Cut starting squares 7/8" larger than finished HST size
- Alternative: Use triangle paper or specialty rulers
- Stitch-and-flip method works for smaller HSTs
- Trim all HSTs to exact size for precise piecing
- For scrappy quilts: cut squares from multiple fabrics, keeping one consistent`,

  assemblyNotes: `Assembly tips for Half-Square Triangles:
- Press seams toward the darker triangle (or open for less bulk)
- Trim dog ears after pressing
- Square up each HST before assembling into larger units
- Plan orientation before sewing — rotation changes the pattern dramatically
- Nest seams when joining multiple HSTs
- For scrappy layouts: lay out all units before sewing to check color balance and direction`,

  commonMistakes: `Avoid these Half-Square Triangle mistakes:
- Stretching bias edges (triangles distort)
- Inconsistent HST sizes (blocks won't align)
- Not trimming to exact size (small errors compound)
- Random orientation without planning (loses intended pattern)
- Pressing all seams the same direction when nesting is needed
- In scrappy versions: losing the consistent background triangle (breaks the pattern)`
};