import { PatternPrompt } from '../types';

export const STRIP_QUILT_PROMPT: PatternPrompt = {
  patternName: 'Strip Quilt',
  recommendedFabricCount: 3,

  characteristics: `Strip Quilt is a simple vertical strip pattern:
- Vertical strips of equal width running the full height of the block
- Number of strips matches number of fabrics provided (2-8)
- When tiled, creates continuous vertical columns
- Can be rotated 90° at layout to create horizontal strips
- One of the fastest patterns to piece
- Perfect for showcasing fabric collections or creating bold graphic designs`,

  fabricRoleGuidance: `Strip Quilt fabric assignments (supports 2-8 fabrics):

WITH 2 FABRICS:
- COLOR1: Left strip
- COLOR2: Right strip
- Creates bold two-tone vertical columns

WITH 3 FABRICS:
- COLOR1: Left strip
- COLOR2: Center strip
- COLOR3: Right strip
- Arrange light-to-dark for gradient, or alternate values for contrast

WITH 4 FABRICS:
- COLOR1-4: Four equal strips, left to right
- Consider symmetrical arrangement (light-dark-dark-light) or gradient

WITH 5-8 FABRICS:
- COLOR1-8: Each fabric gets one strip, arranged left to right
- More fabrics = narrower strips
- Arrange by value for gradient effect, or alternate for bold stripes

All fabrics are treated equally — no background/accent hierarchy. Consider arranging fabrics by value (light to dark) for a gradient effect, or alternate high-contrast fabrics for bold stripes.

Note: Strip direction is fixed — rotate blocks 90° at layout if horizontal stripes are desired.`,

  cuttingInstructions: `Strip Quilt cutting specifics:
- Cut strips the full length of the quilt (or block height)
- Strip width = finished quilt width ÷ number of fabrics (plus seam allowances)
- Ideal for efficient long-strip cutting
- No crosscutting required
- For scrappy variations: cut multiple strips per fabric position from different fabrics`,

  assemblyNotes: `Assembly tips for Strip Quilt:
- Sew strips together along the long edges
- Press all seams in one direction
- For very long strips, pin frequently to prevent shifting
- Consider chain-piecing multiple quilt tops at once
- Plan strip order before sewing — it determines the visual sequence`,

  commonMistakes: `Avoid these Strip Quilt mistakes:
- Uneven strip widths (creates wonky columns)
- Stretching long strips while sewing (causes waves)
- Not pressing consistently (wavy seams)
- Forgetting that strip order determines the visual sequence
- Rotating blocks randomly instead of consistently (breaks column continuity)`
};