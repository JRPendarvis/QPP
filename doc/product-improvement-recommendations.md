# QPP Product Improvement Recommendations

Last updated: 2026-06-16
Owner: Product + Engineering
Scope: Keep QPP stash-first (no inventory tracker)

## Confirmed Product Constraint

- Fabric stash support should remain lightweight and project-scoped.
- Do not expand into a full inventory tracker that can scale to thousands of pieces.

## In Progress

### 1) Stash Yardage Reality Check

Status: Implemented on branch `feature/stash-yardage-reality-check`

What it does:
- Accepts optional yardage-on-hand for current project roles (`background`, `primary`, `secondary`, `accent`).
- Compares available yardage to generated requirements.
- Returns and displays clear fit results:
  - enough vs short by role
  - total shortfall

Why it matters:
- Helps quilters decide if they can complete a pattern with current stash.
- Supports stash-first workflow without inventory complexity.

## Recommended Next Features (No Shopping List, No Inventory Tracker)

### 2) Pattern Feasibility Score

- Show a pre-execution fit signal: High / Medium / Low.
- Inputs: yardage sufficiency, value/contrast confidence, skill match.
- Outcome: fewer failed starts and better user trust.

### 3) Make-It-Work Rescue Mode

- If fit is weak, provide one-click options:
  - reduce quilt size
  - reduce accent usage
  - reassign fabric roles
  - regenerate with stricter constraints
- Outcome: recover from near-miss projects without user frustration.

### 4) Fabric Value & Contrast Analyzer

- Analyze uploaded photos for light/medium/dark separation and clash risk.
- Explain failures in plain language (example: low background-primary contrast).
- Outcome: better pattern readability and fewer visual surprises.

### 5) Alternate Pattern Suggestions From Same Stash

- After generation, suggest 3-5 alternate patterns that fit the same fabrics and similar yardage.
- Outcome: higher engagement and better conversion within current stash.

### 6) Cutting Efficiency View (Execution Aid)

- Add a stash-oriented cutting optimization view.
- Focus on reducing waste with available yardage.
- Outcome: practical utility while preserving core product focus.

### 7) Skill Progression Paths

- Recommend next patterns based on completed projects and current skill profile.
- Outcome: retention via clear progression and confidence-building.

### 8) Block Swap / Hybrid Pattern Mode

- Allow swapping compatible block sections while preserving dimensions and fabric roles.
- Outcome: personalization without requiring net-new fabric.

### 9) PDF Execution Upgrades

- Improve print output with role swatches, clearer legends, and step checkboxes.
- Outcome: easier real-world use at sewing machine.

### 10) Budget Saved Insight (No Shopping Workflow)

- Show estimated cost avoided by using on-hand fabric.
- Outcome: reinforces stash-first value proposition.

## Recommended Implementation Order

1. Feasibility Score + Yardage Reality Check (fast ROI)
2. Make It Work Rescue Mode
3. Color/Value Analyzer
4. Alternate Pattern Suggestions
5. Reuse Planner + Skill Pathways

## Secondary Backlog (After Top 5)

- Cutting Efficiency View
- Block Swap / Hybrid Pattern Mode
- PDF Execution Upgrades
- Budget Saved Insight

## Quick Success Metrics

- % of generations with stash check enabled
- % of projects marked "enough" vs "short"
- rescue-mode usage rate (when added)
- download rate after "short" warning
- 7-day repeat generation rate

## Guardrails

- Keep inputs optional and lightweight.
- Do not require users to catalog entire stash.
- Prioritize project-level decisions over inventory management.
