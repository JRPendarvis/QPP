/**
 * CHURN DASH (Standard) — Fully Annotated SVG Template
 *
 * Coordinate system: 100 × 100
 * Block structure: classic 3×3 grid
 *
 * Grid lines:
 *   x = 0, 33.3333, 66.6667, 100
 *   y = 0, 33.3333, 66.6667, 100
 *
 * Cell size (S) = 100 / 3 ≈ 33.3333
 * Half-cell (H) = S / 2 ≈ 16.6667
 *
 * Color roles:
 *   COLOR1 = Background
 *   COLOR2 = Primary Feature (rails + HST feature triangle)
 *   COLOR3 = Center Accent
 *
 * Behavior expectations:
 *   - 2 fabrics: pass [bg, feature] -> COLOR3 should resolve to feature in getColors()
 *     (so center becomes feature, matching traditional 2-color churn dash)
 *   - 3 fabrics: pass [bg, feature, centerAccent] -> center is COLOR3, rails/HST feature are COLOR2
 *
 * Canonical unit placement (3×3):
 *   [HST] [RAIL] [HST]
 *   [RAIL][CENTER][RAIL]
 *   [HST] [RAIL] [HST]
 *
 * IMPORTANT (inside/outside rail semantics):
 *   Each rail unit is a 1/3×1/3 square split into two rectangles.
 *   - "Inside" half touches the CENTER square
 *   - "Outside" half touches the CORNER HST
 *
 * Rails by position:
 *   Top rail    (row0,col1): inside is BOTTOM half, outside is TOP half  (horizontal split)
 *   Bottom rail (row2,col1): inside is TOP half,    outside is BOTTOM half (horizontal split)
 *   Left rail   (row1,col0): inside is RIGHT half,  outside is LEFT half (vertical split)
 *   Right rail  (row1,col2): inside is LEFT half,   outside is RIGHT half (vertical split)
 */

