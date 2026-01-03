// src/patterns/blocks/lone-star/prompt.ts

import { PatternPrompt } from '../../../types/PatternPrompt';

export const LONE_STAR_PROMPT: PatternPrompt = {
  patternName: 'Lone Star',
  recommendedFabricCount: 6,

  characteristics: `Lone Star (also called Star of Bethlehem) is a dramatic radiating 8-pointed diamond star:
- Built from rhombus/diamond pieces (NOT a square/HST grid)
- Concentric “rings” radiate from the center to the tips of the points
- Classic look is a graduated sunburst (light→dark or dark→light)
- Typically designed as one large statement star rather than a repeating block grid
- Background/setting pieces surround the star (negative space)
- Advanced pattern: precision + bias edges (and often set-in background pieces) are key
- Also known as: Star of Bethlehem, Blazing Star, Starburst`,

  fabricRoleGuidance: `Lone Star fabric assignments (supports 4–8 fabrics)

IMPORTANT: In QPP, this template maps fabrics to CENTER + RINGS + BACKGROUND.
Rotation is disabled because symmetry is structural.

UI FABRIC ORDER (what the quilter selects):
- fabricColors[0] = BACKGROUND (negative space / setting area)
- fabricColors[1] = CENTER diamond
- fabricColors[2] = Ring 1 (cardinal directions)
- fabricColors[3] = Ring 1 (diagonal directions)
- fabricColors[4] = Ring 2 (cardinal) (optional)
- fabricColors[5] = Ring 2 (diagonal) (optional)
- fabricColors[6] = Ring 3 (cardinal) (optional)
- fabricColors[7] = Ring 3 (diagonal) (optional)

WITH 4 FABRICS (minimum):
- Background
- Center
- Ring 1 (cardinal)
- Ring 1 (diagonal)

WITH 5–6 FABRICS (recommended):
- Background
- Center
- Ring 1 (cardinal + diagonal)
- Ring 2 (cardinal + diagonal)

WITH 7–8 FABRICS (maximum drama):
- Background
- Center
- Ring 1 (cardinal + diagonal)
- Ring 2 (cardinal + diagonal)
- Ring 3 (cardinal + diagonal)

DESIGN STRATEGIES:
1) Value graduation: light center → darker tips (or reverse)
2) Warm-to-cool: warm center → cooler outer rings (or reverse)
3) Monochrome: shades/tints of one color
4) High-contrast rings: make each ring “read” clearly

CRITICAL: Adjacent rings need contrast so the sunburst effect is obvious.`,

  cuttingInstructions: `Cutting notes (real quilting context):

Lone Star is traditionally strip-pieced into diamond segments:
1) Cut strips for each ring fabric
2) Sew strips together in ring order
3) Crosscut the strip set at an angle to create diamond segments
4) Assemble segments into 8 points

Because diamonds include bias edges, accuracy and handling matter:
- Starch fabric before cutting (helps stability)
- Keep seam allowance consistent so rings align
- Handle bias edges gently to avoid stretching`,

  assemblyNotes: `Assembly notes (high-level):
- Build 8 identical points with consistent ring order
- Join points so ring seams align across the star
- Add background/setting pieces around the star

Pressing/accuracy:
- Press in a consistent plan so seams can nest
- Check alignment frequently as small errors compound
- Work flat and avoid stretching bias edges`,

  commonMistakes: `Common Lone Star mistakes to avoid:
- Treating it like a block-grid star (HST/square grid) — it is diamond-based
- Stretching bias edges (star ripples and won’t lie flat)
- Inconsistent seam allowance (rings won’t align across points)
- Low contrast between rings (sunburst effect disappears)
- Mixing ring order between points (breaks the concentric look)
- Skipping stabilization (starch/handling) when working with bias cuts`
};
