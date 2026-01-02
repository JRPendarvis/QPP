import { PatternPrompt } from '../../../types/PatternPrompt';

export const HOURGLASS_PROMPT: PatternPrompt = {
  patternName: 'Hourglass',
  recommendedFabricCount: 2,
  
  characteristics: `Hourglass is a dynamic block made from quarter-square triangles (QSTs):
- Square divided by both diagonals into four triangles meeting at center point
- Opposite triangles share the same color creating the hourglass shape
- Two triangles (top-left and bottom-right) form one diagonal pair
- Two triangles (top-right and bottom-left) form the other diagonal pair
- Creates visual effect of two interlocking bow-ties or an hourglass
- When tiled, creates zigzag, diamond, and secondary star patterns
- Rotation creates dramatically different overall designs
- Intermediate skill level - requires accurate QST construction`,

  fabricRoleGuidance: `Hourglass fabric assignments (supports 2-4 fabrics):

WITH 2 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): Top-left and bottom-right triangles (one diagonal pair)
- PRIMARY (fabricColors[1]): Top-right and bottom-left triangles (the hourglass shape)

Classic two-fabric approach creates clear hourglass silhouette and strongest secondary patterns.

WITH 3 FABRICS (scrappy hourglasses):
- BACKGROUND (fabricColors[0]): Top-left and bottom-right triangles (consistent across blocks)
- PRIMARY (fabricColors[1]): Hourglass triangles in some blocks
- SECONDARY (fabricColors[2]): Hourglass triangles in other blocks (alternates with Primary)

Background diagonal stays constant while hourglass diagonal alternates for variety.

WITH 4 FABRICS (maximum scrappy):
- BACKGROUND (fabricColors[0]): Top-left and bottom-right triangles (consistent across blocks)
- PRIMARY (fabricColors[1]): First hourglass color
- SECONDARY (fabricColors[2]): Second hourglass color
- ACCENT (fabricColors[3]): Third hourglass color

Hourglass diagonal rotates through Primary, Secondary, Accent for maximum variety 
while maintaining the hourglass structure through consistent Background diagonal.

CRITICAL: The Background diagonal (top-left + bottom-right) must remain consistent 
across all blocks. Only the hourglass diagonal colors change. This creates visual 
cohesion when blocks are tiled.

DESIGN TIP: Use high contrast between Background and hourglass fabrics. The hourglass 
shape reads most clearly when the two diagonal pairs have strong value contrast.`,

  cuttingInstructions: `Hourglass cutting specifics:

CUTTING SIZE FORMULA:
Finished block size + 1-1/4" = starting square size
Example: For 6" finished block, cut 7-1/4" squares

BACKGROUND fabric (fabricColors[0]):
- Cut squares (quantity depends on quilt size)
- This diagonal stays consistent throughout

PRIMARY, SECONDARY, ACCENT fabrics (fabricColors[1-3]):
- Cut squares from each fabric
- These will form the rotating hourglass diagonal

CONSTRUCTION METHODS:

**Method 1: HST to QST (recommended)**
1. Cut squares from two fabrics
2. Make two half-square triangles (HSTs) with opposite color combinations
3. Place HSTs right sides together with opposite colors touching
4. Draw diagonal perpendicular to existing seam
5. Sew 1/4" on both sides of line
6. Cut on drawn line
7. Press and trim to size
8. Yields 2 identical hourglass blocks

**Method 2: Direct QST**
1. Layer two squares right sides together
2. Draw both diagonals corner to corner (X pattern)
3. Sew 1/4" on both sides of BOTH diagonal lines
4. Cut on both drawn lines
5. Yields 4 hourglass blocks (all identical)

**Method 3: Triangle paper**: Pre-printed lines for accuracy`,

  assemblyNotes: `Assembly tips for Hourglass:

CONSTRUCTION (HST to QST method):
1. Make two HSTs with opposite color pairs:
   - HST #1: Background + Primary
   - HST #2: Background + Primary (opposite arrangement)
2. Place HSTs right sides together, opposite colors aligned
3. Draw diagonal perpendicular to seam line
4. Sew 1/4" on both sides of drawn line
5. Cut on drawn line
6. Press seams open (reduces bulk at center) or to one side consistently
7. Trim to exact size using square ruler

ACCURACY TIPS:
- ALL four edges are bias - handle very carefully to avoid stretching
- The center point where all four triangles meet is critical
- Use starch before cutting to stabilize bias edges
- Press gently - too much pressure distorts the bias
- All blocks must be exactly the same size for proper tiling
- Square up each block before assembly

LAYOUT PLANNING:
- Lay out all blocks before sewing together
- Rotate blocks to create secondary patterns (zigzags, stars, diamonds)
- Small rotation changes create dramatically different effects
- Step back and view from distance before committing

For scrappy quilts: Keep Background diagonal consistent, rotate hourglass diagonal 
colors to distribute Primary, Secondary, Accent evenly across the layout.`,

  commonMistakes: `Avoid these Hourglass mistakes:
- Stretching bias edges (ALL four edges are bias - extremely easy to distort)
- Opposite triangles not matching in color (breaks the hourglass structure)
- Center point not meeting precisely (all four triangles should meet at exact center)
- Inconsistent seam allowances (center won't align, block size varies)
- Not trimming to exact size after construction (blocks won't tile properly)
- Pressing too hard (permanently distorts bias edges)
- Not using starch to stabilize fabrics (bias stretches too easily)
- In scrappy versions: rotating Background diagonal instead of hourglass diagonal
- Mixing up which diagonal should be Background (loses visual consistency)
- Random block rotation without planning (misses opportunities for secondary patterns)`
};