export const CHURN_DASH_TEMPLATE = `
  <!-- =========================================================
       BASE BACKGROUND (full block)
       ========================================================= -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>

  <!-- =========================================================
       CENTER CELL (row 1, col 1) — SOLID CENTER SQUARE
       Position: x=33.3333..66.6667, y=33.3333..66.6667
       Color: COLOR3 (center accent)
       ========================================================= -->
  <rect x="33.3333" y="33.3333" width="33.3334" height="33.3334"
        fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- =========================================================
       RAIL UNITS (HSR) — 4 mid-side cells
       Each rail cell is split into two rectangles (inside vs outside)
       ========================================================= -->

  <!-- ---------------------------------------------------------
       TOP RAIL (row 0, col 1)
       Cell bounds: x=33.3333..66.6667, y=0..33.3333
       Split: HORIZONTAL (top/bottom)
         - OUTSIDE (touches corner HSTs) = TOP half = COLOR1
         - INSIDE  (touches center square) = BOTTOM half = COLOR2
       --------------------------------------------------------- -->
  <!-- Outside (top half) -->
  <rect x="33.3333" y="0.0000" width="33.3334" height="16.6667"
        fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <!-- Inside (bottom half) -->
  <rect x="33.3333" y="16.6667" width="33.3334" height="16.6666"
        fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- ---------------------------------------------------------
       RIGHT RAIL (row 1, col 2)
       Cell bounds: x=66.6667..100, y=33.3333..66.6667
       Split: VERTICAL (left/right)
         - INSIDE  (touches center square) = LEFT half = COLOR2
         - OUTSIDE (touches corner HSTs)   = RIGHT half = COLOR1
       --------------------------------------------------------- -->
  <!-- Inside (left half) -->
  <rect x="66.6667" y="33.3333" width="16.6667" height="33.3334"
        fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Outside (right half) -->
  <rect x="83.3334" y="33.3333" width="16.6666" height="33.3334"
        fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ---------------------------------------------------------
       BOTTOM RAIL (row 2, col 1)
       Cell bounds: x=33.3333..66.6667, y=66.6667..100
       Split: HORIZONTAL (top/bottom)
         - INSIDE  (touches center square) = TOP half = COLOR2
         - OUTSIDE (touches corner HSTs)   = BOTTOM half = COLOR1
       --------------------------------------------------------- -->
  <!-- Inside (top half) -->
  <rect x="33.3333" y="66.6667" width="33.3334" height="16.6667"
        fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Outside (bottom half) -->
  <rect x="33.3333" y="83.3334" width="33.3334" height="16.6666"
        fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ---------------------------------------------------------
       LEFT RAIL (row 1, col 0)
       Cell bounds: x=0..33.3333, y=33.3333..66.6667
       Split: VERTICAL (left/right)
         - OUTSIDE (touches corner HSTs)   = LEFT half = COLOR1
         - INSIDE  (touches center square) = RIGHT half = COLOR2
       --------------------------------------------------------- -->
  <!-- Outside (left half) -->
  <rect x="0.0000" y="33.3333" width="16.6667" height="33.3334"
        fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <!-- Inside (right half) -->
  <rect x="16.6667" y="33.3333" width="16.6666" height="33.3334"
        fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- =========================================================
       CORNER HST UNITS — 4 corner cells
       Each corner cell is split diagonally into 2 triangles:
         - Feature triangle = COLOR2
         - Background triangle = COLOR1
       Goal: feature triangle points "into" the churn shape.
       ========================================================= -->

  <!-- ---------------------------------------------------------
       TOP-LEFT HST (row 0, col 0)
       Cell bounds: x=0..33.3333, y=0..33.3333
       Diagonal: from top-left to bottom-right (\\)
       Feature (COLOR2): triangle near inner corner (toward center)
       --------------------------------------------------------- -->
  <!-- Feature triangle (inner) -->
  <polygon points="33.3333,0 33.3333,33.3333 0,33.3333"
           fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Background triangle (outer) -->
  <polygon points="0,0 33.3333,0 0,33.3333"
           fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ---------------------------------------------------------
       TOP-RIGHT HST (row 0, col 2)
       Cell bounds: x=66.6667..100, y=0..33.3333
       Diagonal: from top-right to bottom-left (/)
       Feature (COLOR2): triangle near inner corner (toward center)
       --------------------------------------------------------- -->
  <!-- Feature triangle (inner) -->
  <polygon points="66.6667,0 100,33.3333 66.6667,33.3333"
           fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Background triangle (outer) -->
  <polygon points="66.6667,0 100,0 100,33.3333"
           fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ---------------------------------------------------------
       BOTTOM-RIGHT HST (row 2, col 2)
       Cell bounds: x=66.6667..100, y=66.6667..100
       Diagonal: from bottom-right to top-left (\\)
       Feature (COLOR2): triangle near inner corner (toward center)
       --------------------------------------------------------- -->
  <!-- Feature triangle (inner) -->
  <polygon points="66.6667,66.6667 100,66.6667 66.6667,100"
           fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Background triangle (outer) -->
  <polygon points="100,66.6667 100,100 66.6667,100"
           fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ---------------------------------------------------------
       BOTTOM-LEFT HST (row 2, col 0)
       Cell bounds: x=0..33.3333, y=66.6667..100
       Diagonal: from bottom-left to top-right (/)
       Feature (COLOR2): triangle near inner corner (toward center)
       --------------------------------------------------------- -->
  <!-- Feature triangle (inner) -->
  <polygon points="0,66.6667 33.3333,66.6667 33.3333,100"
           fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Background triangle (outer) -->
  <polygon points="0,66.6667 33.3333,100 0,100"
           fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- =========================================================
       OPTIONAL DEBUG GRID (comment out in production)
       ========================================================= -->
  <!--
  <g opacity="0.25">
    <line x1="33.3333" y1="0" x2="33.3333" y2="100" stroke="#000" stroke-width="0.4"/>
    <line x1="66.6667" y1="0" x2="66.6667" y2="100" stroke="#000" stroke-width="0.4"/>
    <line x1="0" y1="33.3333" x2="100" y2="33.3333" stroke="#000" stroke-width="0.4"/>
    <line x1="0" y1="66.6667" x2="100" y2="66.6667" stroke="#000" stroke-width="0.4"/>
  </g>
  -->
`;

export const CHURN_DASH = CHURN_DASH_TEMPLATE;
