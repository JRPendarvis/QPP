import { PatternPrompt } from '../../../types/PatternPrompt';

export const HALF_SQUARE_TRIANGLES_PROMPT: PatternPrompt = {
  patternName: 'Half-Square Triangles',
  recommendedFabricCount: 2,
  
  characteristics: `Half-Square Triangles (HST) are the fundamental building block of quilting:
- Each HST unit is a square divided diagonally into two triangles
- The most versatile quilting unit - foundation for countless patterns
- Creates pinwheels, chevrons, zigzags, stars, hourglass blocks, and more
- Simple construction with endless design possibilities
- Rotation and arrangement of HSTs creates secondary patterns
- Can be combined into larger blocks or used as standalone pattern
- Beginner-friendly with room for advanced techniques`,

  fabricRoleGuidance: `Half-Square Triangle fabric assignments (supports 2-6 fabrics):

WITH 2 FABRICS (traditional):
- BACKGROUND (fabricColors[0]): One triangle in every HST unit
- PRIMARY (fabricColors[1]): Opposite triangle in every HST unit

Classic high-contrast approach creates the clearest diagonal lines and patterns.

WITH 3 FABRICS (scrappy start):
- BACKGROUND (fabricColors[0]): Consistent triangle across all units
- PRIMARY (fabricColors[1]): Opposite triangle in some units
- SECONDARY (fabricColors[2]): Opposite triangle in other units (alternates with Primary)

Background stays constant while the contrast triangle alternates for subtle variety.

WITH 4 FABRICS:
- BACKGROUND (fabricColors[0]): Consistent triangle across all units
- PRIMARY (fabricColors[1]): First contrast triangle
- SECONDARY (fabricColors[2]): Second contrast triangle
- ACCENT (fabricColors[3]): Third contrast triangle

Contrast triangles rotate through Primary, Secondary, Accent for more scrappy effect.

WITH 5-6 FABRICS (maximum scrappy):
- BACKGROUND (fabricColors[0]): Consistent triangle across ALL units
- PRIMARY through ADDITIONAL (fabricColors[1-5]): Contrast triangles rotate block-to-block

Creates maximum variety while maintaining visual cohesion through consistent Background.

CRITICAL: The Background triangle must remain in the SAME POSITION across all blocks. 
Only the contrast triangle colors change. This consistency allows secondary patterns to 
emerge when blocks are rotated and arranged.

DESIGN TIP: Choose a neutral or light Background that works with all contrast colors. 
Use high contrast between Background and all other fabrics so diagonal lines read clearly.`,

  cuttingInstructions: `Half-Square Triangle cutting specifics:

CUTTING SIZE FORMULA:
Finished HST size + 7/8" = cutting size for starting squares
Example: For 3" finished HST, cut 3-7/8" squares

BACKGROUND fabric (fabricColors[0]):
- Cut many squares (one per HST unit)
- This fabric stays consistent throughout

PRIMARY, SECONDARY, ACCENT, CONTRAST, ADDITIONAL fabrics (fabricColors[1-5]):
- Cut squares from each fabric
- For scrappy quilts: cut varying quantities to control color distribution

CUTTING METHODS:
1. **Traditional method** (yields 2 HSTs per pair):
   - Cut squares from two fabrics
   - Layer right sides together
   - Draw diagonal line corner to corner
   - Sew 1/4" on both sides of drawn line
   - Cut apart on drawn line
   - Press and trim to size

2. **Eight-at-once method** (efficient for multiple HSTs):
   - Uses larger squares, yields 8 identical HSTs
   - Good for consistent traditional quilts

3. **Triangle paper**: Pre-printed lines for accuracy
4. **Specialty rulers**: Some have built-in trimming guides

Always trim HSTs to exact size after pressing for accurate piecing.`,

  assemblyNotes: `Assembly tips for Half-Square Triangles:

CONSTRUCTION:
1. Sew HST units using your chosen method
2. Press seams toward darker triangle (reduces show-through) or press open (reduces bulk)
3. Trim dog ears (little triangle points beyond the square)
4. Square up each HST to exact size using a square ruler
5. Lay out HSTs in desired pattern, rotating units to create design
6. Sew HSTs into rows
7. Join rows together, nesting seams when possible

ACCURACY TIPS:
- Don't stretch the bias edges (HSTs have two bias edges - handle carefully)
- All HSTs must be EXACTLY the same size for proper alignment
- Use a scant 1/4" seam allowance
- Starch fabrics before cutting to stabilize bias edges
- Press gently - too much pressure distorts the bias

ROTATION PLANNING:
- HSTs can be oriented 4 ways (rotating 90° each time)
- Lay out ALL units before sewing to plan pattern
- Common arrangements: checkerboard, pinwheels, chevrons, zigzags
- Small changes in rotation create dramatically different patterns
- Step back and view from a distance before committing

For scrappy quilts: Distribute contrast colors evenly across the layout. 
Keep Background triangles in consistent orientation for pattern clarity.`,

  commonMistakes: `Avoid these Half-Square Triangle mistakes:
- Stretching bias edges during pressing or sewing (distorts squares into parallelograms)
- Not trimming HSTs to exact size (small errors multiply across many units)
- Inconsistent seam allowances (some HSTs end up larger or smaller)
- Not squaring up before assembly (misaligned points and wonky rows)
- Pressing too hard (distorts bias edges permanently)
- Random HST orientation without planning (loses intended pattern)
- In scrappy versions: rotating the Background triangle position (breaks pattern continuity)
- Not using enough contrast between fabrics (diagonal line disappears)
- Pressing seams all the same direction when they need to nest (creates bulk at intersections)
- Rushing through the trimming step (accuracy is critical for HSTs)`
};