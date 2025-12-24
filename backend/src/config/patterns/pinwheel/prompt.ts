import { PatternPrompt } from '../types';

export const PINWHEEL_PROMPT: PatternPrompt = {
  patternName: 'Pinwheel',
  recommendedFabricCount: 2,
  
  characteristics: `Pinwheel is a dynamic spinning block made from half-square triangles:
- 2x2 grid of half-square triangles (HSTs)
- Each HST is divided by a single diagonal
- HSTs are oriented so one color forms "blades" spinning around the center
- Creates a windmill or fan effect
- NOT the same as Hourglass (which divides by both diagonals)
- When tiled, pinwheels can spin in same or alternating directions
- Simple construction with high visual impact`,

  fabricRoleGuidance: `Pinwheel fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): Blade triangles — the spinning element
- COLOR2 (BACKGROUND): Background triangles — frames the spin

WITH 3 FABRICS:
- COLOR1 (PRIMARY): One diagonal pair of blades
- COLOR2 (SECONDARY): Other diagonal pair of blades
- COLOR3 (BACKGROUND): All background triangles

WITH 4 FABRICS:
- COLOR1 (PRIMARY): One diagonal pair of blades
- COLOR2 (SECONDARY): Other diagonal pair of blades
- COLOR3 (BACKGROUND): One diagonal pair of backgrounds
- COLOR4 (BACKGROUND): Other diagonal pair of backgrounds

WITH 5-8 FABRICS (scrappy):
- COLOR1 (BACKGROUND): Consistent background triangles across all blocks
- COLOR2-8 (PRIMARY options): Blade colors rotate across blocks for variety

High contrast between blades and background creates a strong spin effect. Consider which direction you want the pinwheel to spin when orienting HSTs.

Note: All blades must point the same rotational direction (all clockwise or all counter-clockwise) for the spin effect to work.`,

  cuttingInstructions: `Pinwheel cutting specifics:
- Made from four half-square triangles (HSTs)
- HST method: Cut squares 7/8" larger than finished size, cut diagonally
- Or use the two-at-a-time HST method for efficiency
- Need two HSTs with blade color on one side, two with blade color on the other
- All HSTs must be identical size for points to meet at center
- For scrappy pinwheels: cut blade triangles from multiple fabrics`,

  assemblyNotes: `Assembly tips for Pinwheel:
- Make four HSTs first
- Arrange so blade color forms spinning pattern (all pointing clockwise or counter-clockwise)
- Sew HSTs into two rows of two
- Press seams in opposite directions for nesting
- Join rows with center seams nesting
- Press final seam open to reduce bulk at center
- For scrappy layouts: keep background consistent, vary blade colors`,

  commonMistakes: `Avoid these Pinwheel mistakes:
- HST orientation wrong (blades won't spin — all must point same rotational direction)
- Confusing with Hourglass (pinwheel uses single-diagonal HSTs, not X-divided)
- Stretching bias edges (HSTs distort)
- Inconsistent HST sizes (center point won't meet)
- Pressing all seams same direction (won't nest, bulk at center)
- In scrappy versions: losing the consistent background (breaks the spin effect)`
};