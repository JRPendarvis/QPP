import { PatternPrompt } from '../../../types/PatternPrompt';

export const OHIO_STAR_PROMPT: PatternPrompt = {
  patternName: 'Ohio Star',
  recommendedFabricCount: 2,
  
  characteristics: `Ohio Star is a classic 3x3 grid star pattern using quarter-square triangles:
- Four corner squares (background)
- One center square (focal point)
- Four quarter-square triangle (QST) units forming the 8-pointed star
- Each QST has two triangles pointing inward (star) and two pointing outward (background)
- Star points create a dynamic pinwheel effect around the center
- Also known as: Variable Star, Eastern Star
- Intermediate skill level - requires accurate QST construction
- Foundation for many complex star patterns`,

  fabricRoleGuidance: `Ohio Star fabric assignments (supports 2-3 fabrics):

WITH 2 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): 4 corner squares + outer triangles in QST units
- PRIMARY (fabricColors[1]): 8 star point triangles (in QSTs) + center square

Classic two-fabric approach creates clear star with strong visual impact.

Layout (3x3 grid):
[BG] [QST] [BG]
[QST] [PR] [QST]
[BG] [QST] [BG]

Each QST unit contains:
- 2 triangles pointing toward center = PRIMARY (star points)
- 2 triangles pointing outward = BACKGROUND

WITH 3 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): 4 corner squares + outer triangles in QST units
- PRIMARY (fabricColors[1]): 8 star point triangles (the star itself)
- SECONDARY (fabricColors[2]): Center square (focal point)

Separates the center from the star points for added visual interest and focal emphasis.

DESIGN TIP: Use high contrast between Primary star and Background so the star 
reads clearly. The center (Secondary) can be bold to anchor the design or subtle 
to let the star dominate.`,

  cuttingInstructions: `Ohio Star cutting specifics:

All pieces are based on 1/3 of finished block size
Example: For 9" finished block, each section is 3" finished (3.5" cut with seam allowance)

BACKGROUND fabric (fabricColors[0]):
- Cut 4 corner squares (3.5" for 9" block)
- Cut squares for QST units (see method below)

PRIMARY fabric (fabricColors[1]):
- Cut squares for QST units (see method below)
- For 2-fabric version: also cut 1 center square

SECONDARY fabric (fabricColors[2]) - if using 3 fabrics:
- Cut 1 center square

QST CONSTRUCTION METHODS:

**Method 1: HST to QST** (recommended)
1. Cut squares from Background and Primary
2. Make 2 HSTs with opposite color combinations
3. Place HSTs right sides together, opposite colors touching
4. Draw diagonal perpendicular to seam
5. Sew 1/4" on both sides of line
6. Cut on drawn line
7. Yields 2 QST units (need 4 total, so make 8 HSTs → 4 QSTs)

**Method 2: Direct QST**
1. Layer two squares right sides together
2. Draw both diagonals (X pattern)
3. Sew 1/4" on both sides of BOTH lines
4. Cut on both drawn lines
5. Yields 4 identical QST units

QST cutting size: Finished block size ÷ 3 + 1.25"
Example: 9" block → 3" + 1.25" = 4.25" squares for QST method`,

  assemblyNotes: `Assembly tips for Ohio Star:

CONSTRUCTION:
1. **Build 4 QST units first**:
   - Each unit has 2 Primary triangles (pointing inward) + 2 Background triangles (pointing outward)
   - Orient so Primary triangles point toward what will be center
   - Square up each QST unit to exact size

2. **Arrange in 3x3 grid**:
   - Top row: Background corner, QST, Background corner
   - Middle row: QST, Center square, QST
   - Bottom row: Background corner, QST, Background corner

3. **Verify QST orientation**:
   - ALL star point triangles should point toward the center square
   - Check orientation before sewing rows

4. **Sew rows together**:
   - Press seams AWAY from QST units (reduces bulk)
   - Pin at seam intersections, nesting seams
   - Join rows carefully - star points should meet at center

ACCURACY TIPS:
- All QST units must be identical size
- Star point triangles must all point toward center
- Handle bias edges carefully (all triangle edges are bias)
- Use starch to stabilize QST units before assembly
- Pin at every seam intersection when joining rows

PRESSING:
- Press QST seams open or consistently to one side
- Press row seams away from QST units
- Don't overpress - can distort bias edges`,

  commonMistakes: `Avoid these Ohio Star mistakes:
- QST orientation wrong (star points must ALL aim toward center, not outward)
- Stretching bias edges on triangles (all edges in QSTs are bias)
- Inconsistent QST sizes (star points won't meet cleanly at center)
- Not enough contrast between star and background (star disappears)
- Pressing row seams toward QST units (creates bulk at intersections)
- Not squaring up QST units before assembly (compounds alignment errors)
- Center point where all 4 QSTs meet not crisp (hallmark of sloppy construction)
- Using directional prints for triangles (pattern gets chaotic)
- Not using starch to stabilize bias edges (units stretch and distort)`
};