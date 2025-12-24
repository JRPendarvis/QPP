import { PatternPrompt } from '../types';

export const BOW_TIE_PROMPT: PatternPrompt = {
  patternName: 'Bow Tie',
  recommendedFabricCount: 3,
  
  characteristics: `A Bow Tie block creates the illusion of a knotted bow tie:
- A 2x2 four-patch base structure
- Two squares on diagonally opposite corners form the "tie" (top-left and bottom-right)
- Two squares on the other diagonal form the background (top-right and bottom-left)
- A center square overlays the middle intersection as the "knot"
- Simple construction with strong graphic impact`,

  fabricRoleGuidance: `Bow Tie fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1 (PRIMARY): Tie squares on diagonal corners
- COLOR2 (BACKGROUND): Background squares AND center knot

WITH 3 FABRICS (recommended):
- COLOR1 (PRIMARY): Tie squares - the dominant visual element
- COLOR2 (BACKGROUND): Background squares - frames the tie shape
- COLOR3 (ACCENT): Center knot - use high contrast to make it pop

WITH 4+ FABRICS (scrappy look):
- COLOR1 (BACKGROUND): Consistent background across all blocks
- COLOR2-7 (PRIMARY options): Tie colors rotate across blocks for variety
- COLOR8 (ACCENT): Consistent knot color across all blocks

The scrappy approach keeps background and knot consistent while varying the tie fabric block-to-block.`,

  cuttingInstructions: `Bow Tie cutting specifics:
- Cut two large squares for the tie (PRIMARY fabric)
- Cut two large squares for the background (BACKGROUND fabric)
- Cut one smaller center square for the knot (ACCENT fabric)
- The knot is approximately 30% the width of the full block
- For scrappy quilts: cut tie squares from multiple fabrics`,

  assemblyNotes: `Assembly tips for Bow Tie:
- Arrange as a four-patch with tie squares on opposite diagonal corners
- Background squares fill the remaining diagonal
- Center the knot square over the middle intersection
- Press seams toward darker fabrics
- For scrappy layouts: vary tie fabric per block while keeping background/knot consistent`,

  commonMistakes: `Avoid these Bow Tie mistakes:
- Placing tie squares adjacent instead of diagonally opposite
- Using triangles instead of full squares (creates gaps)
- Misaligning the center knot
- Using low contrast between knot and tie fabrics
- In scrappy quilts: accidentally varying the background instead of the tie`
};