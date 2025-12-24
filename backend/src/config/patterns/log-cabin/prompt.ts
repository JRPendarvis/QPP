import { PatternPrompt } from '../types';

export const LOG_CABIN_PROMPT: PatternPrompt = {
  patternName: 'Log Cabin',
  recommendedFabricCount: 5,
  
  characteristics: `Log Cabin is an iconic American pattern built from strips spiraling around a center:
- Center square (the "hearth") represents the fireplace in a cabin
- Strips ("logs") are added in rounds, spiraling outward
- Traditional light/dark division: two adjacent sides use light fabrics, two use dark fabrics
- Light side: top and right strips
- Dark side: bottom and left strips
- When blocks are tiled with intentional rotation, secondary patterns emerge (Barn Raising, Straight Furrows, Courthouse Steps, etc.)
- Four rounds of strips create the classic proportions
- Block orientation is fixed — rotation is planned at layout, not randomized`,

  fabricRoleGuidance: `Log Cabin fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1 (PRIMARY): Center hearth AND all dark-side strips (bottom, left)
- COLOR2 (BACKGROUND): All light-side strips (top, right)

WITH 3 FABRICS:
- COLOR1 (ACCENT): Center hearth — traditionally red or yellow
- COLOR2 (PRIMARY/DARK): All dark-side strips (bottom, left)
- COLOR3 (BACKGROUND/LIGHT): All light-side strips (top, right)

WITH 4-5 FABRICS (recommended):
- COLOR1 (ACCENT): Center hearth
- COLOR2-3 (LIGHT): Light-side strips, alternating by round
- COLOR4-5 (DARK): Dark-side strips, alternating by round

WITH 6-8 FABRICS (scrappy):
- COLOR1 (ACCENT): Center hearth — consistent across all blocks
- COLOR2-4 (LIGHT): Light-side strips, cycling through rounds
- COLOR5-8 (DARK): Dark-side strips, cycling through rounds

Strong light/dark contrast creates the diagonal effect when blocks are tiled. More fabrics = more variety within each side, with colors alternating by round.

Note: Block orientation is intentional — layout rotation (not random rotation) creates Barn Raising, Straight Furrows, and other classic settings.`,

  cuttingInstructions: `Log Cabin cutting specifics:
- Cut one center square (ACCENT fabric)
- Cut strips of consistent width (traditionally 1" to 1.5" finished)
- Strip lengths increase each round — can cut as you go or pre-cut
- Strip piecing from a strip set speeds up cutting
- Each round adds four strips (two light, two dark)
- For scrappy logs: cut strips from multiple fabrics within light/dark groups`,

  assemblyNotes: `Assembly tips for Log Cabin:
- Start with center square
- Add strips clockwise (or counter-clockwise) in sequence: right, top, left, bottom
- Press seams away from center (toward the newest strip)
- Chain piece multiple blocks at once for efficiency
- Plan block rotation before assembling the quilt top to create desired secondary pattern
- For scrappy layouts: keep light fabrics on light side, dark on dark side`,

  commonMistakes: `Avoid these Log Cabin mistakes:
- Mixing up light/dark sides (breaks the diagonal effect when tiled)
- Inconsistent strip widths (block becomes lopsided)
- Not pressing consistently (strips don't lie flat)
- Forgetting to plan block rotation (secondary pattern is random instead of intentional)
- Using center color that's too similar to surrounding strips (hearth disappears)
- In scrappy versions: putting a dark fabric on the light side (or vice versa)`
};