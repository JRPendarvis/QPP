import { PatternPrompt } from '../../../types/PatternPrompt';

export const NEW_YORK_BEAUTY_PROMPT: PatternPrompt = {
  patternName: 'New York Beauty',
  recommendedFabricCount: 4,

  characteristics: `New York Beauty is a dramatic curved, radiating quilt design:
- Built around a quarter-circle "fan" that grows out from one corner of the block
- The fan is subdivided into wedge-like slices that create a sunrise / crown / fan effect
- A smaller inner quarter-circle anchors the corner and strengthens the circular motion
- Strong contrast makes the fan read clearly against the background
- Creates beautiful secondary designs when multiple blocks are arranged and rotated in a quilt top
- Traditional name history includes regional names such as Rocky Mountain Road and Crown of Thorns; the name "New York Beauty" became widely used after early 20th-century publication.`
  ,

  fabricRoleGuidance: `New York Beauty (Corner Fan) fabric assignments (supports 3–5 fabrics):

WITH 3 FABRICS (simple & bold):
- BACKGROUND (fabricColors[0]): main block area / negative space
- FAN BASE (fabricColors[1]): the curved band behind the wedges (the "ring" of the fan)
- FAN WEDGES (fabricColors[2]): all wedge slices in the fan + (optionally) the corner quarter-circle

This is the cleanest MVP look: strong shapes, easy contrast.

WITH 4 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): main block area / negative space
- FAN BASE (fabricColors[1]): the curved band behind the wedges
- FAN WEDGES (fabricColors[2]): wedge slices in the fan
- CORNER (fabricColors[3]): inner corner quarter-circle (the “sun” anchor)

This reads most like a true New York Beauty corner fan and gives the best definition.

WITH 5 FABRICS (maximum detail for MVP):
- BACKGROUND (fabricColors[0]): main block area / negative space
- FAN BASE (fabricColors[1]): the curved band behind the wedges
- FAN WEDGES A (fabricColors[2]): alternating wedges
- CORNER (fabricColors[3]): inner corner quarter-circle
- FAN WEDGES B (fabricColors[4]): alternating wedges (checker/stripe effect)

DESIGN TIP:
- Use high contrast between FAN WEDGES and FAN BASE so the fan slices pop.
- Make the CORNER bold (or high-value contrast) so it anchors the motion.
- If using 5 fabrics, keep Wedges A and Wedges B clearly different (value contrast works better than subtle color changes).

IMPORTANT:
- Block orientation is usually fixed during construction.
- The “magic” happens at layout time: rotating multiple blocks creates circles, pinwheels, crowns, and continuous curves.`
  ,

  cuttingInstructions: `New York Beauty (Corner Fan) cutting specifics for this MVP implementation:

THIS MVP VERSION FOCUSES ON CURVED WEDGE PIECES (not mandatory foundation paper piecing).

BACKGROUND (fabricColors[0]):
- Cut one block square (unfinished size depends on your chosen block size in your quilt plan)
- Mark the quarter-circle placement area from the corner where the fan will sit

FAN BASE (fabricColors[1]):
- Cut a quarter-ring band (a curved strip section) that forms the fan band
- This is the area between an outer radius and an inner radius (e.g., outer ~50, inner ~25 in the SVG concept)

FAN WEDGES (fabricColors[2]) and (optional) CONTRAST WEDGES (fabricColors[4]):
- Cut wedge-shaped slices that fit inside the fan band
- These slices should be consistent in angle/width so the fan reads evenly

CORNER (fabricColors[3]):
- Cut an inner quarter-circle that anchors the corner (the “sun”)

TEMPLATES:
- Use template plastic, freezer paper, or printed templates for the curved arcs
- Consistency matters more than complexity; accurate curves = a clean block.`
  ,

  assemblyNotes: `Assembly tips for New York Beauty (Corner Fan MVP):

CONSTRUCTION SEQUENCE (recommended):
1) **Piece the fan wedges**:
   - Sew wedge slices together in order to build the fan section
   - If using 5 fabrics, alternate Wedges A and Wedges B consistently
   - Press seams consistently (often toward the darker wedge or in a direction that reduces bulk)

2) **Join the fan wedges to the fan base curve**:
   - If your construction separates wedges and the base band, sew them with a smooth, pinned curve
   - Pin at both ends and several points along the curve
   - Sew slowly; do not stretch edges

3) **Add the corner quarter-circle**:
   - Align carefully at the corner and along the inner curve
   - Press gently following the curve (don’t distort the arc)

4) **Set the completed fan unit into the background**:
   - Use lots of pins along the outer curve
   - Sew slowly and keep the arc smooth

CURVED SEAM TECHNIQUE:
- Pin at endpoints first, then add pins every small interval along the curve
- Sew with the concave piece on top when possible for visibility/control
- Clip concave seam allowances if needed so the curve lays flat
- Press in sections along the curve—don’t “iron” aggressively across it

SKILL NOTE:
This is an ADVANCED curved-piecing pattern. If you haven’t done curves yet, practice on Drunkard’s Path-style curves first.`
  ,

  commonMistakes: `Avoid these New York Beauty mistakes (Corner Fan MVP):
- Wedges that are inconsistent in width/angle (fan looks uneven and “wobbly”)
- Low contrast between wedges and fan base (the fan disappears visually)
- Stretching bias edges while sewing curves (causes ripples and distortion)
- Not pinning enough along the curve (creates pleats and misalignment)
- Pressing aggressively across curves (distorts the arc and warps alignment)
- Mixing up alternating wedge colors mid-fan (breaks the rhythm/pattern)
- Forgetting that layout rotation creates the secondary designs (block looks “unfinished” alone)`
};
