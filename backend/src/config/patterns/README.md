# Quilt Pattern Registry

This directory contains all quilt pattern definitions for QuiltPlannerPro. Each pattern is a self-contained module that defines the pattern's structure, fabric requirements, and generation logic.

## Pattern Structure

Each pattern lives in its own directory with the following files:

```
pattern-name/
├── index.ts              # Pattern definition (required)
├── prompt.ts             # AI generation prompt (required)
├── plan.ts               # Instruction plan (optional)
└── renderInstructions.ts # Custom rendering logic (optional)
```

## Pattern Definition Example

```typescript
import type { PatternDefinition } from '../../../types/PatternDefinition';

const SimpleSquares: PatternDefinition = {
  // Core Identity
  id: 'simple-squares',
  name: 'Simple Squares',
  
  // Status & Availability
  patternStatus: 'ready',  // 'ready' | 'in-progress' | 'planned'
  enabled: true,            // Set to false for patterns under development
  
  // Fabric Requirements
  minFabrics: 2,
  maxFabrics: 8,
  fabricRoles: [
    'Fabric 1 (Primary)',
    'Fabric 2 (Secondary)',
    'Fabric 3 (Accent)',
    // ... up to maxFabrics
  ],
  
  // Visual Template (SVG)
  template: `<svg viewBox="0 0 100 100">
    <rect x="0" y="0" width="50" height="50" fill="{{color1}}" />
    <rect x="50" y="0" width="50" height="50" fill="{{color2}}" />
  </svg>`,
  
  // AI Generation Prompt
  prompt: simpleSquaresPrompt,
  
  // Fabric Color Assignment Logic
  getColors: (fabricColors: string[], opts?: { blockIndex?: number }) => {
    const blockIndex = opts?.blockIndex ?? 0;
    // Rotate through all fabrics for variety
    return [
      fabricColors[blockIndex % fabricColors.length],
      fabricColors[(blockIndex + 1) % fabricColors.length]
    ];
  },
  
  // Rotation Strategy
  allowRotation: true,
  rotationStrategy: 'random'  // 'none' | 'random' | 'alternate-90' | 'alternate-180' | 'parity-2x2'
};

export default SimpleSquares;
```

## Pattern Status Field

The `patternStatus` field indicates the pattern's development state:

### `'ready'` - Production Ready
Pattern is fully tested, documented, and available to users.

**Example:**
```typescript
patternStatus: 'ready',
enabled: true,
```

**Patterns in this state:** simple-squares, strip-quilt, nine-patch, four-patch, etc. (21 patterns)

### `'in-progress'` - Under Development
Pattern is functional but needs refinement, testing, or additional work.

**Example:**
```typescript
patternStatus: 'in-progress',
enabled: false,  // Disabled until ready
// TODO: Complete template arc rendering logic
// TODO: Test with 4-6 fabric combinations
// TODO: Add assembly diagram to prompt
```

**Patterns in this state:** mariners-compass, storm-at-sea, double-wedding-ring, pickle-dish, complex-medallion

### `'planned'` - Not Yet Implemented
Pattern is designed but not yet coded.

**Example:**
```typescript
patternStatus: 'planned',
enabled: false,
// TODO: Implement curved piecing template
// TODO: Create AI prompt for corner fan guidance
// TODO: Design 8-color fan component mapping
```

**Patterns in this state:** new-york-beauty

## Rotation Strategies

### `'none'` - No Rotation
Used for patterns that must maintain orientation (stars, medallions, curved patterns).

**Example:**
```typescript
allowRotation: false,
rotationStrategy: 'none',
// Used by: ohio-star, lone-star, mariners-compass (13 patterns)
```

### `'random'` - Random Rotation
Creates scrappy, varied appearance.

**Example:**
```typescript
allowRotation: true,
rotationStrategy: 'random',
// Used by: simple-squares, half-square-triangles, bow-tie (4 patterns)
```

