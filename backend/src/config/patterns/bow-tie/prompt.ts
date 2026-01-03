import { PatternPrompt } from '../../../types/PatternPrompt';

export const BOW_TIE_PROMPT: PatternPrompt = {
  patternName: 'Bow Tie',
  recommendedFabricCount: 3,

  characteristics: `A traditional Bow Tie quilt unit (often shown as a 2×2 unit):
- Built on a 2×2 four-patch base (four equal squares)
- Two squares are the Bow/Tie fabric and are placed on one diagonal
- The other two squares are Background and are placed on the opposite diagonal
- Small corner patches ("knot" triangles) are placed on the inner-facing corners of the Background squares
- The bow illusion comes from repetition across the quilt; there is no center square or decorative overlay`,

  fabricRoleGuidance: `Fabric usage (based on uploaded fabric images):

ALWAYS:
- COLOR1 (Background): the two Background squares in the 2×2 unit

WITH 2 FABRICS (2 images uploaded):
- COLOR2 (Bow/Tie): the two Bow/Tie squares AND the knot corner patches (triangles)

WITH 3 FABRICS (3 images uploaded) — alternating bow + swapped knot:
- Even-parity blocks (row+col even):
  - COLOR2 (Bow/Tie squares)
  - COLOR3 (Knot corner patches)
- Odd-parity blocks (row+col odd):
  - COLOR3 (Bow/Tie squares)
  - COLOR2 (Knot corner patches)
This keeps the knot contrasting the bow on every block.

WITH 4–8 FABRICS (4 to 8 images uploaded):
- COLOR1 (Background) remains fixed
- Bow/Tie and Knot colors rotate through the remaining fabrics for a scrappy, varied look`,

  assemblyNotes: `2×2 unit layout:
- Place the two Bow/Tie squares on one diagonal of the 2×2 unit
- Place the two Background squares on the opposite diagonal
- Add knot corner patches to the inner-facing corners of the Background squares (the corners that point toward the center of the 2×2 unit)
- When tiling across the quilt, alternate orientation/rotation as needed so the bow ties read cleanly across repeats`,

  cuttingInstructions: `Typical cutting approach (example sizes depend on desired finished block size):
- Cut 2 background squares and 2 bow/tie squares (same size) per 2×2 unit
- Cut 1 small square for corner patches (knot), then split to yield two corner triangles/patches
- Attach the corner patches to the two background squares at the inner-facing corners (stitch-and-flip is common), then assemble the 2×2 unit`,

  commonMistakes: `- Treating the pattern like it needs a center square (it does not).
- Placing corner patches on the wrong corners of the background squares (they must face inward).
- Using low contrast between background and bow/tie fabrics, making the bow illusion hard to see.
- Not alternating orientation when tiling, which can reduce the clarity of the repeating bow-tie effect.`
};
