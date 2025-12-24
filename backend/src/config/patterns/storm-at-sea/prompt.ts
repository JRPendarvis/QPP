import { PatternPrompt } from '../types';

export const STORM_AT_SEA_PROMPT: PatternPrompt = {
  patternName: 'Storm at Sea',
  recommendedFabricCount: 3,
  
  characteristics: `Storm at Sea creates an optical illusion of rolling waves or interlocking circles:
- Four small corner diamonds (nested diamond-in-diamond units)
- Four elongated side connector diamonds linking corners to center
- One large center diamond as the focal point
- All diamond units have a smaller diamond nested inside
- When tiled, creates the illusion of curved, undulating waves despite using only straight lines
- The "movement" comes from how the diamonds connect across block boundaries
- Block orientation is critical — the wave illusion requires consistent alignment`,

  fabricRoleGuidance: `Storm at Sea fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1 (PRIMARY): All outer diamonds and inner nested diamonds
- COLOR2 (BACKGROUND): The "sea" — negative space defining the wave shapes

WITH 3 FABRICS (recommended):
- COLOR1 (PRIMARY): Outer diamonds — creates the main wave structure
- COLOR2 (BACKGROUND): The "sea" — negative space that defines the wave shapes
- COLOR3 (ACCENT): Inner nested diamonds — adds depth and dimension to each unit

WITH 4 FABRICS:
- COLOR1 (BACKGROUND): The sea/negative space
- COLOR2 (PRIMARY): Large outer diamonds (corners and center)
- COLOR3 (SECONDARY): Side connector diamonds
- COLOR4 (ACCENT): All inner nested diamonds

WITH 5-6 FABRICS:
- COLOR1 (BACKGROUND): Consistent sea/negative space
- COLOR2 (PRIMARY): Corner outer diamonds
- COLOR3 (SECONDARY): Side connector outer diamonds
- COLOR4 (TERTIARY): Center outer diamond
- COLOR5-6 (ACCENT): Inner nested diamonds, varying by position

WITH 7-8 FABRICS (scrappy):
- COLOR1 (BACKGROUND): Consistent sea — must remain consistent for wave illusion
- COLOR2-7 (PRIMARY options): Outer diamonds rotate colors across blocks
- COLOR8 (ACCENT): Inner nested diamonds — consistent or varying

High contrast between outer diamonds (COLOR1/PRIMARY) and background (COLOR2) strengthens the wave illusion. Inner nested diamonds should contrast with their outer diamonds to remain visible.

Note: Block orientation is fixed — the wave illusion requires consistent diamond alignment across all blocks. Random rotation breaks the optical effect.`,

  cuttingInstructions: `Storm at Sea cutting specifics:
- Cut squares on point for all diamond shapes (or use diamond templates)
- Corner units: small nested diamond-in-diamond
- Side connectors: elongated diamond shapes (parallelograms)
- Center: large diamond with inner diamond
- Foundation paper piecing recommended for accuracy
- For scrappy versions: cut outer diamonds from multiple fabrics, keep background consistent`,

  assemblyNotes: `Assembly tips for Storm at Sea:
- Build each diamond unit separately first
- Join corner units to side connectors
- Attach side connectors to center diamond
- Press seams toward the background fabric
- Accuracy is critical — small errors compound and break the wave illusion
- Always preview multiple blocks tiled together to verify the wave effect`,

  commonMistakes: `Avoid these Storm at Sea mistakes:
- Misaligning diamond points (disrupts the wave flow between blocks)
- Inconsistent seam allowances (diamonds won't nest properly when tiled)
- Low contrast between waves and background (illusion disappears)
- Forgetting that the magic happens when multiple blocks are joined — always preview tiled
- Rotating blocks randomly (breaks the wave illusion — orientation must be consistent)
- In scrappy versions: varying the background color (destroys the continuous sea effect)`
};