import { PatternPrompt } from '../types';

export const NINE_PATCH_PROMPT: PatternPrompt = {
  patternName: 'Nine Patch',
  recommendedFabricCount: 2,
  
  characteristics: `Nine Patch is a fundamental 3x3 grid pattern:
- Nine equal squares arranged in a 3x3 grid
- Classic version alternates two colors in checkerboard style (corners+center vs edges)
- Foundation block for many complex patterns (Double Nine Patch, Irish Chain, etc.)
- Simple construction with high design flexibility
- Creates strong secondary patterns when blocks are tiled
- Perfect beginner pattern`,

  fabricRoleGuidance: `Nine Patch fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): Corners and center (5 squares) — dominant presence
- COLOR2 (BACKGROUND): Edges (4 squares) — frames the corners

WITH 3 FABRICS:
- COLOR1 (PRIMARY): Four corner squares
- COLOR2 (SECONDARY): Four edge squares
- COLOR3 (ACCENT): Center square — focal point

WITH 4 FABRICS:
- COLOR1 (PRIMARY): One diagonal pair of corners (top-left, bottom-right)
- COLOR2 (SECONDARY): Other diagonal pair of corners (top-right, bottom-left)
- COLOR3 (TERTIARY): Four edge squares
- COLOR4 (ACCENT): Center square

WITH 5-6 FABRICS:
- COLOR1-4 (PRIMARY): Each corner a unique fabric
- COLOR5 (SECONDARY): Four edge squares (consistent)
- COLOR6 (ACCENT): Center square

WITH 7-8 FABRICS (scrappy):
- COLOR1-4 (PRIMARY): Each corner a unique fabric
- COLOR5-8 (SECONDARY): Edge squares rotate through colors
- Remaining color: Center square as accent

Contrast between corner/center and edge positions creates the classic checkerboard effect. With more fabrics, variety increases while maintaining the 3x3 structure.`,

  cuttingInstructions: `Nine Patch cutting specifics:
- Cut nine equal squares
- All squares are 1/3 of the finished block width (plus seam allowances)
- Strip piecing is efficient: sew strips, crosscut into rows, join rows
- For 2-color version: cut one strip set (A-B-A) and one (B-A-B)
- For scrappy versions: cut squares from multiple fabrics`,

  assemblyNotes: `Assembly tips for Nine Patch:
- Arrange squares in desired color placement before sewing
- Sew into three rows of three
- Press seams in alternating directions row by row
- Join rows with nested seams for crisp intersections
- Square up block after assembly
- For scrappy layouts: plan color positions before cutting strips`,

  commonMistakes: `Avoid these Nine Patch mistakes:
- Inconsistent square sizes (grid won't align)
- Not planning color placement (random doesn't always look good)
- Pressing all seams the same direction (seams won't nest)
- Misaligned seam intersections (the hallmark of a sloppy nine patch)
- In scrappy versions: clustering similar colors in adjacent squares`
};