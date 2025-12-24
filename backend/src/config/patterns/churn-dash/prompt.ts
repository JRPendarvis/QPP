import { PatternPrompt } from '../types';

export const CHURN_DASH_PROMPT: PatternPrompt = {
  patternName: 'Churn Dash',
  recommendedFabricCount: 3,
  
  characteristics: `A Churn Dash is a traditional nine-patch variation named for its resemblance to a butter churn dasher:
- Center square (1 fabric)
- Four rectangular "dashes" forming a plus/cross shape (1 fabric)
- Four corner half-square triangles (2 fabrics per corner, split diagonally)
- The accent color sits on ALL FOUR OUTER corners, creating a framing effect
- The background color fills ALL FOUR INNER triangles, connecting visually to the center
- NOT a simple nine-patch (corners are split diagonally, not solid squares)
- NOT alternating colors in corners — outer corners are consistent, inner corners are consistent`,

  fabricRoleGuidance: `Churn Dash fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1 (BACKGROUND): Center square AND inner corner triangles
- COLOR2 (PRIMARY): Dashes AND outer corner triangles

WITH 3 FABRICS (recommended):
- COLOR1 (BACKGROUND): Center square AND inner corner triangles — creates visual connection
- COLOR2 (PRIMARY): The four rectangular "dash" bars — the most prominent feature
- COLOR3 (ACCENT): Outer corner triangles only — frames the entire block

WITH 4+ FABRICS (scrappy look):
- COLOR1 (BACKGROUND): Consistent center and inner triangles across all blocks
- COLOR2-7 (PRIMARY options): Dash colors rotate across blocks for variety
- COLOR8 (ACCENT): Consistent outer corner triangles across all blocks

The scrappy approach keeps the background and frame consistent while varying the dash fabric block-to-block.`,

  cuttingInstructions: `Churn Dash cutting specifics:
- Cut squares for the center (BACKGROUND fabric)
- Cut rectangles for the four "dashes" (PRIMARY fabric)
- Cut squares then slice diagonally for the half-square triangles in corners
- Inner triangles: BACKGROUND fabric; Outer triangles: ACCENT fabric
- Traditional Churn Dash uses high contrast between the dashes and the background
- For scrappy quilts: cut dashes from multiple fabrics`,

  assemblyNotes: `Assembly tips for Churn Dash:
- Piece the half-square triangles first for the corners
- Arrange in a 3x3 grid: corner HSTs, side dashes, and center square
- Press seams toward the darker fabric
- Ensure all outer corner triangles are the same accent color
- Ensure all inner corner triangles match the center square
- For scrappy layouts: vary dash fabric per block while keeping background/accent consistent`,

  commonMistakes: `Avoid these Churn Dash mistakes:
- Using solid squares in corners instead of half-square triangles (makes it a nine-patch)
- Alternating corner triangle colors (outer corners should ALL be accent, inner corners should ALL match center)
- Not enough contrast between the dashes and background
- Placing accent triangles on inner corners instead of outer corners (inverts the framing effect)
- In scrappy quilts: accidentally varying the background instead of the dashes`
};