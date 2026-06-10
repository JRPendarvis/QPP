# Disabled Patterns - Development Tracking

This document tracks patterns that are currently disabled and the work required to enable them for production use.

## Overview

**Total Disabled:** 5 patterns  
**Last Updated:** 2026-06-09

| Pattern | Status | Complexity | Target Date |
|---------|--------|------------|-------------|
| mariners-compass | in-progress | High | Q3 2026 |
| storm-at-sea | in-progress | Medium | Q3 2026 |
| double-wedding-ring | in-progress | Very High | Q4 2026 |
| pickle-dish | in-progress | High | Q4 2026 |
| complex-medallion | in-progress | Medium | Q4 2026 |

---

## 1. Mariners Compass

### Current Status
```typescript
patternStatus: 'in-progress',
enabled: false,
```

### Why Disabled
The Mariners Compass pattern requires precise radial geometry with 16-32 compass points radiating from a center circle. Current template implementation needs refinement for:
- Accurate point angles (must be mathematically precise)
- Point tip sharpness (foundation piecing requirement)
- Center circle proportions
- Color slot mapping for 4-6 fabrics across alternating points

### Technical Challenges

**1. SVG Radial Geometry**
```typescript
// Current issue: Manual path calculations for 16+ compass points
// Solution needed: Parameterized arc generation function

const generateCompassPoint = (
  angle: number,
  innerRadius: number,
  outerRadius: number
): string => {
  // Calculate SVG path for one compass point
  const startX = centerX + innerRadius * Math.cos(angle);
  const startY = centerY + innerRadius * Math.sin(angle);
  // ... more calculations needed
};
```

**2. Color Distribution**
```typescript
// Need to test these fabric count scenarios:
// 4 fabrics: background, primary points, secondary points, center
// 5 fabrics: + accent for every 4th point
// 6 fabrics: + two alternating point colors
```

### Work Required

#### Template Development (8-12 hours)
- [ ] Create parameterized compass point generator
- [ ] Implement 16-point version (intermediate)
- [ ] Implement 32-point version (advanced)
- [ ] Test with various center circle sizes
- [ ] Validate point tip precision

#### Prompt Enhancement (2-3 hours)
- [ ] Add foundation paper piecing instructions
- [ ] Include point assembly order diagram
- [ ] Document pressing techniques for sharp points
- [ ] Add color placement visual guide
- [ ] List common mistakes (stretched points, off-center circle)

#### Testing (4-6 hours)
- [ ] Generate with 4 fabrics (minimum contrast)
- [ ] Generate with 5 fabrics (accent addition)
- [ ] Generate with 6 fabrics (maximum variety)
- [ ] PDF rendering verification
- [ ] Instruction clarity review with quilters

### Example Usage (When Enabled)
```typescript
// User selects 5 fabrics:
// 1. Navy (background)
// 2. Red (primary points)
// 3. White (secondary points)
// 4. Gold (center circle)
// 5. Blue (accent every 4th point)

getColors: (fabricColors) => {
  const background = fabricColors[0];
  const primary = fabricColors[1] || background;
  const secondary = fabricColors[2] || primary;
  const center = fabricColors[3] || secondary;
  const accent = fabricColors[4] || primary;
  
  return {
    background,
    primaryPoints: primary,
    secondaryPoints: secondary,
    centerCircle: center,
    accentPoints: accent
  };
}
```

---

## 2. Storm at Sea

### Current Status
```typescript
patternStatus: 'in-progress',
enabled: false,
```

### Why Disabled
Storm at Sea creates an optical illusion of waves through precise block alignment using `parity-2x2` rotation. The pattern works, but needs validation that the illusion effect is visible across different fabric combinations.

### Technical Challenges

**1. Optical Illusion Dependency**
```typescript
// Pattern MUST use parity-2x2 or illusion breaks
rotationStrategy: 'parity-2x2',

// Need to validate wave effect appears with:
// - High contrast (2 fabrics: dark vs light)
// - Medium contrast (2-3 fabrics with variation)
// - Low contrast (illusion may be lost)
```

**2. Fabric Contrast Requirements**
```typescript
// Current getColors implementation:
getColors: (fabricColors) => {
  const wave = fabricColors[0];      // Needs to be dark
  const diamond = fabricColors[1];   // Needs to be light
  const accent1 = fabricColors[2] || wave;
  const accent2 = fabricColors[3] || diamond;
  
  return [wave, diamond, accent1, accent2];
}

// Problem: No contrast validation
// User could pick 4 similar blues → illusion lost
```

