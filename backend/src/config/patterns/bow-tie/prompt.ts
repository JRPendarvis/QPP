import { PatternPrompt } from '../../../types/PatternPrompt';

export const BOW_TIE_PROMPT: PatternPrompt = {
  patternName: 'Bow Tie',
  recommendedFabricCount: 3,

  characteristics: `A traditional Bow Tie block (single block) is built from a 2×2 four-patch (four equal squares) plus two small corner patches:
- The 2×2 base contains:
  - 2 Bow/Tie squares placed on one diagonal
  - 2 Background squares placed on the opposite diagonal
- Each of the two Background squares receives ONE small corner patch ("knot" patch) at the corner that meets at the center of the 2×2 block
- Those two knot patches create the “knot” at the center intersection when the 2×2 block is assembled
- The bow illusion comes from repeating these blocks; there is no center overlay or extra center square`,

  fabricRoleGuidance: `Fabric usage (based on uploaded fabric images):

ALWAYS:
- COLOR1 (Background): the two Background squares in each 2×2 block

WITH 2 FABRICS (2 images uploaded):
- COLOR2 (Bow/Tie): the two Bow/Tie squares AND the two knot corner patches

WITH 3 FABRICS (3 images uploaded) — alternating bow + swapped knot:
- Even-parity blocks (row+col even):
  - COLOR2 (Bow/Tie squares)
  - COLOR3 (Knot corner patches)
- Odd-parity blocks (row+col odd):
  - COLOR3 (Bow/Tie squares)
  - COLOR2 (Knot corner patches)
This keeps the knot contrasting the bow in every block.

WITH 4–8 FABRICS (4 to 8 images uploaded):
- COLOR1 (Background) remains fixed
- Bow/Tie and Knot colors rotate through remaining fabrics for a scrappy, varied look`,

  assemblyNotes: `Block layout rules (MUST be followed exactly):
1) Form a 2×2 grid of four equal squares.
2) Place the two Bow/Tie squares on one diagonal (either TL+BR or TR+BL).
3) Place the two Background squares on the other diagonal.
4) Add ONE knot corner patch to EACH Background square:
   - The knot patch goes on the corner of the Background square that points toward the CENTER of the 2×2 block.
   - That means the two knot patches are on the two Background corners that meet at the center intersection.
5) When tiling blocks across the quilt, alternate block rotation (typically 90°) so the bow-tie shapes remain clearly readable as repeating “bows” across the quilt.`,

cuttingInstructions: `Knot patch construction (MUST choose ONE method and use it consistently throughout the instructions):

METHOD A — Stitch-and-flip (preferred for MVP clarity):
- Per Bow Tie block:
  - Cut 2 Background squares (same size)
  - Cut 2 Bow/Tie squares (same size)
  - Cut 2 Knot squares (small squares used for stitch-and-flip)
- Construction:
  - Place one Knot square on the INNER corner of each Background square (the corner that meets at the center of the 2×2 block)
  - Stitch diagonally across the Knot square, trim to ¼ inch seam allowance, press
  - Assemble the four squares into the 2×2 block with Bow/Tie squares on one diagonal and Background squares on the opposite diagonal

METHOD B — Triangle sew-on (allowed, but do not mix with stitch-and-flip):
- Per Bow Tie block:
  - Cut 2 Background squares (same size)
  - Cut 2 Bow/Tie squares (same size)
  - Cut 2 Knot triangles (created by cutting 1 small square diagonally to yield 2 triangles)
- Construction:
  - Sew one Knot triangle onto the INNER corner of each Background square
  - Trim/square up if needed, then assemble into the 2×2 block

IMPORTANT:
- Do NOT describe both methods in the same set of instructions.
- If a method uses Knot squares, do NOT mention cutting Knot triangles.
- If a method uses Knot triangles, do NOT mention stitch-and-flip.`,

  sizingContract: `
- Finished sub-square size = Cut size minus ½ inch seam allowance
- Bow Tie block is a 2×2 grid of sub-squares
- Finished block size MUST equal:
  FinishedBlockSize = 2 × FinishedSubSquareSize
- Final quilt dimensions MUST equal:
  QuiltWidth  = BlocksAcross × FinishedBlockSize (+ borders if present)
  QuiltHeight = BlocksDown  × FinishedBlockSize (+ borders if present)
- If borders are added, their widths MUST be included in the final quilt size
- Instructions are INVALID if stated finished size does not mathematically match the block layout and cuts
`,

previewContract: `
- The on-screen quilt grid (3×4) is a PREVIEW ONLY.
- The preview grid is NOT the full quilt and MUST NOT be used for:
  - Cutting calculations
  - Block counts
  - Finished quilt size
  - Instructions MUST be generated ONLY from Production Quilt parameters.
`,

productionQuiltSpec: `
- Finished quilt size (width × height)
- Finished block size
- Blocks across (integer)
- Blocks down (integer)
- Border widths (if any)
`,

instructionConsistencyRules: `
- The instructions MUST be internally consistent and deterministic.
- Select exactly ONE knot patch method (stitch-and-flip OR triangle sew-on) and never mix terminology or steps.
- All stated quilt dimensions MUST satisfy sizingContract math.`,

  commonMistakes: `- Treating the pattern like it needs a center square or overlay (it does not).
- Putting knot patches on the OUTER corners of background squares instead of the INNER corners that meet at the center.
- Placing Bow/Tie squares on the same row or column (they must be diagonal).
- Not alternating block rotation when tiling, reducing the clarity of the repeating bow-tie effect.`
};