### `'alternate-90'` - 90° Alternating Pattern
Creates pinwheel or zigzag effects.

**Example:**
```typescript
allowRotation: true,
rotationStrategy: 'alternate-90',
// Used by: pinwheel, rail-fence, churn-dash (4 patterns)
```

### `'alternate-180'` - 180° Flip Pattern
Traditional nine-patch or hourglass tiling.

**Example:**
```typescript
allowRotation: true,
rotationStrategy: 'alternate-180',
// Used by: nine-patch, hourglass (2 patterns)
```

### `'parity-2x2'` - Position-Based Pattern
Deterministic pattern based on block position.

**Example:**
```typescript
allowRotation: true,
rotationStrategy: 'parity-2x2',
// Used by: flying-geese, drunkards-path, storm-at-sea (3 patterns)
```

## Fabric Color Assignment Patterns

### Pattern 1: Background + Rotating Accent
Keeps background consistent, rotates accent colors for variety.

**Example:**
```typescript
getColors: (fabricColors, opts) => {
  const blockIndex = opts?.blockIndex ?? 0;
  const background = fabricColors[0];
  const primary = fabricColors[1] || background;
  
  if (fabricColors.length < 3) {
    return [background, primary];
  }
  
  const accents = fabricColors.slice(1);
  const accent = accents[blockIndex % accents.length];
  return [background, accent];
}
```

**Used by:** half-square-triangles, hourglass, nine-patch, flying-geese

### Pattern 2: Fixed Mapping with Fallbacks
Maps specific fabric slots with graceful fallbacks.

**Example:**
```typescript
getColors: (fabricColors) => {
  const background = fabricColors[0];
  const primary = fabricColors[1] || background;
  const secondary = fabricColors[2] || primary;
  const accent = fabricColors[3] || secondary;
  
  return [background, primary, secondary];
}
```

**Used by:** sawtooth-star, ohio-star, kaleidoscope-star, churn-dash

### Pattern 3: Position-Based Alternation
Uses block position to determine colors (checkerboard effect).

**Example:**
```typescript
getColors: (fabricColors, opts) => {
  const row = opts?.row ?? 0;
  const col = opts?.col ?? 0;
  const parity = (row + col) % 2;
  
  return parity === 0 
    ? [fabricColors[0], fabricColors[1]] 
    : [fabricColors[1], fabricColors[0]];
}
```

**Used by:** checkerboard, drunkards-path

## Disabled Patterns Documentation

### Why Patterns Are Disabled

Patterns are disabled (`enabled: false`) when they:
1. **Need template work** - SVG rendering logic incomplete
2. **Require testing** - Untested with full fabric range
3. **Have prompt gaps** - Assembly instructions need detail
4. **Await curved piecing** - Complex geometry not yet implemented

### Mariners Compass
```typescript
patternStatus: 'in-progress',
enabled: false,
// REASON: Requires precise radial geometry for compass points
// WORK NEEDED:
// - Complete 32-point radial SVG template
// - Test 4-6 fabric combinations for color clarity
// - Add foundation paper piecing instructions to prompt
// TIMELINE: Q3 2026
```

### Storm at Sea
```typescript
patternStatus: 'in-progress',
enabled: false,
// REASON: Optical illusion requires precise block alignment
// WORK NEEDED:
// - Validate parity-2x2 rotation creates wave effect
// - Test with 2-3 fabric contrast levels
// - Add diagonal seam pressing guidance to prompt
// TIMELINE: Q3 2026
```

### Double Wedding Ring
```typescript
patternStatus: 'in-progress',
enabled: false,
// REASON: Curved piecing with interlocking rings is complex
// WORK NEEDED:
// - Implement curved arc template rendering
// - Design ring intersection logic
// - Create specialized PDF rendering for curves
// - Add curved piecing technique guide to prompt
// TIMELINE: Q4 2026
```

