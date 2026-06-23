# QPP AI Feature Matrix (Future Work)

## Goal
Use AI where judgment, personalization, and explanation matter.
Keep all core quilt math and generation deterministic for trust, speed, and reliability.

## Decision Rules
- Use AI for: ranking, recommendations, coaching, and natural-language output.
- Avoid AI for: calculations, constraints, deterministic layouts, and final plan correctness.
- Every AI feature must have a deterministic fallback and clear user-facing confidence/uncertainty behavior.

## Matrix
| Feature | Category | Why | Deterministic Fallback | Priority |
|---|---|---|---|---|
| Color coordination | Must-have AI | Subjective aesthetic judgment; high user value | Default role assignment by contrast/value heuristics | P0 |
| Auto pattern selection (QPP chooses pattern) | Must-have AI | Better fit from style + fabrics + skill preferences | Rule-based selector by skill, fabric count, and enabled patterns | P0 |
| Fabric role recommendations (bg/primary/secondary/accent) | Must-have AI | Helps users avoid weak combinations | Fixed role heuristics by value contrast and print scale | P1 |
| Pattern fit scoring (top 3 with rationale) | Must-have AI | Explains recommendation, increases trust | Deterministic score by count, contrast, and complexity match | P1 |
| Contrast/readability warnings | Must-have AI | Catches visual issues before cutting | Deterministic luminance/value delta thresholds | P1 |
| Fabric substitution suggestions from stash | Later AI | Personalization and practical stash workflow | Nearest deterministic match by color/value/type metadata | P2 |
| Style targeting (modern/traditional/bold) | Later AI | Creative direction support | Preset style templates and deterministic mappings | P2 |
| Layout variation suggestions | Later AI | Adds exploration without changing core math | Fixed set of valid deterministic layout variants | P2 |
| Instruction rewrite (beginner/simple mode) | Later AI | Improves readability and accessibility | Static plain-language templates per step type | P2 |
| Mistake-prevention coaching | Later AI | Contextual guidance at key steps | Rule-based warnings by pattern and size | P2 |
| Quilt naming and cover copy | Later AI | Delight and shareability | Deterministic name templates | P3 |
| Smart onboarding assistant | Later AI | Better defaults and faster setup | Guided form with deterministic defaults | P3 |

## Deterministic-Only (Never AI)
These must remain deterministic and testable.

- Quilt generation output structure (block math, layout validity, piece counts)
- Yardage calculations
- Cutting dimensions and quantities
- Border calculations and size adjustments
- Pattern constraints (min/max fabrics, supported ranges)
- PDF data correctness and required sections
- Subscription enforcement and usage limits
- Authentication and authorization

## Implementation Staging
### Stage 1 (Now)
- Keep AI only for:
  - Color coordination
  - Auto pattern selection
- Keep generation deterministic for explicit pattern selections.
- Add feature flags for each AI capability.

### Stage 2 (Next)
- Add deterministic selector parity for auto mode as fallback.
- Add confidence output to AI recommendations.
- Add deterministic fallback messaging when AI fails.

### Stage 3 (Later)
- Add advisory AI features (substitution, style, coaching) behind flags.
- Keep all core outputs deterministic regardless of AI availability.

## Guardrails
- AI outputs must never directly change final cut math without deterministic validation.
- Any AI recommendation applied to a final plan must pass deterministic validators.
- Timeouts, provider errors, and quota errors must degrade gracefully to deterministic mode.
- Log recommendation source (`ai` or `deterministic`) for observability.

## Success Metrics
- Reliability: generation success rate without manual retry
- Latency: median time to first valid plan
- Trust: percent of plans accepted without editing role assignments
- Cost: AI cost per successful quilt plan
- Stability: error rate by source (`ai`, `deterministic`)
