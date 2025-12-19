# Pattern-Specific Prompts Architecture

## Overview
The prompt system has been refactored to support pattern-specific guidance while maintaining a generic fallback for patterns without custom prompts.

## File Structure

```
backend/src/config/prompts/
├── index.ts                          # Main exports and pattern prompt registry
├── churn-dash.prompt.ts              # ✅ Complete example
├── simple-squares.prompt.ts          # ✅ Complete example
├── strip-quilt.prompt.ts             # TODO: Needs content
├── checkerboard.prompt.ts            # TODO: Needs content
├── rail-fence.prompt.ts              # TODO: Needs content
├── four-patch.prompt.ts              # TODO: Needs content
├── nine-patch.prompt.ts              # TODO: Needs content
├── half-square-triangles.prompt.ts   # TODO: Needs content
├── hourglass.prompt.ts               # TODO: Needs content
├── bow-tie.prompt.ts                 # TODO: Needs content
├── flying-geese.prompt.ts            # TODO: Needs content
├── pinwheel.prompt.ts                # TODO: Needs content
├── log-cabin.prompt.ts               # TODO: Needs content
├── sawtooth-star.prompt.ts           # TODO: Needs content
├── ohio-star.prompt.ts               # TODO: Needs content
├── lone-star.prompt.ts               # TODO: Needs content
├── mariners-compass.prompt.ts        # TODO: Needs content
├── new-york-beauty.prompt.ts         # TODO: Needs content
├── storm-at-sea.prompt.ts            # TODO: Needs content
├── drunkards-path.prompt.ts          # TODO: Needs content
├── feathered-star.prompt.ts          # TODO: Needs content
├── grandmothers-flower-garden.prompt.ts  # TODO: Needs content
├── double-wedding-ring.prompt.ts     # TODO: Needs content
├── pickle-dish.prompt.ts             # TODO: Needs content
└── complex-medallion.prompt.ts       # TODO: Needs content
```

## Pattern Prompt Interface

Each pattern prompt file exports a constant with this structure:

```typescript
export const PATTERN_NAME_PROMPT = {
  patternName: string;          // Display name
  characteristics: string;      // Pattern-specific description
  fabricRoleGuidance: string;   // How fabrics should be assigned (background, primary, etc.)
  cuttingInstructions: string;  // Specific cutting tips
  assemblyNotes: string;        // Assembly guidance
  commonMistakes: string;       // Mistakes to avoid
};
```

## Generic vs Pattern-Specific Content

### Generic (in promptBuilder.ts)
These elements apply to ALL patterns:
- Fabric analysis framework (type, value, print scale)
- Role assignment system (background, primary, secondary, accent)
- Value contrast principles
- General quilting best practices
- JSON response structure
- Skill level descriptions

### Pattern-Specific (in prompt files)
These elements are unique to each pattern:
- Specific block structure (e.g., "Churn Dash has HSTs in corners")
- Which fabrics work best in which positions for THIS pattern
- Pattern-specific cutting requirements
- Assembly sequences unique to this pattern
- Common mistakes specific to this pattern type

## How It Works

1. **Pattern Selection** (`promptBuilder.ts:selectPattern()`)
   - Returns: `{ patternForSvg, patternInstruction, patternId }`
   - patternId is used to look up the pattern-specific prompt

2. **Prompt Building** (`promptBuilder.ts:buildPrompt()`)
   ```typescript
   const patternPrompt = patternId ? getPatternPrompt(patternId) : null;
   ```
   - If pattern-specific prompt exists, it's injected into the main prompt
   - If not, falls back to generic guidance from PatternFormatter

3. **Prompt Injection**
   - Generic fabric analysis and role assignment comes first
   - Pattern-specific guidance is injected as additional context
   - Claude sees both generic principles AND pattern-specific tips

## Example: Churn Dash

