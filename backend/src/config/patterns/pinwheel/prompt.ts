import { PatternPrompt } from '../types';

export const PINWHEEL_PROMPT: PatternPrompt = {
  patternName: 'Pinwheel',
  recommendedFabricCount: 2,
  
  characteristics: `Pinwheel is a dynamic spinning block made from half-square triangles:
- 2x2 grid of 4 half-square triangles (HSTs)
- Each HST is divided by a single diagonal
- HSTs are oriented so one color forms "blades" spinning around the center
- Creates a windmill or fan effect radiating from center point
- NOT the same as Hourglass (which uses quarter-square triangles with X division)
- When tiled, pinwheels can spin in same or alternating directions
- Beginner-friendly construction with high visual impact
- Foundation for many complex patterns`,

  fabricRoleGuidance: `Pinwheel fabric assignments (supports 2-4 fabrics):

WITH 2 FABRICS (traditional - recommended):
- BACKGROUND (fabricColors[0]): 4 background triangles (one per HST)
- PRIMARY (fabricColors[1]): 4 blade triangles (the spinning element)

Classic two-fabric approach creates clear spinning motion with maximum impact.

Layout (2x2 grid of HSTs, each HST has one Background + one Primary triangle):
HSTs arranged so Primary triangles create clockwise (or counter-clockwise) spin.

WITH 3 FABRICS (scrappy start):
- BACKGROUND (fabricColors[0]): 4 background triangles (consistent across all blocks)
- PRIMARY (fabricColors[1]): Blades in some blocks
- SECONDARY (fabricColors[2]): Blades in other blocks (alternates with Primary)

Background stays constant while blade color alternates for variety.

WITH 4 FABRICS (scrappy):
- BACKGROUND (fabricColors[0]): 4 background triangles (consistent across all blocks)
- PRIMARY through ACCENT (fabricColors[1-3]): Blade colors rotate block-to-block

Maximum variety while maintaining the pinwheel structure through consistent Background.

DESIGN TIP: Use high contrast between Background and blade fabrics so the 
spinning motion reads clearly. All 4 blade triangles must point the same 
rotational direction (all clockwise or all counter-clockwise) for the 
pinwheel effect to work.

BLOCK ROTATION: Pinwheels can be rotated during layout to create secondary 
patterns - some spinning clockwise, some counter-clockwise creates dynamic movement.`,

  cuttingInstructions: `Pinwheel cutting specifics:

Made from 4 half-square triangles (HSTs) per block
HST cutting size: Finished HST size + 7/8"
Example: For 9" finished block (4.5" HSTs), cut 5-3/8" squares

BACKGROUND fabric (fabricColors[0]):
- Cut squares for HSTs (need 4 HSTs total, so cut according to method)

PRIMARY, SECONDARY, ACCENT fabrics (fabricColors[1-3]):
- Cut squares for HSTs (blade triangles)

HST CONSTRUCTION METHODS:

**Method 1: Traditional (yields 2 HSTs)**
1. Cut one square from Background, one from Primary
2. Draw diagonal line corner to corner
3. Sew 1/4" on both sides of drawn line
4. Cut on drawn line
5. Press and trim to size
6. Repeat to make 4 HSTs total

**Method 2: Eight-at-once (efficient for multiple blocks)**
Uses larger squares, yields 8 identical HSTs
Good for making many consistent pinwheel blocks

Always trim HSTs to exact size after pressing for accurate piecing.`,

  assemblyNotes: `Assembly tips for Pinwheel:

CONSTRUCTION:
1. **Make 4 HSTs** using your chosen method
2. **Arrange in 2x2 grid with blades spinning**:
   - All 4 blade triangles should point the same rotational direction
   - Clockwise spin OR counter-clockwise spin (pick one)
3. **Sew top row** (2 HSTs)
4. **Sew bottom row** (2 HSTs)
5. **Press row seams in OPPOSITE directions**:
   - Top row: press left (or toward darker fabric)
   - Bottom row: press right (or toward darker fabric)
6. **Pin rows together** at center intersection, nesting seams
7. **Sew rows together**
8. **Press final seam open** (reduces bulk at center point)

ACCURACY TIPS:
- All 4 HSTs must be EXACTLY the same size
- Center point where all 4 HSTs meet should be crisp and precise
- Don't stretch bias edges when sewing or pressing
- Use consistent scant 1/4" seam allowance
- Pin at center intersection before joining rows

ORIENTATION CRITICAL:
- Lay out all 4 HSTs before sewing to verify spin direction
- All blade triangles must point same rotational direction
- One HST oriented wrong breaks the entire pinwheel effect

For scrappy layouts: Rotate which blade fabric you use from block to block, 
keeping Background consistent.`,

  commonMistakes: `Avoid these Pinwheel mistakes:
- HST orientation wrong (blades won't spin - all must point same rotational direction)
- One or more blades pointing opposite direction (breaks the spinning effect completely)
- Confusing Pinwheel with Hourglass (Pinwheel uses HSTs, Hourglass uses QSTs)
- Stretching bias edges on HSTs (all edges except block perimeter are bias)
- Inconsistent HST sizes (center point won't meet precisely)
- Not trimming HSTs to exact size before assembly (compounds alignment errors)
- Pressing row seams same direction (seams won't nest, creates bulk at center)
- Not pressing final seam open (center becomes too bulky)
- In scrappy versions: losing the consistent Background (breaks the visual spin effect)
- Using fabrics without enough contrast (spinning motion disappears)`
};