import { PatternPrompt } from '../../../types/PatternPrompt';

export const BOW_TIE_PROMPT: PatternPrompt = {
  patternName: 'Bow Tie',
  recommendedFabricCount: 2,

  characteristics: `A traditional Bow Tie quilt block:
- Built on a 2×2 four-patch base
- Two diagonally opposite squares are the Tie fabric
- The other two squares are Background
- Small triangles placed at the inner corners of the Background squares create the bow illusion
- No center square or decorative overlay is used`,

  fabricRoleGuidance: `Fabric usage:

WITH 2 FABRICS:
- COLOR1 (Background): background squares
- COLOR2 (Tie): tie squares AND inner-corner triangles

WITH 3 FABRICS:
- COLOR1 (Background): background squares
- COLOR2 (Tie): tie squares
- COLOR3 (Accent): inner-corner triangles`,

  assemblyNotes: `Arrange tie squares diagonally (top-left & bottom-right).
Place background squares on the opposite diagonal.
Add small triangles at the center-facing corners of the background squares.
Alternate block rotation when tiling for a proper quilt effect.`,

  cuttingInstructions: `Cut equal-sized squares for both the tie and background fabrics.
For the inner-corner triangles, cut small squares from the accent or tie fabric, then cut them in half diagonally to form triangles.`,

  commonMistakes: `- Misplacing the tie and background squares, which disrupts the bow illusion.
- Incorrectly sizing or positioning the inner-corner triangles, causing the bow shape to look uneven.
- Not alternating block rotation when assembling the quilt, resulting in a less dynamic pattern.`
};