### Pickle Dish
```typescript
patternStatus: 'in-progress',
enabled: false,
// REASON: Similar curved arc challenges to Double Wedding Ring
// WORK NEEDED:
// - Implement arc template with 6-color ring system
// - Test background/ring contrast visibility
// - Add arc appliqué alternative to prompt
// TIMELINE: Q4 2026
```

### Complex Medallion
```typescript
patternStatus: 'in-progress',
enabled: false,
// REASON: Dynamic border system needs refinement
// WORK NEEDED:
// - Validate 4-8 fabric border color progression
// - Test radiating medallion symmetry
// - Add border width calculation logic
// - Expand prompt with border planning guidance
// TIMELINE: Q4 2026
```

## Adding a New Pattern

1. **Create directory:**
   ```bash
   mkdir backend/src/config/patterns/my-pattern
   ```

2. **Create index.ts:**
   ```typescript
   import type { PatternDefinition } from '../../../types/PatternDefinition';
   import { myPatternPrompt } from '../../prompts/my-pattern.prompt';
   
   const MyPattern: PatternDefinition = {
     id: 'my-pattern',
     name: 'My Pattern',
     patternStatus: 'in-progress',
     enabled: false,  // Start disabled until tested
     minFabrics: 2,
     maxFabrics: 4,
     fabricRoles: ['Background', 'Main', 'Accent'],
     template: `<svg>...</svg>`,
     prompt: myPatternPrompt,
     getColors: (fabricColors) => [...],
     allowRotation: true,
     rotationStrategy: 'random'
   };
   
   export default MyPattern;
   ```

3. **Create prompt file:**
   ```bash
   # Create backend/src/config/prompts/my-pattern.prompt.ts
   ```

4. **Register in index.ts:**
   ```typescript
   // In patterns/index.ts
   import MyPattern from './my-pattern';
   
   const patterns: Record<string, PatternDefinition> = {
     // ... existing patterns
     'my-pattern': MyPattern,
   };
   ```

5. **Test thoroughly before enabling:**
   - Generate pattern with min/max fabric counts
   - Verify PDF rendering
   - Test rotation strategy
   - Validate AI prompt completeness
   - Check fabric color assignments

6. **Mark as ready:**
   ```typescript
   patternStatus: 'ready',
   enabled: true,
   ```

## Pattern Registry Statistics

- **Total patterns:** 26
- **Production-ready:** 21 (80.8%)
- **In development:** 5 (19.2%)
- **Planned:** 1 (3.8%)

## Maintenance Guidelines

### When Updating Patterns

1. **Always test with:**
   - Minimum fabric count
   - Maximum fabric count
   - Mid-range fabric count (if applicable)

2. **Update related files:**
   - Pattern definition (index.ts)
   - Prompt file (prompt.ts)
   - Type definitions if structure changes
   - This README if adding new conventions

3. **Status transitions:**
   ```
   planned → in-progress → ready
   ```
   
4. **Never break:**
   - Existing pattern IDs (breaks saved patterns)
   - Public API contracts
   - Type definitions without migration plan

### Code Review Checklist

- [ ] Pattern has `patternStatus` field
- [ ] `enabled` matches status (false for non-ready patterns)
- [ ] minFabrics ≤ maxFabrics
- [ ] fabricRoles array length matches maxFabrics
- [ ] getColors() handles all fabric counts in range
- [ ] Rotation strategy appropriate for pattern type
- [ ] Template has proper color placeholder syntax
- [ ] Prompt file is complete and detailed
- [ ] TypeScript types all valid
- [ ] No console.log statements in production code

## Resources

- **Type Definitions:** [PatternDefinition.ts](../../../types/PatternDefinition.ts)
- **Prompt Guidelines:** [prompts/README.md](../../prompts/README.md)
- **Fabric Mapping Utils:** [utils/fabricMapping.ts](../../../utils/fabricMapping.ts)
- **Pattern Validators:** [validators/patternValidators.ts](../../../validators/patternValidators.ts)

## Questions?

See [QuiltPlannerPro Documentation](../../../../README.md) or contact the development team.