### Work Required

#### Contrast Validation (3-4 hours)
- [ ] Add fabric contrast analyzer utility
- [ ] Warn user if contrast too low
- [ ] Suggest fabric swaps for better illusion
- [ ] Test with grayscale conversion

#### Template Verification (2-3 hours)
- [ ] Generate 5x5 block grid to see full wave pattern
- [ ] Verify parity-2x2 creates continuous waves
- [ ] Test with different block arrangements
- [ ] Document minimum quilt size for effect

#### Prompt Enhancement (1-2 hours)
- [ ] Explain optical illusion requirement
- [ ] Add fabric selection guidance (contrast crucial)
- [ ] Include pressing direction for seam alignment
- [ ] Show wave pattern visualization

#### Testing (3-4 hours)
- [ ] High contrast test (navy + white)
- [ ] Medium contrast test (navy + cream + gray)
- [ ] Low contrast test (ensure warning triggers)
- [ ] Visual review with quilters

### Example Usage (When Enabled)
```typescript
// Good fabric selection (high contrast):
const fabrics = ['#001f3f', '#ffffff']; // Navy, White
// ✅ Wave illusion will be strong

// Problematic selection (low contrast):
const fabrics = ['#3d5a80', '#577590', '#6d8299']; // All similar blues
// ⚠️ System should warn: "Consider higher contrast for wave effect"
```

---

## 3. Double Wedding Ring

### Current Status
```typescript
patternStatus: 'in-progress',
enabled: false,
```

### Why Disabled
Double Wedding Ring features interlocking circular arcs, requiring curved piecing techniques that are not yet implemented in the SVG template system. This is one of quilting's most iconic but technically challenging patterns.

### Technical Challenges

**1. Curved Arc Rendering**
```typescript
// Need to implement bezier curves for rings
// Each ring intersects with 4 neighbors

const generateRingArc = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  // SVG path with quadratic or cubic bezier curves
  // Must calculate control points for smooth arcs
  // Challenge: Ring intersections must align perfectly
};
```

**2. Ring Intersection Logic**
```typescript
// Rings must interlock in a specific pattern
// Each ring has 4 "melon" shaped pieces
// Background "football" shapes fill gaps
// Total color slots per ring: 6
//   - 4 melon pieces (can be different fabrics)
//   - 1 ring center
//   - 1 background
```

**3. PDF Rendering for Curves**
```typescript
// Current PDF renderer assumes straight edges
// Need specialized curved piecing renderer:

class CurvedPiecingRenderer {
  renderArc(arc: ArcDefinition): PDFContent {
    // Convert SVG bezier to PDF arc commands
    // Add seam allowance to curves
    // Generate foundation piecing template option
  }
}
```

### Work Required

#### Template Development (16-24 hours)
- [ ] Research traditional Double Wedding Ring geometry
- [ ] Implement bezier curve generation for rings
- [ ] Calculate ring intersection points
- [ ] Create melon piece templates
- [ ] Generate background football shapes
- [ ] Test ring alignment across grid

#### PDF Specialized Renderer (12-16 hours)
- [ ] Create CurvedPiecingRenderer class
- [ ] Implement arc rendering with seam allowance
- [ ] Add foundation piecing template option
- [ ] Test PDF output with various ring sizes

#### Prompt Development (4-6 hours)
- [ ] Explain curved piecing technique
- [ ] Document melon piece assembly order
- [ ] Add ring intersection tips
- [ ] Include pressing techniques for curves
- [ ] List tools needed (walking foot, pins)
- [ ] Reference online tutorials for beginners

#### Testing (8-12 hours)
- [ ] Generate with 3 fabrics (minimum)
- [ ] Generate with 6 fabrics (maximum variety)
- [ ] Test ring alignment in 3x3 grid
- [ ] Verify PDF rendering quality
- [ ] Beta test with experienced quilters

### Example Usage (When Enabled)
```typescript
// 6-fabric Double Wedding Ring:
const fabrics = [
  '#f8f9fa', // Background (footballs)
  '#e63946', // Ring 1 melons
  '#f1faee', // Ring 2 melons
  '#a8dadc', // Ring 3 melons
  '#457b9d', // Ring 4 melons
  '#1d3557'  // Ring centers
];

getColors: (fabricColors, opts) => {
  const background = fabricColors[0];
  const melons = fabricColors.slice(1, 5).map((c, i) => 
    c || fabricColors[Math.max(1, i)]
  );
  const center = fabricColors[5] || melons[0];
  
  return { background, melons, center };
}
```

