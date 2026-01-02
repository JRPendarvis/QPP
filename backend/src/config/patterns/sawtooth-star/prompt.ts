import { PatternPrompt } from '../../../types/PatternPrompt';

export const SAWTOOTH_STAR_PROMPT: PatternPrompt = {
  patternName: 'Sawtooth Star',
  recommendedFabricCount: 2,
  
  characteristics: `Sawtooth Star is a classic 8-pointed star block with sawtooth edges:
- Four corner squares (background)
- Four side units, each made of 2 half-square triangles (HSTs)
- Each side unit creates 2 star points (8 total points)
- The HSTs create the characteristic "sawtooth" edge on the star
- One center square as the star's focal point
- Creates a bold, graphic 8-pointed star
- Beginner to intermediate skill level - requires HST construction
- Also known as: Variable Star (when in certain color arrangements)`,

  fabricRoleGuidance: `Sawtooth Star fabric assignments (supports 2-3 fabrics):

WITH 2 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): 4 corner squares + background triangles in HSTs
- PRIMARY (fabricColors[1]): Star point triangles in HSTs + center square

Classic two-fabric approach creates strong 8-pointed star with maximum impact.

Layout (3x3 grid):
[BG] [2HSTs] [BG]
[2HSTs] [PR] [2HSTs]
[BG] [2HSTs] [BG]

Each side unit contains 2 HSTs arranged side-by-side, creating 2 star points 
that extend toward the center.

WITH 3 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): 4 corner squares + background triangles in HSTs
- PRIMARY (fabricColors[1]): 8 star point triangles (the sawtooth star itself)
- SECONDARY (fabricColors[2]): Center square (focal point)

Separates the center from the star points for added visual interest and emphasis.

DESIGN TIP: Use high contrast between Primary star points and Background so the 
sawtooth edges read clearly. The star points are created by the diagonal division 
in each HST - proper orientation is critical.`,

  cuttingInstructions: `Sawtooth Star cutting specifics:

Based on finished block size (example: 12" finished block):
- Corner squares: 4.5" cut (4" finished) - need 4
- Center square: 4.5" cut (4" finished) - need 1
- HST units: 4" finished (need 8 total HSTs)

BACKGROUND fabric (fabricColors[0]):
- Cut 4 corner squares (4.5" for 12" block)
- Cut squares for HSTs (see method below)

PRIMARY fabric (fabricColors[1]):
- Cut squares for HSTs (see method below)
- For 2-fabric version: also cut 1 center square (4.5")

SECONDARY fabric (fabricColors[2]) - if using 3 fabrics:
- Cut 1 center square (4.5")

HST CONSTRUCTION:
HST cutting size: Finished HST size + 7/8"
For 12" block: 4" finished HST → cut 4-7/8" squares

**Two-at-a-time HST method:**
1. Cut squares from Background and Primary (4-7/8")
2. Draw diagonal line on lighter fabric
3. Sew 1/4" on both sides of line
4. Cut on drawn line
5. Press and trim to 4.5" square
6. Need 8 HSTs total

Each HST has one star point triangle (Primary) and one background triangle.`,

  assemblyNotes: `Assembly tips for Sawtooth Star:

CONSTRUCTION:
1. **Make 8 HSTs**:
   - Each has 1 Primary triangle (star point) + 1 Background triangle
   - All HSTs should be identical size (4.5" unfinished for 12" block)

2. **Create 4 side units** (2 HSTs each):
   - Pair HSTs so star points aim toward what will be center
   - Sew 2 HSTs together for each side position
   - Each side unit creates 2 star points

3. **Arrange in 3x3 grid**:
   - Corners: 4 Background squares
   - Sides: 4 two-HST units (star points facing center)
   - Center: 1 center square (Primary or Secondary)

4. **Verify orientation**:
   - Star points in all side units should point TOWARD center
   - Points should create 8-pointed star radiating from center

5. **Sew rows together**:
   - Press row seams away from HST units
   - Pin at seam intersections
   - Join rows carefully

ACCURACY TIPS:
- All HSTs must be exactly the same size
- Star point triangles must aim toward center in all units
- Use scant 1/4" seam allowance
- Press carefully to avoid distorting bias edges
- Pin at every seam intersection

PRESSING:
- Press HST seams toward darker fabric or open
- Press row seams away from HST units (reduces bulk)
- Press final seams consistently`,

  commonMistakes: `Avoid these Sawtooth Star mistakes:
- HST orientation wrong (star points must all aim toward center)
- One or more side units oriented incorrectly (breaks the star pattern)
- Inconsistent HST sizes (star points won't meet cleanly)
- Stretching bias edges in HSTs (all edges except block perimeter are bias)
- Low contrast between star points and background (star disappears)
- Not trimming HSTs to exact size before assembly (compounds alignment errors)
- Confusing Sawtooth Star with Ohio Star (Ohio uses QSTs, Sawtooth uses HSTs)
- Pressing seams toward HST units (creates bulk at intersections)`
};