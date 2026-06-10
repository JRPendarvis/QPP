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

## Complete Working Examples

### Example 1: Simple Squares Pattern

**File:** `simple-squares.prompt.ts`

```typescript
export const SIMPLE_SQUARES_PROMPT = {
  patternName: 'Simple Squares',
  
  characteristics: `Simple Squares is a beginner-friendly pattern featuring:
- Square blocks arranged in a grid
- No complex piecing (straight seams only)
- Perfect for showcasing large-scale prints
- Works well with 2-8 different fabrics
- Creates visual interest through fabric variety and rotation`,

  fabricRoleGuidance: `For Simple Squares specifically:
- PRIMARY: Most prominent fabric, appears frequently
- SECONDARY: Coordinates with primary, provides contrast
- ACCENT fabrics (3+): Add variety and visual texture
- All fabrics share equal importance (no true "background")
- Consider alternating light/dark for high contrast
- Or use all mediums for a scrappy, blended look`,

  cuttingInstructions: `Simple Squares cutting specifics:
- Cut all squares the same size (typically 8.5" for 8" finished)
- No templates needed - rotary cutter and ruler only
- Can cut multiple layers at once for efficiency
- Traditional sizes: 6", 8", 10", or 12" finished
- Larger squares showcase fabrics better
- Add 0.5" to finished size for seam allowances`,

  assemblyNotes: `Assembly tips for Simple Squares:
- Arrange squares in desired layout before sewing
- Chain piece for efficiency (sew multiple units without cutting thread)
- Press seams in alternating directions by row (nesting seams)
- Use 1/4" seam allowance consistently
- Random rotation creates scrappy appearance
- Press final quilt top before basting
- Consider sashing between squares for definition`,

  commonMistakes: `Avoid these Simple Squares mistakes:
- Cutting squares inconsistent sizes (measure twice!)
- Not pressing seams (leads to puckering)
- Using fabrics that are too similar (low contrast = boring)
- Overlooking print scale (all large prints can clash)
- Neglecting fabric direction (directional prints)
- Rushing layout - take time to arrange colors well`
};
```

**Why this works:**
- ✅ Explains pattern structure clearly
- ✅ Provides fabric role guidance specific to this pattern
- ✅ Includes traditional sizing conventions
- ✅ Notes beginner-friendly aspects
- ✅ Addresses common pitfalls

---

### Example 2: Ohio Star Pattern

**File:** `ohio-star.prompt.ts`

```typescript
export const OHIO_STAR_PROMPT = {
  patternName: 'Ohio Star',
  
  characteristics: `Ohio Star is an intermediate-level pattern featuring:
- Eight-pointed star radiating from center
- Center square as star focal point
- Four corner squares (typically background)
- Four star point units (quarter-square triangles)
- Four side rectangles connecting points
- Requires precision piecing for sharp star points
- Total pieces per block: 9 (arranged in 3x3 grid)`,

  fabricRoleGuidance: `For Ohio Star specifically:
- BACKGROUND: Essential in corners (4 squares) and side rectangles (4)
  * Should be low-volume or solid for star to "pop"
  * Light value traditionally, but dark works for inverse effect
- PRIMARY (Star): Used in center square and all 8 star points
  * High contrast with background is critical
  * Can use single fabric or coordinating prints
- ACCENT: Optional - can replace center square for variety
  * Creates "eye" in center of star
  * Use sparingly (1-2 blocks in multi-block quilt)`,

  cuttingInstructions: `Ohio Star cutting specifics:
**For 12" finished block:**
- Background: Cut 4 corner squares (4.5" x 4.5")
- Background: Cut 8 rectangles for side units (2.5" x 4.5")
- Star fabric: Cut 1 center square (4.5" x 4.5")
- Star fabric: Cut 8 triangles for points
  * Method 1: Cut 4 squares (4.875"), slice diagonally twice (QST method)
  * Method 2: Cut 8 triangles from template
- Add 0.25" seam allowance if not included above

**Tip:** Use quarter-square triangle (QST) technique for accurate points`,

  assemblyNotes: `Assembly tips for Ohio Star:
1. **Create star point units first:**
   - Piece 4 quarter-square triangle units
   - Each has 4 triangles: 2 background, 2 star
   - Press toward darker fabric
   - Trim to 4.5" square (for 12" block)

2. **Layout in 3x3 grid:**
   ```
   [BG] [Side] [BG]
   [Side] [Center] [Side]
   [BG] [Side] [BG]
   ```
   Where:
   - BG = background corner square
   - Side = star point unit (triangles)
   - Center = star center square

3. **Piece rows:**
   - Row 1: BG + Side + BG
   - Row 2: Side + Center + Side
   - Row 3: BG + Side + BG
   - Press seams away from center

4. **Join rows:**
   - Match seam intersections carefully
   - Pin at star points for accuracy
   - Press row seams toward top or bottom

**Critical:** Star points must align at center for clean appearance`,

  commonMistakes: `Avoid these Ohio Star mistakes:
- **Blunt star points:** QST units cut too small or seams too wide
  * Solution: Use scant 1/4" seam, trim units to exact size
- **Low contrast:** Star blends into background
  * Solution: Use value contrast (dark star + light BG or vice versa)
- **Confusion with Sawtooth Star:** Ohio Star uses QSTs, Sawtooth uses HSTs
  * Ohio Star has 4 triangles per point unit (more complex)
  * Sawtooth Star has 2 triangles per point unit (simpler)
- **Twisted star points:** QST units sewn in wrong orientation
  * Solution: Lay out all units before sewing, check orientation
- **Wavy blocks:** Stretching bias edges of triangles
  * Solution: Handle triangles gently, use starch, press carefully`
};
```

**Why this works:**
- ✅ Distinguishes from similar patterns (Sawtooth Star)
- ✅ Provides exact cutting measurements with context
- ✅ Includes visual layout diagram in ASCII
- ✅ Explains QST technique clearly
- ✅ Addresses precision piecing requirements
- ✅ Notes common confusion with similar patterns

---

### Example 3: Flying Geese Pattern

**File:** `flying-geese.prompt.ts`

```typescript
export const FLYING_GEESE_PROMPT = {
  patternName: 'Flying Geese',
  
  characteristics: `Flying Geese is a classic pattern featuring:
- Rectangle with center triangle (goose) flanked by two corner triangles (sky)
- Ratio: 2:1 (width is twice the height)
- Creates directional movement across quilt
- Can be arranged in rows, zigzags, or radiating patterns
- Works well with 2-4 fabrics minimum
- Intermediate difficulty (bias edge handling)`,

  fabricRoleGuidance: `For Flying Geese specifically:
- BACKGROUND (Sky): The two corner triangles
  * Typically light value to make geese "fly"
  * Can use single fabric for all sky triangles (cohesive)
  * Or vary sky fabric for scrappy look
- PRIMARY (Geese): The center triangle pointing up/down
  * Should contrast well with background
  * Can rotate through multiple fabrics for variety
  * Consider directional prints pointing in flight direction
- ACCENT: Optional for geese rotation or special blocks
  * Use sparingly for visual interest`,

  cuttingInstructions: `Flying Geese cutting specifics:
**Traditional Method (for 4" x 2" finished unit):**
- Goose: Cut 1 rectangle (4.5" x 2.5")
- Sky: Cut 2 squares (2.5" x 2.5")
- Draw diagonal line on wrong side of sky squares
- Place sky squares on goose rectangle corners
- Sew on diagonal line, trim, press

**Four-at-Once Method (efficient for many units):**
- Goose: Cut 1 square (5.25" x 5.25")
- Sky: Cut 4 squares (2.875" x 2.875")
- Produces 4 matching Flying Geese units
- Reduces fabric waste significantly

**No-Waste Method (most economical):**
- Requires foundation paper or specialized ruler
- Creates perfect units with no trimming
- Best for large quantities`,

  assemblyNotes: `Assembly tips for Flying Geese:
1. **Using Traditional Method:**
   - Mark diagonal line on sky squares
   - Place sky square on goose rectangle corner, right sides together
   - Sew on marked line
   - Trim 1/4" from seam
   - Press toward sky triangle
   - Repeat for second corner
   - Unit should measure 4.5" x 2.5" (unfinished)

2. **Unit Arrangement:**
   - Geese can point up, down, left, or right
   - Common arrangements:
     * Rows (all pointing same direction)
     * Zigzag (alternating up/down)
     * Radiating (from center outward)
     * Chevron (V-pattern)
   - Decide arrangement BEFORE assembly

3. **Pressing Strategy:**
   - Press toward sky triangles (away from goose)
   - Creates nested seams when joining units
   - Reduces bulk at seam intersections

4. **Joining Units:**
   - Match triangle points carefully
   - Use pins at point intersections
   - Maintain consistent 1/4" seam allowance
   - Press row seams in alternating directions`,

  commonMistakes: `Avoid these Flying Geese mistakes:
- **Wrong goose/sky ratio:** Not 2:1 (looks stubby or stretched)
  * Solution: Use templates or pre-calculated sizes
- **Blunt goose points:** Seam allowance too wide or trimming uneven
  * Solution: Use scant 1/4" seam, trim carefully with ruler
- **Bias stretch:** Handling goose triangle edges stretches them
  * Solution: Use starch, handle gently, press don't iron
- **Sky triangles sewn backwards:** Creates mirror image
  * Solution: Double-check orientation before sewing
- **Inconsistent sizes:** Units don't match when joining
  * Solution: Measure first unit, adjust if needed, be consistent
- **Low contrast:** Geese disappear into sky
  * Solution: Use strong value contrast (light sky, dark geese)
- **Forgetting seam direction:** Creates wavy rows
  * Solution: Map out pressing plan before starting`
};
```

**Why this works:**
- ✅ Explains 2:1 ratio (critical geometric constraint)
- ✅ Provides multiple cutting methods (traditional, efficient, no-waste)
- ✅ Shows various arrangement patterns
- ✅ Details pressing strategy for nested seams
- ✅ Warns about bias edge handling
- ✅ Addresses sizing consistency issues

---

## Best Practices for Writing Prompts

### 1. Be Pattern-Specific
❌ **Generic:** "Use contrast between fabrics"  
✅ **Specific:** "Ohio Star requires high contrast between star fabric and background corners for points to pop"

### 2. Include Measurements with Context
❌ **Vague:** "Cut squares for the corners"  
✅ **Specific:** "Cut 4 corner squares (4.5" x 4.5" for 12" finished block, includes seam allowance)"

### 3. Distinguish from Similar Patterns
❌ **Unclear:** "This is a star pattern"  
✅ **Clear:** "Ohio Star uses quarter-square triangles (4 triangles per unit) unlike Sawtooth Star which uses half-square triangles (2 triangles per unit)"

### 4. Address Common Mistakes
❌ **Generic:** "Be careful when cutting"  
✅ **Specific:** "Blunt star points occur when QST units are cut too small - trim units to exact 4.5" after piecing"

### 5. Provide Visual Context
Use ASCII diagrams when helpful:
```
[BG] [Point] [BG]
[Point] [★] [Point]
[BG] [Point] [BG]
```

### 6. Include Traditional Context
✅ "Traditional Ohio Star blocks are 12" finished"  
✅ "Historically made in red and white for patriotic quilts"

### 7. Note Skill Level Indicators
- Beginner: "Straight seams only, no triangles"
- Intermediate: "Requires bias edge handling and precision piecing"
- Advanced: "Curved piecing and foundation paper piecing recommended"

---

## Prompt Quality Checklist

Before considering a prompt complete:

- [ ] **Pattern Identity**
  - [ ] Pattern name clearly stated
  - [ ] Key characteristics listed
  - [ ] Distinguished from similar patterns
  
- [ ] **Fabric Guidance**
  - [ ] Role for each fabric explained
  - [ ] Contrast requirements specified
  - [ ] Optional vs required fabrics noted
  
- [ ] **Cutting Instructions**
  - [ ] Measurements provided (with finished size context)
  - [ ] Seam allowances clarified
  - [ ] Multiple methods offered (if applicable)
  - [ ] Traditional sizes referenced
  
- [ ] **Assembly Notes**
  - [ ] Step-by-step sequence provided
  - [ ] Pressing directions specified
  - [ ] Critical alignment points noted
  - [ ] Layout diagram included (if helpful)
  
- [ ] **Common Mistakes**
  - [ ] Pattern-specific pitfalls listed
  - [ ] Solutions provided for each
  - [ ] Geometric issues explained
  - [ ] Contrast mistakes addressed

---

## Benefits

1. **Accuracy**: Pattern-specific guidance prevents common mistakes (e.g., Churn Dash vs Nine Patch confusion)
2. **Quality**: Better instructions tailored to each pattern's unique requirements
3. **Maintainability**: Easy to update one pattern without affecting others
4. **Scalability**: New patterns can be added by creating one new file
5. **Fallback**: Patterns without specific prompts still work with generic guidance
6. **Learning**: Quilters get educational content specific to their chosen pattern
7. **AI Performance**: More context = better Claude output quality
