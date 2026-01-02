import { PatternPrompt } from '../../../types/PatternPrompt';

export const CHURN_DASH_PROMPT: PatternPrompt = {
  patternName: 'Churn Dash',
  recommendedFabricCount: 3,
  
  characteristics: `A Churn Dash is a traditional nine-patch variation named for its resemblance to a butter churn dasher:
- Nine-patch grid structure (3x3)
- Four corner squares, each split diagonally into half-square triangles
- Four rectangular "rails" or "dashes" forming a cross/plus shape
- One center square
- The half-square triangles create a dynamic pinwheel effect at the corners
- Traditional construction uses two contrasting fabrics plus background
- Creates visual movement through the diagonal divisions`,

  fabricRoleGuidance: `Churn Dash fabric assignments (supports 2-3 fabrics):

WITH 2 FABRICS:
- BACKGROUND (fabricColors[0]): Corner squares (4), center square (1)
- PRIMARY (fabricColors[1]): All four rails AND all HST triangles in corners

With just 2 fabrics, PRIMARY creates both the cross shape and the corner movement.

WITH 3 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): The four corner squares' background triangles (inner) + center square
- PRIMARY (fabricColors[1]): Two opposite rails (top and bottom) + their corresponding HST triangles
- SECONDARY (fabricColors[2]): Two opposite rails (left and right) + their corresponding HST triangles

With 3 fabrics, PRIMARY and SECONDARY create contrasting "blades" that rotate around the center, 
enhancing the churn dasher illusion. Use high contrast between all three fabrics for maximum impact.

DESIGN TIP: The 3-fabric version creates the most traditional Churn Dash look, with two distinct 
"blade sets" churning in opposite directions.`,

  cuttingInstructions: `Churn Dash cutting specifics:

FOR 2 FABRICS:
- BACKGROUND: Cut 1 center square + 4 squares (for HSTs)
- PRIMARY: Cut 4 rectangles (rails) + 4 squares (for HSTs)
- Pair BACKGROUND and PRIMARY squares, then cut diagonally for HSTs

FOR 3 FABRICS (recommended):
- BACKGROUND: Cut 1 center square + 4 squares (for HSTs)
- PRIMARY: Cut 2 rectangles (opposite rails) + 2 squares (for HSTs)
- SECONDARY: Cut 2 rectangles (opposite rails) + 2 squares (for HSTs)
- Make HSTs by pairing BACKGROUND with PRIMARY (2 HSTs) and BACKGROUND with SECONDARY (2 HSTs)

Rails are typically twice as long as they are wide. For example, if your finished block is 12", 
each section of the grid is 4", so rails would be 4" x 2" finished (add seam allowance).`,

  assemblyNotes: `Assembly tips for Churn Dash:
- Construct the four corner HST units first
- Arrange in a 3x3 grid:
  - Top row: HST, rail, HST
  - Middle row: rail, center square, rail
  - Bottom row: HST, rail, HST
- For 3-fabric version: PRIMARY rails go top/bottom, SECONDARY rails go left/right (or vice versa)
- Orient HSTs so the background triangles point toward the center
- Press seams toward rails to reduce bulk
- Match all seam intersections carefully for crisp corners
- The diagonal divisions in corners should create a subtle pinwheel effect`,

  commonMistakes: `Avoid these Churn Dash mistakes:
- Using solid squares in corners instead of HSTs (makes it a simple nine-patch, not Churn Dash)
- Not enough contrast between fabrics (pattern disappears)
- Misorienting the HST triangles (breaks the visual flow)
- Cutting rails the wrong proportion (should be 2:1 length to width)
- Inconsistent seam allowances (throws off the alignment of the 3x3 grid)
- Pressing seams toward HSTs instead of rails (creates bulk at intersections)`
};