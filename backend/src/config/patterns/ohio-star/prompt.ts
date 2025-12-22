import { PatternPrompt } from '../types';

export const OHIO_STAR_PROMPT: PatternPrompt = {
  patternName: 'Ohio Star',
  recommendedFabricCount: 2,
  
  characteristics: `Ohio Star is a classic 3x3 grid star pattern using quarter-square triangles:
- Four corner squares (background)
- One center square (focal point)
- Four quarter-square triangle (QST) units forming diamond-shaped star points
- Each QST has two triangles pointing toward center (star) and two pointing outward (background)
- Star points create a pinwheel effect around the center
- Also known as: Variable Star, Tippecanoe, Shoofly variation
- Foundation for many complex star patterns`,

  fabricRoleGuidance: `For Ohio Star specifically:
- 2 colors: COLOR1 star points+center, COLOR2 background
- 3 colors: COLOR1 star points, COLOR2 background, COLOR3 center
- 4 colors: Opposite star points paired, plus background and center
- 5-6 colors: Each star point unique, shared background, distinct center
- 7-8 colors: Star points and corners each unique, center as accent
- High contrast between star points and background makes the star pop`,

  cuttingInstructions: `Ohio Star cutting specifics:
- Cut four corner squares (background)
- Cut one center square
- Cut four QST units: each requires cutting a square into quarters diagonally
- QST method: Cut squares, mark both diagonals, sew 1/4" on each side, cut apart
- Alternative: Cut individual triangles using templates
- All squares/units are 1/3 of finished block size`,

  assemblyNotes: `Assembly tips for Ohio Star:
- Build QST units first (4 triangles each, 2 star color, 2 background)
- Arrange in 3x3 grid: corners, QSTs, center
- Ensure star point triangles aim toward center in all QSTs
- Sew into three rows, then join rows
- Press seams away from QST units for less bulk
- Nest seams when joining rows`,

  commonMistakes: `Avoid these Ohio Star mistakes:
- QST orientation wrong (star points must aim toward center)
- Stretching bias edges on triangles
- Inconsistent QST sizes (star points won't meet center cleanly)
- Not enough contrast between star and background
- Pressing toward QST units (creates bulk at intersections)`
};