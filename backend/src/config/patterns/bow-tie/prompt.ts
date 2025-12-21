import { PatternPrompt } from '../types';

export const BOW_TIE_PROMPT: PatternPrompt = {
  patternName: 'Bow Tie',
  recommendedFabricCount: 2,
  
  characteristics: `A Bow Tie block creates the illusion of a knotted bow tie:
- A 2x2 four-patch base structure
- Two squares on diagonally opposite corners form the "tie" (top-left and bottom-right)
- Two squares on the other diagonal form the background (top-right and bottom-left)
- A center square overlays the middle intersection as the "knot"
- Simple construction with strong graphic impact`,

  fabricRoleGuidance: `For Bow Tie specifically:
- COLOR1 (PRIMARY): The two diagonal "tie" squares - the dominant visual element
- COLOR2 (BACKGROUND): The two opposite diagonal squares - frames the tie shape
- COLOR3 (ACCENT): The center "knot" square - use high contrast to make it pop`,

  cuttingInstructions: `Bow Tie cutting specifics:
- Cut two large squares for the tie (COLOR1)
- Cut two large squares for the background (COLOR2)
- Cut one smaller center square for the knot (COLOR3)
- The knot is approximately 30% the width of the full block`,

  assemblyNotes: `Assembly tips for Bow Tie:
- Arrange as a four-patch with tie squares on opposite diagonal corners
- Background squares fill the remaining diagonal
- Center the knot square over the middle intersection
- Press seams toward darker fabrics`,

  commonMistakes: `Avoid these Bow Tie mistakes:
- Placing tie squares adjacent instead of diagonally opposite
- Using triangles instead of full squares (creates gaps)
- Misaligning the center knot
- Using low contrast between knot and tie fabrics`
};