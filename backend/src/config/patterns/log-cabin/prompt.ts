import { PatternPrompt } from '../../../types/PatternPrompt';

export const LOG_CABIN_PROMPT: PatternPrompt = {
  patternName: 'Log Cabin',
  recommendedFabricCount: 5,
  
  characteristics: `Log Cabin is an iconic American pattern built from strips spiraling around a center:
- Center square (the "hearth") represents the fireplace in a cabin
- Strips ("logs") are added in rounds, spiraling outward from the center
- Traditional light/dark division: one diagonal half uses light fabrics, opposite half uses dark
- Light side: typically top and right strips
- Dark side: typically bottom and left strips
- The diagonal light/dark contrast creates dramatic secondary patterns when blocks are tiled
- When blocks are rotated during layout, classic settings emerge: Barn Raising, Straight Furrows, Courthouse Steps, Light and Dark
- Typically 3-4 rounds of strips around the center
- Block orientation is intentional - rotation is planned at layout stage, not random`,

  fabricRoleGuidance: `Log Cabin fabric assignments (supports 3-8 fabrics):

WITH 3 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): Center hearth - traditionally red or yellow
- PRIMARY (fabricColors[1]): All light-side strips (top, right)
- SECONDARY (fabricColors[2]): All dark-side strips (bottom, left)

Classic approach with maximum light/dark contrast and simple construction.

WITH 4-5 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Center hearth - consistent across all blocks
- PRIMARY (fabricColors[1]): Light strips, round 1
- SECONDARY (fabricColors[2]): Dark strips, round 1
- ACCENT (fabricColors[3]): Light strips, round 2
- CONTRAST (fabricColors[4]): Dark strips, round 2

Adds variety while maintaining the light/dark structure. Strips alternate fabrics 
by round for more visual interest.

WITH 6-8 FABRICS (maximum variety):
- BACKGROUND (fabricColors[0]): Center hearth
- PRIMARY (fabricColors[1]): Light strips, round 1
- SECONDARY (fabricColors[2]): Dark strips, round 1
- ACCENT (fabricColors[3]): Light strips, round 2
- CONTRAST (fabricColors[4]): Dark strips, round 2
- Light 3 (fabricColors[5]): Light strips, round 3
- Dark 3 (fabricColors[6]): Dark strips, round 3
- Light 4 (fabricColors[7]): Light strips, round 4

Maximum variety with different fabrics in each round while maintaining the 
essential light/dark contrast.

CRITICAL: Maintain strong VALUE contrast between light and dark fabrics. 
The diagonal light/dark split is essential to the Log Cabin effect. All light 
fabrics should be clearly lighter than all dark fabrics.

DESIGN TIP: Use a bright, warm color for the hearth (red or yellow) to represent 
the welcoming fire. Choose lights and darks that complement each other but maintain 
strong contrast.`,

  cuttingInstructions: `Log Cabin cutting specifics:

BACKGROUND fabric (fabricColors[0]):
- Cut 1 center square per block (the hearth)
- Typically 1.5" to 2.5" finished size

LIGHT fabrics (PRIMARY, ACCENT, fabricColors[5], [7]):
- Cut strips of consistent width (typically 1" to 1.5" finished)
- Strip lengths increase each round
- Can cut as you go or pre-cut to specific lengths

DARK fabrics (SECONDARY, CONTRAST, fabricColors[6]):
- Cut strips same width as light strips
- Same progressive lengths as light strips

CUTTING APPROACH:
1. **Cut-as-you-go**: Trim each strip to length after sewing (most flexible)
2. **Pre-cut to length**: Calculate lengths for each round (more efficient for multiple blocks)
3. **Strip sets**: Sew strips together, then crosscut (fastest for scrappy look)

Traditional strip widths: 1" to 1.5" finished (1.5" to 2" with seam allowance)
Typical rounds: 3-4 spirals around the center

STRIP SEQUENCE (for 4 rounds):
- Round 1: 2 light strips, 2 dark strips
- Round 2: 2 light strips, 2 dark strips
- Round 3: 2 light strips, 2 dark strips  
- Round 4: 2 light strips, 2 dark strips
Total: 8 light strips + 8 dark strips + 1 center = 17 pieces per block`,

  assemblyNotes: `Assembly tips for Log Cabin:

CONSTRUCTION SEQUENCE:
1. Start with center hearth square (BACKGROUND)
2. Add first strip (typically light on right side)
3. Press seam away from center
4. Add second strip (typically light on top)
5. Press seam away from center
6. Add third strip (typically dark on left side)
7. Press seam away from center
8. Add fourth strip (typically dark on bottom)
9. Press seam away from center
10. Repeat for additional rounds, spiraling outward

PRESSING RULES:
- Always press seams AWAY from the center (toward the newest strip)
- This creates a slight dome/rise in the finished block
- Consistent pressing makes blocks nest together when joining

EFFICIENCY TIPS:
- Chain piece multiple blocks simultaneously
- Work in assembly-line fashion (add same round to all blocks before moving to next round)
- Use a design wall to plan block rotation before assembly

LAYOUT PLANNING:
- Lay out all blocks BEFORE joining
- Rotate blocks to create desired secondary pattern:
  - **Barn Raising**: Concentric diamonds of light/dark
  - **Straight Furrows**: Diagonal lines across quilt
  - **Courthouse Steps**: Vertical/horizontal stripes
  - **Light and Dark**: High contrast checkerboard effect
- Pin a note to each block indicating rotation orientation

ACCURACY TIPS:
- Keep strip widths absolutely consistent
- Square up block after each round if needed
- All blocks must be same size for proper tiling`,

  commonMistakes: `Avoid these Log Cabin mistakes:
- Mixing up light/dark sides (breaks the diagonal effect when blocks are tiled)
- Using lights and darks without sufficient value contrast (pattern disappears)
- Inconsistent strip widths (blocks become lopsided and won't join properly)
- Not pressing seams consistently away from center (blocks won't lie flat)
- Pressing seams toward center (creates bulk at the hearth)
- Forgetting to plan block rotation (secondary pattern is chaotic instead of intentional)
- Using center hearth color too similar to surrounding strips (hearth disappears)
- In multi-fabric versions: placing a dark fabric on light side or vice versa (confuses the light/dark division)
- Not squaring up blocks before joining (accumulated errors cause waves in quilt)
- Random block orientation (misses opportunity for classic Log Cabin settings)`
};