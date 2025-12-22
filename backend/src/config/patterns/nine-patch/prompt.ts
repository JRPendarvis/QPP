import { PatternPrompt } from '../types';

export const NINE_PATCH_PROMPT: PatternPrompt = {
  patternName: 'Nine Patch',
  recommendedFabricCount:2,
  
  characteristics: `Nine Patch is a fundamental 3x3 grid pattern:
- Nine equal squares arranged in a 3x3 grid
- Classic version alternates two colors in checkerboard style (corners+center vs edges)
- With more fabrics, colors distribute across corners, edges, and center
- Foundation block for many complex patterns (Double Nine Patch, Irish Chain, etc.)
- Simple construction with high design flexibility
- Creates strong secondary patterns when blocks are tiled`,

  fabricRoleGuidance: `For Nine Patch specifically:
- 2 colors: COLOR1 on corners+center (5 squares), COLOR2 on edges (4 squares)
- 3 colors: COLOR1 corners, COLOR2 edges, COLOR3 center
- 4 colors: Diagonal corner pairs, edges, center each distinct
- 5-6 colors: Each corner unique, edges and center distributed
- 7-8 colors: Corners and edges each unique, center as accent
- Contrast between positions creates different visual effects`,

  cuttingInstructions: `Nine Patch cutting specifics:
- Cut nine equal squares
- All squares are 1/3 of the finished block width (plus seam allowances)
- Strip piecing is efficient: sew strips, crosscut into rows, join rows
- For 2-color version: cut one strip set (A-B-A) and one (B-A-B)`,

  assemblyNotes: `Assembly tips for Nine Patch:
- Arrange squares in desired color placement before sewing
- Sew into three rows of three
- Press seams in alternating directions row by row
- Join rows with nested seams for crisp intersections
- Square up block after assembly`,

  commonMistakes: `Avoid these Nine Patch mistakes:
- Inconsistent square sizes (grid won't align)
- Not planning color placement (random doesn't always look good)
- Pressing all seams the same direction (seams won't nest)
- Misaligned seam intersections (the hallmark of a sloppy nine patch)`
};