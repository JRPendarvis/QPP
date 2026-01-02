import { PatternPrompt } from '../../../types/PatternPrompt';

export const NINE_PATCH_PROMPT: PatternPrompt = {
  patternName: 'Nine Patch',
  recommendedFabricCount: 2,
  
  characteristics: `Nine Patch is a fundamental 3x3 grid pattern:
- Nine equal squares arranged in a 3x3 grid
- Classic version alternates two colors in checkerboard style
- Corners + center (5 squares) typically one color
- Cross/plus/edges (4 squares) typically contrasting color
- Foundation block for many complex patterns (Double Nine Patch, Irish Chain, etc.)
- Simple construction with high design flexibility
- Creates strong secondary patterns when blocks are tiled
- Perfect beginner pattern - teaches essential piecing skills`,

  fabricRoleGuidance: `Nine Patch fabric assignments (supports 2-5 fabrics):

WITH 2 FABRICS (traditional - recommended):
- BACKGROUND (fabricColors[0]): Corners + center (5 squares total)
- PRIMARY (fabricColors[1]): Cross/plus/edges (4 squares forming + shape)

Classic checkerboard approach with maximum clarity and simplicity.

Grid layout:
[BG] [PR] [BG]
[PR] [BG] [PR]
[BG] [PR] [BG]

WITH 3 FABRICS (scrappy start):
- BACKGROUND (fabricColors[0]): Corners + center (consistent across all blocks)
- PRIMARY (fabricColors[1]): Cross in some blocks
- SECONDARY (fabricColors[2]): Cross in other blocks (alternates with Primary)

Background stays constant while cross color alternates for variety.

WITH 4-5 FABRICS (scrappy):
- BACKGROUND (fabricColors[0]): Corners + center (consistent across all blocks)
- PRIMARY through CONTRAST (fabricColors[1-4]): Cross colors rotate block-to-block

Maximum variety while maintaining the classic nine-patch structure through 
consistent Background squares.

DESIGN TIP: Use high contrast between Background and cross fabrics so the 
checkerboard pattern reads clearly. For scrappy versions, ensure all cross 
fabrics contrast well with Background.`,

  cuttingInstructions: `Nine Patch cutting specifics:

All squares are equal size: 1/3 of finished block width + seam allowance
Example: For 9" finished block, cut 3.5" squares (3" finished + 1/2" seam allowance)

BACKGROUND fabric (fabricColors[0]):
- Cut 5 squares per block (4 corners + 1 center)

PRIMARY, SECONDARY, ACCENT, CONTRAST fabrics (fabricColors[1-4]):
- Cut 4 squares per block (the cross/plus)

CUTTING METHODS:

1. **Individual squares**: Cut each square separately for precise control

2. **Strip piecing** (recommended for efficiency and accuracy):
   - For 2-fabric traditional version:
     - Strip Set A: Background-Primary-Background (yields top and bottom rows)
     - Strip Set B: Primary-Background-Primary (yields middle row)
   - Sew strips together
   - Cross-cut into segments
   - Join segments to form complete nine-patch

For scrappy quilts: Cut cross squares from multiple fabrics, keep Background consistent.`,

  assemblyNotes: `Assembly tips for Nine Patch:

CONSTRUCTION:
1. Arrange 9 squares in 3x3 grid according to pattern
2. Sew top row (3 squares)
3. Sew middle row (3 squares)
4. Sew bottom row (3 squares)
5. Press seams in ALTERNATING directions:
   - Top row: press seams left (or toward darker fabric)
   - Middle row: press seams right (or toward darker fabric)
   - Bottom row: press seams left (or toward darker fabric)
6. Pin rows together at seam intersections, nesting seams
7. Sew rows together
8. Press final seams (typically away from center or open)
9. Square up block if needed

ACCURACY TIPS:
- All 9 squares must be EXACTLY the same size
- Consistent scant 1/4" seam allowance throughout
- Alternating seam directions ensures seams nest perfectly
- Pin at every seam intersection before joining rows
- All seam intersections should be crisp with all squares meeting precisely

STRIP PIECING EFFICIENCY:
- Cut strips equal to square size (including seam allowance)
- Sew strips into sets, press, then crosscut
- Much faster than individual squares for multiple blocks
- Maintains more consistent sizing

For scrappy layouts: Rotate which cross fabric you use from block to block.`,

  commonMistakes: `Avoid these Nine Patch mistakes:
- Inconsistent square sizes (grid won't align, intersections won't meet)
- Not planning color placement before cutting (creates chaotic scrappy look)
- Pressing all seams the same direction (seams won't nest, creates bulk)
- Not pinning at seam intersections before joining rows (misaligned center)
- Misaligned seam intersections (the hallmark of careless nine-patch construction)
- Using fabrics without enough contrast between Background and cross (pattern disappears)
- In scrappy versions: clustering similar colors in adjacent squares (loses visual interest)
- Not squaring up blocks before assembly (small errors compound across quilt)
- Stretching bias... wait, there are no bias edges in nine patch! (All edges are straight grain)`
};