### Generic Guidance (applies to all patterns):
```
**STEP 1: ANALYZE EACH FABRIC**
- Identify type, value, print scale
- Use "squint test" for value
- Assess contrast potential

**STEP 2: ASSIGN FABRIC ROLES**
- Background: Light value, recedes
- Primary: Strong contrast to background
- Secondary: Coordinates with primary
- Accent: Optional pop of color
```

### Pattern-Specific Guidance (Churn Dash only):
```
**PATTERN-SPECIFIC GUIDANCE FOR CHURN DASH:**

For Churn Dash specifically:
- BACKGROUND: Best in corner half-square triangles (alternating with accent)
- PRIMARY: Works well as the four "dash" rectangles - most prominent feature
- SECONDARY/ACCENT: Best in center square and alternating corner triangles

Churn Dash cutting specifics:
- Cut squares for the center
- Cut rectangles for the four "dashes"
- Cut squares then slice diagonally for HSTs in corners
- Traditional Churn Dash uses high contrast between dashes and background

Assembly tips:
- Piece the HSTs first for the corners
- Arrange in 3x3 grid: corner HSTs, side dashes, center square
- Press seams toward darker fabric
- The "churning" effect comes from diagonal splits in corners

Avoid these mistakes:
- Using solid squares in corners instead of HSTs (makes it a nine-patch)
- Using four-patch units in corners (too complex, not traditional)
- Not enough contrast between dashes and background
```

## Migration Path

### Phase 1: ✅ COMPLETE
- Created infrastructure (prompts directory, interface, registry)
- Updated promptBuilder.ts to support pattern-specific prompts
- Updated claudeService.ts to pass patternId
- Created stub files for all 25 patterns
- Completed 2 example patterns (Churn Dash, Simple Squares)

### Phase 2: TODO
- Fill in pattern-specific prompts for remaining 23 patterns
- Test each pattern with pattern-specific guidance
- Refine prompts based on actual generation results

### Phase 3: TODO (Future Enhancement)
- Add visual examples/diagrams to prompts
- Add common fabric combinations that work well
- Add tips for specific fabric types (novelty prints, directional prints, etc.)

## Adding a New Pattern Prompt

1. Open the stub file: `backend/src/config/prompts/[pattern-id].prompt.ts`

2. Replace TODO placeholders with pattern-specific content:
   ```typescript
   export const PATTERN_NAME_PROMPT = {
     patternName: 'Pattern Name',
     
     characteristics: `
   - Describe the block structure
   - Note key geometric elements
   - Distinguish from similar patterns
     `,

     fabricRoleGuidance: `For [Pattern Name] specifically:
   - BACKGROUND: Where it works best in this pattern
   - PRIMARY: Where it's most visible in this pattern
   - SECONDARY/ACCENT: Where these work well
     `,

     cuttingInstructions: `[Pattern Name] cutting specifics:
   - List required shapes
   - Note any special cutting considerations
   - Mention traditional sizing
     `,

     assemblyNotes: `Assembly tips for [Pattern Name]:
   - Note piecing order
   - Pressing directions
   - What creates the signature look
     `,

     commonMistakes: `Avoid these [Pattern Name] mistakes:
   - List common errors
   - Note pattern confusion with similar blocks
   - Mention contrast requirements
     `
   };
   ```

3. The system will automatically use your prompt (no additional wiring needed)

## Testing

To verify a pattern-specific prompt is working:
1. Generate a pattern with that specific pattern selected
2. Check the console logs for "Pattern ID: [your-pattern-id]"
3. Review the generated instructions for pattern-specific guidance
4. Verify the SVG matches the pattern description

## Benefits

1. **Accuracy**: Pattern-specific guidance prevents common mistakes (e.g., Churn Dash vs Nine Patch confusion)
2. **Quality**: Better instructions tailored to each pattern's unique requirements
3. **Maintainability**: Easy to update one pattern without affecting others
4. **Scalability**: New patterns can be added by creating one new file
5. **Fallback**: Patterns without specific prompts still work with generic guidance