**Estimated Total Effort:** 40-58 hours (most complex pattern)

---

## 4. Pickle Dish

### Current Status
```typescript
patternStatus: 'in-progress',
enabled: false,
```

### Why Disabled
Similar to Double Wedding Ring, Pickle Dish requires curved arc rendering. Features concentric arcs radiating from block corners instead of interlocking rings.

### Technical Challenges

**1. Concentric Arc System**
```typescript
// 3-4 arcs radiating from each corner
// Each arc is a different fabric
// Background fills the center

const generatePickleDishArc = (
  corner: 'TL' | 'TR' | 'BL' | 'BR',
  arcNumber: number,
  totalArcs: number
): string => {
  const radius = calculateArcRadius(arcNumber, totalArcs);
  // Generate SVG arc path from corner
  // Must align with adjacent blocks
};
```

**2. Color Slot Mapping**
```typescript
// 4 fabrics: background + 3 arc rings
// 5 fabrics: + accent in center
// 6 fabrics: + alternating arcs pattern

getColors: (fabricColors) => {
  const background = fabricColors[0];
  const arc1 = fabricColors[1] || background;
  const arc2 = fabricColors[2] || arc1;
  const arc3 = fabricColors[3] || arc2;
  const arc4 = fabricColors[4] || arc3;
  const center = fabricColors[5] || background;
  
  return [background, arc1, arc2, arc3, arc4, center];
}
```

### Work Required

#### Template Development (10-14 hours)
- [ ] Implement concentric arc generation
- [ ] Calculate proper arc radii for 3-4 rings
- [ ] Ensure corner alignment across blocks
- [ ] Test with different block sizes
- [ ] Validate background fill shape

#### Leverage Double Wedding Ring Work (4-6 hours)
- [ ] Reuse curved piecing renderer
- [ ] Adapt arc rendering logic
- [ ] Test with Pickle Dish specific geometry

#### Prompt Development (2-3 hours)
- [ ] Document arc piecing technique
- [ ] Add corner alignment tips
- [ ] Include appliqué alternative (easier method)
- [ ] Show arc color progression examples

#### Testing (4-6 hours)
- [ ] Test 4-fabric version
- [ ] Test 6-fabric version
- [ ] Verify arc alignment
- [ ] PDF rendering verification

### Example Usage (When Enabled)
```typescript
// Traditional Pickle Dish (4 fabrics):
const fabrics = [
  '#ffffff', // White background
  '#c41e3a', // Outer arc (red)
  '#ffd700', // Middle arc (gold)
  '#228b22'  // Inner arc (green)
];

// Modern Pickle Dish (6 fabrics):
const fabrics = [
  '#2c3e50', // Dark background
  '#e74c3c', '#3498db', '#2ecc71', 
  '#f39c12', '#9b59b6'  // Rainbow arcs
];
```

**Estimated Total Effort:** 20-29 hours (can reuse some DWR work)

---

## 5. Complex Medallion

### Current Status
```typescript
patternStatus: 'in-progress',
enabled: false,
```

### Why Disabled
Complex Medallion features a center motif surrounded by 4-8 borders. The dynamic border system needs refinement to ensure balanced color progression and proper border width scaling.

### Technical Challenges

**1. Dynamic Border Count**
```typescript
// Must support 4-8 fabrics = 1 center + 3-7 borders
// Each border must be proportionally sized
// Inner borders smaller, outer borders larger

const calculateBorderWidths = (
  totalBorders: number,
  totalSize: number
): number[] => {
  // Generate array of border widths
  // Inner borders: 10-15% of total
  // Outer borders: 20-30% of total
  // Must sum to totalSize
};
```

**2. Color Progression Logic**
```typescript
// Need to validate visual flow:
// - Dark to light progression
// - Light to dark progression  
// - Alternating contrast
// - Rainbow spectrum

getColors: (fabricColors, opts) => {
  const center = fabricColors[0];
  const borders = fabricColors.slice(1).map((color, index) => ({
    color: color || fabricColors[Math.max(1, index)],
    width: calculateBorderWidths(fabricColors.length - 1)[index]
  }));
  
  return { center, borders };
}
```

**3. Template Flexibility**
```typescript
// Template must adapt to fabric count
// 4 fabrics: center + 3 borders
// 8 fabrics: center + 7 borders
// Need conditional rendering based on count
```

### Work Required

#### Border Width Algorithm (4-6 hours)
- [ ] Implement proportional border calculation
- [ ] Test with 4, 6, 8 fabric counts
- [ ] Validate visual balance
- [ ] Add border width constraints (min/max)

