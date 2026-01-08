import { PatternPrompt } from '../../../types/PatternPrompt';

export const PINWHEEL_PROMPT: PatternPrompt = {
  patternName: 'Pinwheel',
  recommendedFabricCount: 2,

  characteristics: `Pinwheel is a dynamic spinning block made from half-square triangles:
- 2x2 grid of 4 half-square triangles (HSTs)
- Each HST is divided by a single diagonal
- HSTs are oriented so one color forms "blades" spinning around the center
- Creates a windmill or fan effect radiating from center point
- NOT the same as Hourglass (which uses quarter-square triangles with X division)
- Beginner-friendly construction with high visual impact
- When tiled, pinwheels can spin in the same or alternating directions`,

  fabricRoleGuidance: `Pinwheel fabric assignments (supports 2-4 fabrics):

WITH 2 FABRICS (traditional - recommended):
- BACKGROUND (fabricColors[0]): Background triangles
- PRIMARY (fabricColors[1]): Blade triangles

Classic two-fabric approach creates clear spinning motion with maximum impact.

WITH 3 FABRICS:
- BACKGROUND (fabricColors[0]): Background triangles (consistent)
- PRIMARY (fabricColors[1]): Blade triangles
- SECONDARY (fabricColors[2]): Blade triangles (adds contrast/variety)

In the 3-fabric version, both blade fabrics can appear within each block depending on the template.

WITH 4 FABRICS:
- BACKGROUND (fabricColors[0]): Background triangles (consistent)
- PRIMARY (fabricColors[1]): Blade triangles
- SECONDARY (fabricColors[2]): Blade triangles
- ACCENT (fabricColors[3]): Blade triangles (highlight)

DESIGN TIP: Use high contrast between Background and blade fabrics so the 
spinning motion reads clearly. All blade triangles must point the same 
rotational direction (all clockwise or all counter-clockwise) for the 
pinwheel effect to work.

BLOCK ROTATION: Pinwheels can be rotated during layout to create secondary 
patterns. Alternating rotations adds dynamic movement.`,

  cuttingInstructions: `Pinwheel cutting specifics:

Made from 4 half-square triangles (HSTs) per block.

GENERAL HST SIZING:
- If using the no-trim method: cut squares = finished HST size + 7/8"
- If using a trim-to-size method: cut slightly larger, then trim HSTs to the unfinished size

BACKGROUND fabric (fabricColors[0]):
- Cut squares for HST pairs with each blade fabric

PRIMARY / SECONDARY / ACCENT fabrics (fabricColors[1-3]):
- Cut squares for HST pairs with Background

HST CONSTRUCTION (2-at-a-time):
1. Cut one square from Background and one square from a blade fabric
2. Draw diagonal line corner-to-corner
3. Sew 1/4" on both sides of the drawn line
4. Cut on the drawn line
5. Press and trim HSTs to the unfinished size for accurate piecing

Always trim HSTs to exact size after pressing for accurate assembly.`,

  assemblyNotes: `Assembly tips for Pinwheel:

CONSTRUCTION:
1. Make 4 HSTs using your chosen method
2. Arrange in a 2x2 grid with blades spinning:
   - All blade triangles should point the same rotational direction
3. Sew top row (2 HSTs)
4. Sew bottom row (2 HSTs)
5. Press row seams in opposite directions so seams nest
6. Sew rows together and press the final seam open to reduce bulk

ACCURACY TIPS:
- All 4 HSTs must be exactly the same size
- Avoid stretching bias edges when sewing or pressing
- Use consistent scant 1/4" seam allowance
- Lay out before sewing to verify spin direction`,

  commonMistakes: `Avoid these Pinwheel mistakes:
- HST orientation wrong (blades won't spin)
- Confusing Pinwheel with Hourglass (Pinwheel uses HSTs)
- Stretching bias edges on HSTs
- Inconsistent HST sizes (center point won't meet precisely)
- Not trimming HSTs to exact size before assembly
- Pressing row seams in the same direction (seams won't nest)
- Using fabrics without enough contrast (spinning motion disappears)`
};
