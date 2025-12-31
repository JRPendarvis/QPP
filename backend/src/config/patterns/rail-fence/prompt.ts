import { PatternPrompt } from '../types';

export const RAIL_FENCE_PROMPT: PatternPrompt = {
  patternName: 'Rail Fence',
  recommendedFabricCount: 3,
  
  characteristics: `Rail Fence is one of the simplest strip-pieced patterns:
- Three horizontal strips of equal height stacked vertically
- Each strip is a different fabric (traditionally light, medium, dark)
- Individual blocks are simple - just 3 horizontal stripes
- The magic happens when blocks are rotated 90° during layout
- Alternating horizontal and vertical blocks creates zigzag "rails" across the quilt
- Also called "Split Rail" or "Basket Weave" depending on rotation pattern
- Perfect beginner pattern - teaches strip piecing and layout planning
- Block orientation is intentional, not random - rotation creates the pattern`,

  fabricRoleGuidance: `Rail Fence fabric assignments (supports 3-4 fabrics):

WITH 3 FABRICS (traditional - recommended):
- BACKGROUND (fabricColors[0]): Top rail (first strip)
- PRIMARY (fabricColors[1]): Middle rail (second strip)
- SECONDARY (fabricColors[2]): Bottom rail (third strip)

Classic approach: Arrange fabrics light to dark (or dark to light) for strongest 
zigzag effect when blocks are rotated and tiled.

Layout pattern:
- Block A: [BG] horizontal stripes → Rail 1 (top)
           [PR]                      Rail 2 (middle)
           [SE]                      Rail 3 (bottom)

- Block B: Same block rotated 90° clockwise → Creates vertical stripes

When alternating Block A and Block B across the quilt, the rails create a 
zigzag or woven appearance.

WITH 4 FABRICS:
- BACKGROUND through ACCENT (fabricColors[0-3]): Four rails instead of three
- Allows for more gradual value transitions
- Creates more complex woven pattern when rotated

DESIGN TIP: Value contrast between strips is MORE important than color contrast. 
A clear light-to-dark or dark-to-light progression creates the strongest visual 
zigzag effect. For example: white → gray → black reads better than red → blue → green 
with similar values.

ROTATION IS KEY: The individual blocks are simple horizontal stripes. The 
dramatic zigzag pattern only emerges when blocks are rotated 90° during layout 
in an alternating pattern (horizontal, vertical, horizontal, vertical...).`,

  cuttingInstructions: `Rail Fence cutting specifics:

Strip width formula: Finished block size ÷ 3 + seam allowance
Example: For 9" finished block, each strip is 3.5" wide (3" finished + 1/2" seam)

BACKGROUND fabric (fabricColors[0]):
- Cut strips for top rail

PRIMARY fabric (fabricColors[1]):
- Cut strips for middle rail

SECONDARY fabric (fabricColors[2]):
- Cut strips for bottom rail

CUTTING METHOD - STRIP PIECING (recommended):
1. Cut long strips from each fabric (same width)
2. Sew strips together along long edges (Background-Primary-Secondary)
3. Press seams in one direction (typically toward darker fabric)
4. Cross-cut the strip set into square blocks
5. All blocks from one strip set are identical

For 9" blocks from a 42" strip set:
- Sew 3.5" strips together → yields ~36" usable length
- Cross-cut every 9.5" → yields 4 blocks per strip set

This method is MUCH faster than cutting individual strips per block and 
ensures all blocks are perfectly consistent.`,

  assemblyNotes: `Assembly tips for Rail Fence:

BLOCK CONSTRUCTION:
1. **Sew strips together** along long edges
2. **Press seams** in one consistent direction (toward darker strips)
3. **Cross-cut into squares** (finished block size + 1/2" seam allowance)
4. Each block is 3 horizontal stripes

QUILT LAYOUT (this is where the magic happens!):
1. **Arrange blocks** in alternating rotation:
   - Row 1: Horizontal, Vertical, Horizontal, Vertical...
   - Row 2: Vertical, Horizontal, Vertical, Horizontal...
   - Continue alternating

2. **Classic patterns**:
   - **Zigzag**: Strict alternation creates diagonal rails
   - **Basket Weave**: Different rotation pattern creates woven appearance
   - **Straight Furrows**: All blocks same orientation creates parallel lines

3. **Verify layout** on design wall before sewing blocks together

4. **Sew blocks into rows**, then join rows

PRESSING:
- Press seams within blocks toward darker strips
- When joining blocks, press row seams in alternating directions for nesting

LAYOUT PLANNING:
- Lay out ALL blocks before sewing
- Step back and view from distance
- Small rotation changes create dramatically different effects
- The rotation pattern IS the design`,

  commonMistakes: `Avoid these Rail Fence mistakes:
- Unequal strip widths (blocks won't tile properly, rails won't align)
- Not using strip piecing method (much slower and less consistent)
- Forgetting to rotate blocks during layout (loses the zigzag/woven effect entirely)
- Random block rotation instead of planned pattern (creates chaos, not design)
- Using fabrics with too similar values (zigzag pattern disappears - value matters!)
- Inconsistent seam allowances when piecing strips (strips don't align across blocks)
- Not pressing seams consistently in one direction (creates wavy blocks)
- Pressing too hard (can stretch bias at strip edges)
- Not stepping back to check overall pattern before sewing blocks together
- Cutting individual strips per block instead of using strip sets (wastes time)`
};