#### Template Dynamic Rendering (6-8 hours)
- [ ] Create conditional border rendering
- [ ] Test with various fabric counts
- [ ] Ensure center motif stays prominent
- [ ] Validate border alignment

#### Color Progression Analysis (3-4 hours)
- [ ] Test various color orderings
- [ ] Add progression suggestions to prompt
- [ ] Warn if progression seems random
- [ ] Show examples of effective progressions

#### Prompt Development (3-4 hours)
- [ ] Explain medallion design principles
- [ ] Add border planning guidance
- [ ] Include color progression examples
- [ ] Document border width planning
- [ ] Show historical medallion quilts

#### Testing (4-6 hours)
- [ ] Test minimum (4 fabrics)
- [ ] Test medium (6 fabrics)
- [ ] Test maximum (8 fabrics)
- [ ] Verify PDF rendering
- [ ] User feedback on border balance

### Example Usage (When Enabled)
```typescript
// Classic Medallion (6 fabrics):
const fabrics = [
  '#8b0000', // Center (dark red)
  '#ffffff', // Border 1 (white)
  '#c41e3a', // Border 2 (red)
  '#ffd700', // Border 3 (gold)
  '#000080', // Border 4 (navy)
  '#ffffff'  // Border 5 (white)
];

// Calculated border widths for balanced appearance:
const widths = [
  0.15, // Border 1: 15% of remaining space
  0.15, // Border 2: 15%
  0.20, // Border 3: 20%
  0.25, // Border 4: 25%
  0.25  // Border 5: 25%
];
```

**Estimated Total Effort:** 20-28 hours

---

## Development Roadmap

### Q3 2026 - Medium Priority Patterns

**Target: Enable 2 patterns**

#### Phase 1 (June-July): Storm at Sea
- Week 1-2: Contrast validation system
- Week 3: Template verification
- Week 4: Testing & documentation
- **Goal:** Enable by July 31

#### Phase 2 (August-September): Mariners Compass
- Week 1-3: Radial geometry implementation
- Week 4-5: Foundation piecing prompt
- Week 6: Testing with quilters
- **Goal:** Enable by September 30

### Q4 2026 - High Complexity Patterns

**Target: Enable 3 patterns**

#### Phase 3 (October): Complex Medallion
- Week 1-2: Border width algorithm
- Week 3: Template dynamic rendering
- Week 4: Testing
- **Goal:** Enable by October 31

#### Phase 4 (November-December): Curved Piecing
- Week 1-4: Double Wedding Ring template & renderer
- Week 5-6: Pickle Dish (reusing DWR work)
- Week 7-8: Testing & documentation for both
- **Goal:** Enable both by December 31

---

## Testing Protocol

Before enabling any pattern:

### 1. Technical Validation
- [ ] Generates successfully with min fabrics
- [ ] Generates successfully with max fabrics
- [ ] Generates successfully with mid-range
- [ ] Template renders correctly in preview
- [ ] PDF generation works without errors
- [ ] No console errors or warnings

### 2. Visual Quality Review
- [ ] Pattern appears as intended
- [ ] Colors assigned correctly
- [ ] Rotation strategy creates desired effect
- [ ] Blocks align properly in grid view
- [ ] Print quality acceptable

### 3. Instruction Completeness
- [ ] Prompt includes all required sections
- [ ] Cutting instructions are clear
- [ ] Assembly steps are logical
- [ ] Common mistakes documented
- [ ] Suitable for target skill level

### 4. User Acceptance
- [ ] Beta tested with 3+ quilters
- [ ] Positive feedback on usability
- [ ] Instructions tested by beginners (if beginner pattern)
- [ ] No critical issues reported
- [ ] PDF clarity confirmed

### 5. Status Update
- [ ] Set `patternStatus: 'ready'`
- [ ] Set `enabled: true`
- [ ] Update this document
- [ ] Update main README
- [ ] Announce in changelog

---

## Contributing

When working on disabled patterns:

1. **Update this doc first** with your plan
2. **Create a feature branch** (`feature/enable-mariners-compass`)
3. **Work in small commits** (template, prompt, testing)
4. **Test thoroughly** before marking ready
5. **Get peer review** from other developers + quilters
6. **Update all docs** when enabling

---

## Questions?

Contact the QuiltPlannerPro development team or see [Main Documentation](../../../../README.md).

**Last Updated:** 2026-06-09  
**Next Review:** Q3 2026 (after Storm at Sea completion)
