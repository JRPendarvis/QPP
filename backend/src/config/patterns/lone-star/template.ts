// src/patterns/blocks/lone-star/template.ts

export const LONE_STAR_TEMPLATE = `
  <!-- TRUE Lone Star (Star of Bethlehem) - diamond strips forming 8 continuous points -->
  <!-- MVP geometry approach:
       - Build ONE "upward" point as connected diamonds (touching edge-to-edge)
       - Rotate that same point 8 times (0,45,90...315) around the center
       - This yields a single, dominant 8-point Lone Star (not a block-grid star)
       - Diamonds are 45° (square-rotated) diamonds for clean, recognizable Lone Star structure
       
       COLOR SLOTS (must match index.ts getColors return order):
       - COLOR1 = Center diamond
       - COLOR2 = Ring 1 (closest to center)
       - COLOR3 = Ring 2
       - COLOR4 = Ring 3
       - COLOR5 = Ring 4 (outer/tips)
       - COLOR6 = (unused in this MVP template, reserved for future extra rings)
       - COLOR7 = (unused in this MVP template, reserved for future extra rings)
       - COLOR8 = Background / setting area
  -->

  <!-- Background / setting area -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>

  <!-- Center diamond (COLOR1) -->
  <polygon points="50,43.75 56.25,50 50,56.25 43.75,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- One continuous "point" built from touching diamonds, then rotated into 8 points -->
  <!-- Diamond size: half-diagonal = 6.25 (full diagonal = 12.5) -->

  <!-- Point at 0° (Up) -->
  <g>
    <!-- Row 1 (Ring 1 - COLOR2) -->
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

    <!-- Row 2 (Ring 2 - COLOR3) -->
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

    <!-- Row 3 (Ring 3 - COLOR4) -->
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>

    <!-- Row 4 (Ring 4 / outer tips - COLOR5) -->
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <!-- Rotate the SAME point around the center to create the TRUE 8-point Lone Star -->
  <g transform="rotate(45 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <g transform="rotate(90 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <g transform="rotate(135 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <g transform="rotate(180 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <g transform="rotate(225 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <g transform="rotate(270 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>

  <g transform="rotate(315 50 50)">
    <polygon points="50,31.25 56.25,37.5 50,43.75 43.75,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,18.75 50,25 43.75,31.25 37.5,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,18.75 62.5,25 56.25,31.25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="37.5,6.25 43.75,12.5 37.5,18.75 31.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,6.25 56.25,12.5 50,18.75 43.75,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="62.5,6.25 68.75,12.5 62.5,18.75 56.25,12.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="31.25,0 37.5,6.25 31.25,12.5 25,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="43.75,0 50,6.25 43.75,12.5 37.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="56.25,0 62.5,6.25 56.25,12.5 50,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68.75,0 75,6.25 68.75,12.5 62.5,6.25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  </g>
`;

export const LONE_STAR = LONE_STAR_TEMPLATE;
