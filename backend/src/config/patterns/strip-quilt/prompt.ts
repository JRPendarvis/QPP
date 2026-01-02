// prompt.ts
import { PatternPrompt } from '../../../types/PatternPrompt';

export const STRIP_QUILT_PROMPT: PatternPrompt = {
  patternName: 'Strip Quilt',
  recommendedFabricCount: 4,

  characteristics: `Strip Quilt is a simple vertical strip pattern:
- 4 equal vertical strips running the full height of the block
- Fast to piece and very beginner-friendly
- Great for bold graphic looks or smooth gradients (ombré)
- When blocks are tiled, the design reads as continuous columns across the quilt
- Perfect for showcasing a coordinated palette without complex piecing`,

  fabricRoleGuidance: `Strip Quilt fabric assignments (supports 3–8 fabrics):

This pattern displays FOUR strips, with guided color balance:

- BACKGROUND (fabricColors[0]) → Strip 1 (COLOR1)
- PRIMARY (fabricColors[1]) → Strip 2 (COLOR2)
- SECONDARY (fabricColors[2]) → Strip 3 (COLOR3)
- ACCENT (chosen from fabricColors[3+]) → Strip 4 (COLOR4)

WITH 3 FABRICS:
- Background / Primary / Secondary are shown.
- Accent falls back to a coordinated choice for a clean, bold look.

WITH 4 FABRICS (recommended):
- Each fabric maps directly left-to-right into the 4 strips.

WITH 5–8 FABRICS:
- Background/Primary/Secondary stay consistent to keep the quilt calm and intentional.
- Extra fabrics rotate into the ACCENT strip so you can showcase more colors without the layout becoming busy.

DESIGN TIP:
- For gradient: arrange fabricColors from light → dark.
- For bold stripes: pick a calm BACKGROUND and use higher contrast between PRIMARY and SECONDARY, with ACCENT providing a pop.`,

  cuttingInstructions: `Strip Quilt cutting specifics:

This block is made from 4 equal-width strips.

Strip width formula:
Finished block width ÷ 4 = finished strip width
Add seam allowance for cutting (+ 1/2" total for both sides).

Example: 12" finished block:
12 ÷ 4 = 3" finished strip width
Cut strips at 3 1/2" wide

CUTTING METHOD:
1. Cut 4 strips (one per displayed strip role)
2. Sew strips together along long edges with a consistent 1/4" seam allowance
3. Press seams consistently (often toward darker fabrics)
4. Crosscut into blocks as needed if using strip sets

EFFICIENCY TIP:
This pattern is ideal for strip sets: sew long strips together first, then cut into blocks for speed and consistency.`,

  assemblyNotes: `Assembly tips for Strip Quilt:

CONSTRUCTION:
1. Arrange strips in order (left to right)
2. Sew long edges with a consistent 1/4" seam allowance
3. Press seams in one direction for a flatter finish
4. Square up blocks if needed

ACCURACY TIPS:
- Pin long seams frequently to prevent shifting
- Avoid stretching strips while sewing
- Press carefully to prevent distortion of long pieces`,

  commonMistakes: `Avoid these Strip Quilt mistakes:
- Unequal strip widths (wonky columns)
- Stretching long strips while sewing (rippling)
- Not pinning long seams (misalignment)
- Pressing too hard (distortion)
- Cutting strips off-grain (bias stretch and warping)
- Using too many same-value fabrics (stripes blend together)
- Using too many high-contrast fabrics without a calm BACKGROUND (busy look)`
};
