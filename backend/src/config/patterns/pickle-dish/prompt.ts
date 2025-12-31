import { PatternPrompt } from '../types';

export const PICKLE_DISH_PROMPT: PatternPrompt = {
  patternName: 'Pickle Dish',
  recommendedFabricCount: 4,
  
  characteristics: `Pickle Dish (also called Indian Wedding Ring) is an intricate curved pattern with radiating wedges:
- Four curved pieced arcs arranged in a circular ring formation
- Each arc contains radiating wedge-shaped "teeth" or "pickles" 
- Wedges are typically arranged in concentric rings within each arc
- Corner melon shapes where adjacent arcs meet
- Center opening reveals the background
- Similar to Double Wedding Ring but with pointed wedges instead of smooth pieced arcs
- When blocks are tiled, creates interlocking rings with dramatic radiating effects
- One of the most challenging traditional curved piecing patterns
- Expert skill level - combines foundation piecing with complex curved seams and Y-seams`,

  fabricRoleGuidance: `Pickle Dish fabric assignments (supports 4-6 fabrics):

WITH 4 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Center opening and surrounding background space
- PRIMARY (fabricColors[1]): First ring of arc wedges (innermost)
- SECONDARY (fabricColors[2]): Second ring of arc wedges
- ACCENT (fabricColors[3]): Corner melon shapes (where arcs connect)

Classic approach with two concentric rings of wedges creating depth and dimension.

WITH 5 FABRICS:
- BACKGROUND (fabricColors[0]): Center opening and surrounding background
- PRIMARY (fabricColors[1]): First ring of arc wedges (innermost)
- SECONDARY (fabricColors[2]): Second ring of arc wedges
- ACCENT (fabricColors[3]): Corner melon shapes
- CONTRAST (fabricColors[4]): Third ring of arc wedges (outermost)

Adds third concentric ring for more complexity and visual interest.

WITH 6 FABRICS (maximum complexity):
- BACKGROUND (fabricColors[0]): Center opening and surrounding background
- PRIMARY (fabricColors[1]): First ring of arc wedges
- SECONDARY (fabricColors[2]): Second ring of arc wedges
- ACCENT (fabricColors[3]): Corner melon shapes
- CONTRAST (fabricColors[4]): Third ring of arc wedges
- ADDITIONAL (fabricColors[5]): Inner melon detail or fourth wedge ring

Creates most intricate version with maximum depth and dimension.

DESIGN TIP: Use graduated values from inner to outer wedge rings (light to dark 
or dark to light) to enhance the radiating effect. High contrast between wedge 
rings creates clear definition. Corner melons (Accent) should be bold to anchor 
the design at connection points.

CRITICAL: Colors must remain consistent across all blocks - curved arcs must 
align perfectly when blocks are tiled to create the interlocking ring pattern.`,

  cuttingInstructions: `Pickle Dish cutting specifics:

FOUNDATION PAPER PIECING (REQUIRED):
Each arc section MUST be foundation paper pieced for accuracy
- Print FPP templates with radiating wedges marked
- Each wedge is a narrow triangle pointing outward from arc
- Typically 8-16 wedges per arc, arranged in 2-4 concentric rings

BACKGROUND fabric (fabricColors[0]):
- Cut center opening (use template)
- Cut background pieces between rings
- Use curved templates for precision

PRIMARY fabric (fabricColors[1]):
- Cut wedges for innermost ring (piece onto foundation paper)

SECONDARY fabric (fabricColors[2]):
- Cut wedges for second ring (piece onto foundation paper)

ACCENT fabric (fabricColors[3]):
- Cut 4 corner melon shapes (use curved template)

CONTRAST fabric (fabricColors[4]) - if using 5+ fabrics:
- Cut wedges for third ring (piece onto foundation paper)

ADDITIONAL fabric (fabricColors[5]) - if using 6 fabrics:
- Cut inner melon details or fourth ring wedges

CRITICAL: All curved pieces require precise templates. This is an EXPERT-LEVEL 
pattern - even small cutting errors are magnified across multiple curved seams.`,

  assemblyNotes: `Assembly tips for Pickle Dish:

CONSTRUCTION SEQUENCE:
1. **Foundation paper piece each arc section** (4 total):
   - Piece wedges onto foundation in rings from inside out
   - Typically: Primary ring (inner) → Secondary ring → Contrast ring (outer)
   - Trim arc to exact curved edges after piecing
   - Remove paper only after all surrounding seams are sewn

2. **Join arc sections into ring** (curved seams):
   - Pin carefully at center, ends, and along curve
   - Sew with concave piece on top for visibility
   - Creates circular ring with 4 arcs

3. **Set corner melon shapes** (Y-seams):
   - Pin melon into angle where arcs meet
   - Use Y-seam technique (partial seams, pivot)
   - All 4 melons connect the arcs

4. **Set completed ring into background** (curved seam):
   - Pin extensively around entire circular opening
   - Sew slowly, easing fabric as you go
   - Clip background seam allowance to allow curve to lie flat

CURVED SEAM TECHNIQUE:
- Pin at center first, then ends, then many intermediate points
- Sew with concave (inward) curve on top
- Clip concave seam allowances perpendicular to stitching
- Press gently following the curve
- Don't stretch bias edges

ACCURACY TIPS:
- Foundation paper piecing is NON-NEGOTIABLE for wedge sections
- Use spray starch before cutting all pieces
- Mark curved seam starting/stopping points clearly
- This pattern requires exceptional precision - take your time
- Work on design wall to verify color placement

This is an EXPERT-LEVEL pattern. Master simpler curved piecing patterns 
(Drunkard's Path, New York Beauty) before attempting Pickle Dish.`,

  commonMistakes: `Avoid these Pickle Dish mistakes:
- Attempting wedges without foundation paper piecing (accuracy is impossible)
- Stretching bias edges on curves (causes severe rippling and distortion)
- Not clipping concave seam allowances (creates puckers and bulges)
- Inconsistent wedge angles or sizes (breaks the radiating symmetry)
- Rushing curved seams without adequate pinning (creates pleats and misalignment)
- Low contrast between wedge rings (pattern loses definition and depth)
- Removing foundation paper too early (wedges lose their shape)
- Not using starch to stabilize all pieces (bias edges stretch)
- Attempting this pattern without prior extensive curved piecing experience
- Random block orientation instead of planned layout (breaks interlocking ring pattern)
- Not pressing curves carefully (can flatten the dimensional curve)`
};