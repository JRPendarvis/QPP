import { PatternPrompt } from '../../../types/PatternPrompt';

export const LONE_STAR_PROMPT: PatternPrompt = {
  patternName: 'Lone Star',
  recommendedFabricCount: 6,
  
  characteristics: `Lone Star (also called Star of Bethlehem) is a dramatic radiating 8-pointed star:
- Built from concentric rings of diamonds creating a sunburst effect
- Each ring is a different fabric, graduating from center to points
- 8 large diamond points extend from center to edges of the quilt
- Corner squares and setting triangles fill the background around the star
- One of the most impressive and recognizable traditional quilt patterns
- Also known as: Star of Bethlehem, Star of the East, Blazing Star, Starburst
- Typically a single large statement piece, not a repeating block pattern
- Advanced skill level - requires precision piecing with set-in seams (Y-seams)`,

  fabricRoleGuidance: `Lone Star fabric assignments (supports 4-8 fabrics):

WITH 4 FABRICS (minimum):
- BACKGROUND (fabricColors[0]): Corner squares and setting triangles
- PRIMARY (fabricColors[1]): Center ring (innermost diamonds)
- SECONDARY (fabricColors[2]): Middle ring
- ACCENT (fabricColors[3]): Outer ring (tips of star points)

Creates basic three-ring radiating effect with background.

WITH 5-6 FABRICS (recommended):
- BACKGROUND (fabricColors[0]): Corner squares and setting triangles
- PRIMARY (fabricColors[1]): Center ring (Ring 1 - star heart)
- SECONDARY (fabricColors[2]): Ring 2
- ACCENT (fabricColors[3]): Ring 3
- CONTRAST (fabricColors[4]): Ring 4
- Additional (fabricColors[5]): Ring 5 (outer ring/tips)

Creates classic graduated sunburst with 4-5 concentric diamond rings.

WITH 7-8 FABRICS (maximum drama):
- BACKGROUND (fabricColors[0]): Corner squares and setting triangles
- PRIMARY through Additional (fabricColors[1-7]): Seven concentric diamond rings

Each ring is distinct fabric, creating maximum depth and dramatic radiating effect.

DESIGN STRATEGIES:
1. **Value graduation**: Progress from light center to dark tips (or reverse)
2. **Color temperature**: Warm center radiating to cool edges (or reverse)
3. **Rainbow effect**: Follow color wheel from center outward
4. **Monochromatic**: Shades of one color from pale to saturated

CRITICAL: Use high contrast between adjacent rings so each ring reads clearly. 
The concentric rings create the signature sunburst effect.`,

  cuttingInstructions: `Lone Star cutting specifics:

DIAMOND PIECES:
All star pieces are 45° diamonds (parallelograms)
- Each concentric ring uses the same fabric for all 8 star points
- Ring 1 (PRIMARY): 8 diamonds
- Ring 2 (SECONDARY): 8 diamonds
- Ring 3 (ACCENT): 8 diamonds
- Ring 4+ (CONTRAST, Additional): 8 diamonds each ring

Total diamonds needed depends on number of rings (typically 4-7 rings = 32-56 diamonds)

BACKGROUND PIECES (fabricColors[0]):
- 4 corner squares (size depends on finished star diameter)
- 4 side setting triangles (fill gaps between star points)

CUTTING METHODS:
1. **Template method**: Create 45° diamond template, trace and cut
2. **45° ruler method**: Use specialty ruler designed for diamonds
3. **Strip piecing** (recommended for accuracy):
   - Cut strips of each ring fabric
   - Sew strips together in ring order
   - Crosscut at 45° angle to create diamond segments
   - Each segment contains all rings in correct sequence

CRITICAL: Maintain consistent grain line on all diamonds (typically cut with one edge on straight grain, opposite edge on bias). This prevents excessive stretching.

Strip width typically: 2" to 3" (finished size 1.5" to 2.5")`,

  assemblyNotes: `Assembly tips for Lone Star:

CONSTRUCTION SEQUENCE:
1. **Build diamond segments** (if using strip piecing):
   - Sew strips together in ring sequence (Ring 1→7)
   - Crosscut at 45° to create diamond segments
   - Each segment contains all rings

2. **Construct 8 star points**:
   - Each point uses 8-14 diamonds (depending on number of rings)
   - Arrange diamonds with Ring 1 (center) at inner point, Ring 7 at outer tip
   - Sew diamonds in diagonal rows
   - Join rows to form complete point

3. **Join star points**:
   - Arrange all 8 points in star formation on design wall
   - Verify color rings align perfectly across points
   - Join points in pairs (creates 4 pairs)
   - Join pairs into halves (creates 2 halves)
   - Join halves to complete star center

4. **Set in background pieces** (Y-seams):
   - Pin corner squares into angles between star points
   - Sew using Y-seam technique (partial seams, pivot at corner)
   - Add side setting triangles to complete square

PRESSING:
- Press seams in alternating directions by row (allows nesting)
- Press center seams open to reduce bulk
- Handle bias edges gently to avoid stretching

ACCURACY TIPS:
- ALL diamond edges are bias - handle extremely carefully
- Use starch before cutting to stabilize fabric
- Pin at every seam intersection before sewing
- Sew from wide end to point of diamonds (prevents stretching)
- Check ring alignment frequently as you build points
- Work on design wall to verify correct placement

This is an ADVANCED pattern requiring precision and patience.`,

  commonMistakes: `Avoid these Lone Star mistakes:
- Stretching bias diamond edges (star will ripple and not lie flat)
- Inconsistent seam allowances (rings won't align across the 8 points)
- Incorrect color ring sequence in any point (breaks the radiating symmetry)
- Not pressing seams in alternating directions (creates bulk, prevents nesting)
- Rushing Y-seams when setting in corners (causes puckers and points that don't match)
- Cutting diamonds off-grain (causes severe distortion and stretching)
- Adjacent ring colors without enough contrast (rings blur together, lose definition)
- Not using starch to stabilize bias edges (diamonds stretch and distort)
- Pressing too hard (permanently distorts bias edges)
- Attempting this pattern as a beginner (master simpler star patterns first)
- Not checking alignment on design wall before sewing points together (errors compound)
- Mixing up ring order in different points (breaks the concentric pattern)`
};