import { PatternPrompt } from '../types';

export const RAIL_FENCE_PROMPT: PatternPrompt = {
  patternName: 'Rail Fence',
  recommendedFabricCount: 3,
  
  characteristics: `Rail Fence is one of the simplest strip-pieced patterns:
- Three horizontal strips of equal height stacked vertically
- Each strip is a different fabric
- When blocks are rotated (alternating 0° and 90°) and tiled, creates a zigzag or woven appearance
- Also called "Split Rail" or "Basket Weave" depending on layout
- The magic happens in the quilt layout, not the individual block
- Block orientation is intentional — planned rotation creates the pattern`,

  fabricRoleGuidance: `Rail Fence fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1 (PRIMARY): Top and bottom strips
- COLOR2 (BACKGROUND): Middle strip
- Creates a framed stripe effect

WITH 3 FABRICS (traditional):
- COLOR1 (LIGHT): Top strip — creates visual movement when tiled
- COLOR2 (MEDIUM): Middle strip — anchors the block
- COLOR3 (DARK): Bottom strip — grounds the design

WITH 4 FABRICS:
- Four strips per block instead of three
- COLOR1-4: Each strip a unique fabric, arranged light to dark (or vice versa)

WITH 5-8 FABRICS (scrappy):
- COLOR1 (BACKGROUND): Consistent middle strip across all blocks
- COLOR2-8 (PRIMARY options): Top and bottom strips rotate colors block-to-block

Arrange fabrics light to dark (or dark to light) for the strongest zigzag effect when tiled. Value contrast between strips is more important than color contrast.

Note: Block orientation is intentional — alternating 0° and 90° rotation at layout creates the zigzag or basketweave effect.`,

  cuttingInstructions: `Rail Fence cutting specifics:
- Cut three strips of equal width in different fabrics
- Strip width = finished block size ÷ 3 (plus seam allowances)
- This is ideal for strip-piecing: sew long strips together, then crosscut into blocks
- For scrappy versions: make multiple strip sets with different fabric combinations`,

  assemblyNotes: `Assembly tips for Rail Fence:
- Sew the three strips together along the long edges
- Press seams in one direction
- Crosscut the strip set into squares
- Rotate alternating blocks 90° when assembling the quilt top
- Try different layouts: zigzag, basketweave, or planned rotation patterns
- For scrappy layouts: distribute different strip sets evenly across the quilt`,

  commonMistakes: `Avoid these Rail Fence mistakes:
- Unequal strip widths (blocks won't tile properly)
- Forgetting to rotate blocks when assembling (loses the woven effect)
- Using fabrics with too similar values (zigzag pattern disappears)
- Inconsistent seam allowances (strips won't align across blocks)
- Random rotation instead of planned alternation (pattern becomes chaotic)
- In scrappy versions: not stepping back to check value distribution`
};