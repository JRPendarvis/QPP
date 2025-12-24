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

  fabricRoleGuidance: `Ohio Star fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS (traditional):
- COLOR1 (PRIMARY): Star point triangles and center square
- COLOR2 (BACKGROUND): Corner squares and outer triangles in QST units

WITH 3 FABRICS:
- COLOR1 (PRIMARY): Star point triangles — the dominant visual element
- COLOR2 (BACKGROUND): Corner squares and outer triangles in QST units
- COLOR3 (ACCENT): Center square — focal point

WITH 4 FABRICS:
- COLOR1 (BACKGROUND): Corner squares and outer triangles in QST units
- COLOR2 (PRIMARY): One diagonal pair of star points
- COLOR3 (SECONDARY): Other diagonal pair of star points
- COLOR4 (ACCENT): Center square

WITH 5-6 FABRICS:
- COLOR1 (BACKGROUND): Corner squares and outer QST triangles
- COLOR2-5 (PRIMARY): Each star point a unique fabric
- COLOR6 (ACCENT): Center square

WITH 7-8 FABRICS (scrappy):
- COLOR1-4 (BACKGROUND options): Corner squares rotate through colors
- COLOR5-7 (PRIMARY): Star points rotate through colors
- COLOR8 (ACCENT): Center square — consistent focal point

High contrast between star points and background makes the star pop. The center square can match the star points or provide a third accent color.`,

  cuttingInstructions: `Ohio Star cutting specifics:
- Cut four corner squares (BACKGROUND fabric)
- Cut one center square (ACCENT fabric)
- Cut four QST units: each requires cutting a square into quarters diagonally
- QST method: Cut squares, mark both diagonals, sew 1/4" on each side, cut apart
- Alternative: Cut individual triangles using templates
- All squares/units are 1/3 of finished block size
- For scrappy versions: cut star point triangles from multiple fabrics`,

  assemblyNotes: `Assembly tips for Ohio Star:
- Build QST units first (4 triangles each, 2 star color, 2 background)
- Arrange in 3x3 grid: corners, QSTs, center
- Ensure star point triangles aim toward center in all QSTs
- Sew into three rows, then join rows
- Press seams away from QST units for less bulk
- Nest seams when joining rows
- For scrappy layouts: plan which star point fabrics go where before assembling`,

  commonMistakes: `Avoid these Ohio Star mistakes:
- QST orientation wrong (star points must aim toward center)
- Stretching bias edges on triangles
- Inconsistent QST sizes (star points won't meet center cleanly)
- Not enough contrast between star and background
- Pressing toward QST units (creates bulk at intersections)
- In scrappy versions: placing similar-colored star points adjacent to each other`
};