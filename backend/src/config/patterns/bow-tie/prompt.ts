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

  fabricRoleGuidance: `Bow Tie fabric assignments (supports 2-3 fabrics):

WITH 2 FABRICS:
- BACKGROUND (fabricColors[0]): Corner squares - frames the bow tie shape
- PRIMARY (fabricColors[1]): Tie squares AND center knot - creates the bow tie

WITH 3 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Corner squares - provides negative space
- PRIMARY (fabricColors[1]): Tie squares - the dominant visual element of the bow
- SECONDARY (fabricColors[2]): Center knot - use high contrast to make it pop

The background fabric should be a neutral or low-volume print that allows the bow tie to stand out. 
The primary tie fabric is the star of the show. If using 3 fabrics, choose a contrasting secondary 
for the knot to create visual interest at the center.`,

  cuttingInstructions: `Bow Tie cutting specifics:

FOR 2 FABRICS:
- Cut two squares for the tie from PRIMARY fabric
- Cut two squares for the background from BACKGROUND fabric
- Cut one smaller center square for the knot from PRIMARY fabric

FOR 3 FABRICS:
- Cut two squares for the tie from PRIMARY fabric
- Cut two squares for the background from BACKGROUND fabric
- Cut one smaller center square for the knot from SECONDARY fabric

The knot square is approximately 30% the width of the full block.
All tie and background squares are equal size (typically 1/2 the block width).`,

  assemblyNotes: `Assembly tips for Bow Tie:
- Arrange as a four-patch with PRIMARY tie squares on opposite diagonal corners (top-left and bottom-right)
- Place BACKGROUND squares on the other diagonal (top-right and bottom-left)
- Center the knot square over the middle intersection where all four patches meet
- Press seams toward darker fabrics to reduce bulk
- Ensure the knot is appliquéd or pieced precisely at the center for a clean look
- The diagonal placement of matching tie squares creates the characteristic "bow" shape`,

  commonMistakes: `Avoid these Bow Tie mistakes:
- Placing tie squares adjacent instead of diagonally opposite (breaks the bow illusion)
- Using triangles instead of full squares (creates gaps and loses the bow shape)
- Misaligning the center knot off the intersection point
- Making the knot too large (should be subtle, about 30% of block width)
- Using low contrast between knot and tie fabrics (knot disappears)
- Choosing a busy background that competes with the bow tie design`
};