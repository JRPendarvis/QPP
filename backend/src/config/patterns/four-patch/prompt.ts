import { PatternPrompt } from '../types';

export const FOUR_PATCH_PROMPT: PatternPrompt = {
  patternName: 'Four Patch',
  recommendedFabricCount: 4,
  
  characteristics: `Four Patch is a fundamental building-block pattern based on 2x2 grids:
- Each block is a simple 2x2 grid (4 squares total)
- Typically uses diagonal pairing - matching colors on opposite corners
- One of the simplest and most versatile quilt blocks
- Foundation for many complex patterns (Double Four Patch, Sixteen Patch, etc.)
- Perfect for beginners learning to piece accurately
- With multiple fabrics and block rotation, creates secondary patterns when tiled
- Can be arranged for checkerboard, diagonal, or more complex layouts`,

  fabricRoleGuidance: `Four Patch fabric assignments (supports 3-4 fabrics):

WITH 3 FABRICS:
- BACKGROUND (fabricColors[0]): Typically appears in 2 diagonal squares
- PRIMARY (fabricColors[1]): Main contrast color (1-2 squares)
- SECONDARY (fabricColors[2]): Supporting color (1-2 squares)

Blocks rotate between different 3-color combinations for variety:
- Pattern A: Background diagonal (TL, BR), Primary + Secondary in other corners
- Pattern B: Primary diagonal, Background + Secondary in other corners
- Pattern C: Secondary diagonal, Background + Primary in other corners

This creates visual interest as blocks alternate patterns across the quilt.

WITH 4 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Foundation color (typically 1 square per block)
- PRIMARY (fabricColors[1]): Main feature (typically 1 square per block)
- SECONDARY (fabricColors[2]): Supporting color (typically 1 square per block)
- ACCENT (fabricColors[3]): Pop color (typically 1 square per block)

Blocks rotate the position of each color (90° rotations), creating maximum variety 
across the quilt while maintaining the four-patch structure.

DESIGN TIP: Use high contrast between colors so the individual squares read clearly. 
For scrappy quilts, vary the color positions block-to-block to prevent predictable patterns.`,

  cuttingInstructions: `Four Patch cutting specifics:

Cut equal-sized squares from each fabric:
- BACKGROUND fabric (fabricColors[0]): Multiple squares
- PRIMARY fabric (fabricColors[1]): Multiple squares
- SECONDARY fabric (fabricColors[2]): Multiple squares
- ACCENT fabric (fabricColors[3]) - if using 4 fabrics: Multiple squares

CUTTING METHODS:
1. **Individual squares**: Cut each square separately for precise control
2. **Strip piecing** (recommended for efficiency):
   - Cut strips equal to square finished size + seam allowance
   - Sew strips together in pairs
   - Cross-cut the strip sets into segments
   - Join segments to form four-patch units

For a 6" finished block: Cut 3.5" squares (includes 1/4" seam allowance on all sides)
All squares must be identical size for proper alignment.`,

  assemblyNotes: `Assembly tips for Four Patch:

CONSTRUCTION:
1. Arrange 4 squares in 2x2 grid according to pattern
2. Sew top two squares together (top row)
3. Sew bottom two squares together (bottom row)
4. Press seams in OPPOSITE directions (top row left, bottom row right)
5. Pin rows together at center intersection, nesting seams
6. Sew rows together
7. Press final seam (typically toward darker fabric or open)

ACCURACY TIPS:
- Use consistent scant 1/4" seam allowance
- Press after each seam (don't skip steps)
- Opposing seam directions ensure seams nest perfectly at center
- Pin at seam intersections before sewing rows together
- The center point should be crisp with all four squares meeting precisely

LAYOUT PLANNING:
- Lay out ALL blocks before final assembly
- Rotate blocks to create secondary patterns across the quilt
- For 3-fabric version: alternate which color forms the diagonal
- For 4-fabric version: rotate positions to distribute colors evenly
- Step back and check overall color balance before sewing blocks together`,

  commonMistakes: `Avoid these Four Patch mistakes:
- Inconsistent square sizes (causes misalignment at intersections)
- Not pressing seams in opposite directions (seams won't nest, creates bulk)
- Skipping the pinning step at center intersection (center won't be crisp)
- Using scant seams on one side, generous on other (creates lopsided blocks)
- Not checking that all four squares meet precisely at center point
- Pressing seams too hard (distorts bias edges, stretches fabric)
- In multi-block layouts: not planning color rotation (creates unintended patterns)
- Using four similar-value fabrics (pattern disappears, reads as solid block)
- Not trimming blocks to exact size before assembly (compounds alignment errors)`
};