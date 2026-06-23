# Pattern Prompt Generator

## Overview

The pattern prompt generator reduces boilerplate when creating new pattern prompts. All 26 quilt patterns now have consistent, well-structured prompts using a standardized template.

## Quick Start

To create a new pattern prompt, use the `createPatternPrompt()` factory function:

```typescript
// backend/src/config/patterns/my-pattern/prompt.ts

import { createPatternPrompt } from '../promptGenerator';
import type { PatternPrompt } from '../../../types/PatternPrompt';

export const MY_PATTERN_PROMPT: PatternPrompt = createPatternPrompt({
  patternName: 'My Pattern',
  recommendedFabricCount: 4,
  
  characteristics: `
    Multi-paragraph description of:
    - Pattern structure (grid size, piecing units)
    - Visual characteristics (what makes it unique)
    - Skill level required
    - Sewing time estimate
  `,
  
  fabricRoleGuidance: `
    Detailed guidance on fabric role assignment:
    - Include examples for 2, 3, 4, and 5-fabric quilts
    - Explain color rotation strategies
    - Describe visual effect of different arrangements
    - Format: "WITH 2 FABRICS:", "WITH 3 FABRICS:", etc.
  `,
  
  cuttingInstructions: `
    Precise cutting specifications:
    - Piece dimensions (squares, rectangles, triangles)
    - Quantities for each fabric
    - Seam allowance guidance (typically 1/4")
    - Any special cutting methods
  `,
  
  assemblyNotes: `
    Step-by-step assembly process:
    - Block construction sequence
    - Pressing directions
    - How blocks connect when tiled
    - Nested seam locations
    - Efficiency tips
  `,
  
  commonMistakes: `
    Common errors and how to avoid them:
    - Inconsistent seam allowances
    - Pressing issues
    - Layout mistakes
    - Value/color placement errors
  `,
});
```

## Required Fields

All 7 fields must be present:

1. **patternName** (string) - Human-readable, title-cased name
2. **recommendedFabricCount** (number | range) - Fixed count or `{ min: 2, max: 6 }`
3. **characteristics** - Pattern structure and visual effect
4. **fabricRoleGuidance** - How to assign fabrics to roles
5. **cuttingInstructions** - What to cut and dimensions
6. **assemblyNotes** - Step-by-step assembly process
7. **commonMistakes** - Errors to avoid and prevention tips

## Field Guidelines

### characteristics (4-6 paragraphs)
```
- Grid structure: "3×3 grid", "16-patch", etc.
- Piecing units: "half-square triangles", "squares", etc.
- Visual effect: "creates diagonal movement", "optical illusion", etc.
- Skill level: "Beginner", "Intermediate", "Advanced"
- Sewing time: "8-12 hours", "10-14 hours", etc.
```

### fabricRoleGuidance (10-15 paragraphs)
```
WITH 2 FABRICS:
- BACKGROUND (fabricColors[0]): description
- PRIMARY (fabricColors[1]): description

WITH 3 FABRICS:
- BACKGROUND (fabricColors[0]): description
- PRIMARY (fabricColors[1]): description
- SECONDARY (fabricColors[2]): description

[Include sections for 4-fabric and 5-fabric if applicable]
```

### cuttingInstructions (8-12 paragraphs)
```
- List all piece types (squares, half-square triangles, etc.)
- Include dimensions with seam allowance
- Specify quantities per fabric role
- Mention any special cutting methods
```

### assemblyNotes (8-12 paragraphs)
```
1. Row assembly (e.g., "Sew squares into 3 rows of 3")
2. Pressing directions (usually "toward darker fabric")
3. Row joining (e.g., "Sew rows together, nesting seams")
4. Final pressing
5. Optional: nested seam locations for accuracy
6. Optional: efficiency tips (chain piecing, etc.)
```

### commonMistakes (6-8 paragraphs)
```
- Inconsistent seam allowances
- Pressing in wrong direction
- Not squaring up blocks
- Color placement errors
- Value (light/medium/dark) placement issues
```

## Example

See [four-patch/prompt.ts](four-patch/prompt.ts) for a complete example of a well-structured pattern prompt.

## Registering Your Pattern

After creating the prompt file:

1. **Import** in `backend/src/config/prompts/index.ts`:
   ```typescript
   import { MY_PATTERN_PROMPT } from '../patterns/my-pattern/prompt';
   ```

2. **Add to PATTERN_PROMPTS registry** in the same file:
   ```typescript
   export const PATTERN_PROMPTS: Record<string, PatternPrompt> = {
     // ... existing patterns ...
     'my-pattern': MY_PATTERN_PROMPT,
   };
   ```

3. **Test** - Run `npm test` to verify no import errors

## Type Safety

The `createPatternPrompt()` factory ensures all required fields are present and properly typed. TypeScript will catch missing or incorrectly typed fields at compile time.

## Consistency

All 26 patterns now use this consistent structure, making it easy for AI (Claude) to understand and process pattern specifications consistently.
