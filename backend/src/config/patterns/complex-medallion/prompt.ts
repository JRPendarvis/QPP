import { PatternPrompt } from '../../../types/PatternPrompt';

export const COMPLEX_MEDALLION_PROMPT: PatternPrompt = {
  patternName: 'Complex Medallion',
  recommendedFabricCount: 5,
  
  characteristics: `A Complex Medallion is a decorative center-focused design with layered radiating borders:
- Central focal medallion or star motif
- Multiple nested rectangular borders radiating outward from the center
- Layered frames create depth and visual interest
- Often features decorative corner elements and accent details
- Designed as a statement piece or quilt center focal point
- NOT a repeating block pattern - used as a single large centerpiece
- Requires 4-8 fabrics to achieve the full radiating effect
- Colors remain consistent throughout to maintain the medallion's radiating symmetry`,

  fabricRoleGuidance: `Complex Medallion fabric assignments (supports 4-8 fabrics):

WITH 4 FABRICS (minimum):
- BACKGROUND (fabricColors[0]): Outermost border/frame
- PRIMARY (fabricColors[1]): Center medallion/focal star
- SECONDARY (fabricColors[2]): First inner border surrounding center
- ACCENT (fabricColors[3]): Second inner border

WITH 5 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Outermost border/frame
- PRIMARY (fabricColors[1]): Center medallion/focal star
- SECONDARY (fabricColors[2]): First inner border
- ACCENT (fabricColors[3]): Second inner border
- CONTRAST (fabricColors[4]): Third inner border

WITH 6-8 FABRICS (maximum complexity):
- BACKGROUND (fabricColors[0]): Outermost frame
- PRIMARY (fabricColors[1]): Center medallion
- SECONDARY through CONTRAST (fabricColors[2-7]): Additional radiating borders

Color flows from center outward: Primary (center) → Secondary → Accent → Contrast → Additional → Background (outer).
Use gradual value changes or complementary colors for the most striking radiating effect.

IMPORTANT: All blocks in a Complex Medallion quilt use the SAME fabric assignments - no rotation or variation.`,

  cuttingInstructions: `Complex Medallion cutting specifics:

BACKGROUND fabric (fabricColors[0]):
- Cut strips for the outermost border
- Width depends on desired finished border size

PRIMARY fabric (fabricColors[1]):
- Cut pieces for center medallion/star motif
- May include kite shapes, diamonds, or geometric center pieces

SECONDARY, ACCENT, CONTRAST fabrics (fabricColors[2-7]):
- Cut border strips for each successive frame
- Each border typically 1-3" finished width
- Inner borders are usually narrower, outer borders wider

Cut all border strips on the straight grain for stability.
Add corner squares or triangles if using mitered corners.
Consider using a design template for complex center medallion shapes.`,

  assemblyNotes: `Assembly tips for Complex Medallion:
- Always build from the CENTER OUTWARD
- Piece the center medallion motif first (PRIMARY fabric)
- Add borders one at a time in sequence: SECONDARY → ACCENT → CONTRAST → BACKGROUND
- Press seams toward each newly added border
- Measure through the center to determine border lengths (prevents rippling)
- For mitered corners: add 2x border width to each strip length
- Pin border midpoints to block midpoints before sewing
- Use a walking foot to prevent stretching
- If adding appliqué details (circles, decorative elements), add them after borders are complete
- Maintain consistent seam allowances throughout for proper radiating symmetry`,

  commonMistakes: `Avoid these Complex Medallion mistakes:
- Starting with borders instead of building from center outward
- Not measuring through the center for border lengths (causes wavy borders)
- Inconsistent seam allowances (throws off the symmetry)
- Forgetting to press after each border addition (creates bulk)
- Using too many busy prints (medallions work best with mix of solids and subtle prints)
- Not planning the color flow from center to outer edge (creates visual confusion)
- Cutting borders too short (always cut long and trim to fit)
- Stretching bias edges when adding borders (use walking foot)
- Misaligned the center medallion (should be perfectly centered)
- Using the same border width for all frames (vary widths for visual interest)`
};