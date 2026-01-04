import { PatternPrompt } from '../../../types/PatternPrompt';

export const KALEIDOSCOPE_STAR_PROMPT: PatternPrompt = {
  patternName: 'Kaleidoscope Star',
  recommendedFabricCount: 4,

  characteristics: `Kaleidoscope Star is a classic 8-point star block. This QuiltPlannerPro version uses a 4×4 (16-patch) layout made from triangle units:
- 4 corner patches are solid corner squares
- 8 edge patches are split into triangles to form the star points
- The center is a 2×2 group of triangle units
- With 4 fabrics, the center accent forms a distinct focal area
- Intermediate skill level: triangle piecing requires accuracy and consistent pressing`,

  fabricRoleGuidance: `Kaleidoscope Star fabric assignments (QPP version supports 3–5 fabrics):

IMPORTANT: In this QPP layout, the CORNER fabric is its own role. The "background/setting" fabric used around the star is a different role.

WITH 3 FABRICS (minimum):
- CORNERS (fabricColors[0] / COLOR1): Only the 4 corner squares (cells 1, 4, 13, 16)
- STAR (fabricColors[1] / COLOR2): Star-point triangles on the edges + star presence in the center
- SETTING (fabricColors[2] / COLOR3): The non-star triangles on the edges (the fabric the star sits on)

In 3-fabric mode, the center accent uses the STAR fabric (COLOR2). The block still reads clearly.

WITH 4 FABRICS (recommended):
- CORNERS (fabricColors[0] / COLOR1): Only the 4 corner squares (cells 1, 4, 13, 16)
- STAR (fabricColors[1] / COLOR2): Star-point triangles on the edges + star presence in the center
- SETTING (fabricColors[2] / COLOR3): The non-star triangles on the edges (the fabric the star sits on)
- CENTER ACCENT (fabricColors[3] / COLOR4): Used ONLY in the center 2×2 (cells 6, 7, 10, 11) for a distinct focal

Design tips:
- Use strong contrast between SETTING (COLOR3) and STAR (COLOR2) so the star points pop.
- CORNERS (COLOR1) can match SETTING for a quieter look, or contrast for a framed look.
- CENTER ACCENT (COLOR4) is a great place for a "special" fabric because it only appears in the center.`,

  cuttingInstructions: `Kaleidoscope Star cutting specifics (QPP 4×4 / 16-patch layout):

This block is a 4×4 grid of equal patches (16 total). Each patch is either:
- a solid corner square, or
- a triangle-unit patch (built from triangles)

PATCH SIZE:
- Patch finished size = Finished block size ÷ 4
- Patch cut size = (Finished block size ÷ 4) + 0.5"

Example: For a 12" finished block:
- Patch finished = 12 ÷ 4 = 3"
- Patch cut size = 3.5"

CUTTING BY ROLE:
CORNERS (COLOR1):
- Cut 4 squares at patch cut size

STAR (COLOR2), SETTING (COLOR3), CENTER ACCENT (COLOR4):
- Cut squares sized appropriately for your preferred triangle construction method (HST/QST)
- Construct triangle-unit patches so every finished patch is identical size

Triangle construction approach:
- Use HST-style construction for edge patches (STAR + SETTING triangles).
- Use consistent triangle units in the center 2×2 so the accent reads cleanly.
Most important rule: square up your units so every patch finishes the same size.`,

  assemblyNotes: `Assembly notes for Kaleidoscope Star (QPP 16-patch):

1) Build the triangle-unit patches first:
   - Edge patches use STAR (COLOR2) + SETTING (COLOR3)
   - Center 2×2 uses STAR (COLOR2) + CENTER ACCENT (COLOR4) in the 4-fabric version

2) Arrange in a 4×4 layout:
   Row 1: Corner, Edge, Edge, Corner
   Row 2: Edge, Center, Center, Edge
   Row 3: Edge, Center, Center, Edge
   Row 4: Corner, Edge, Edge, Corner

3) Verify orientation before sewing:
   - Star-point triangles (COLOR2) should visually aim toward the center
   - The center accent (COLOR4) should appear only in the center area

4) Sew rows, then join rows:
   - Pin at intersections
   - Press consistently to reduce bulk near the center`,

  commonMistakes: `Avoid these Kaleidoscope Star mistakes (QPP version):
- Treating COLOR1 as the full background (in this layout COLOR1 is corners only)
- Triangle units rotated incorrectly (star points don't aim inward)
- Using low contrast between STAR (COLOR2) and SETTING (COLOR3) so the star disappears
- Inconsistent patch sizing (rows won't align)
- Stretching bias edges
- Center accent appearing outside the center 2×2 (COLOR4 should only be in cells 6,7,10,11)`
};
