// template.ts

export const PINWHEEL_TEMPLATE = `
  <!-- Pinwheel Block (Center-Converging HSTs) -->
  <!-- Structure: 2×2 quadrants (each 50×50) -->
  <!-- KEY: each quadrant is split by a diagonal that runs to the center (50,50) -->

  <!-- COLOR ROLES -->
  <!-- COLOR1 = Background -->
  <!-- COLOR2 = Blades (Primary) -->
  <!-- COLOR3 = Blades (Secondary) -->
  <!-- COLOR4 = Blades (Accent) -->

  <!-- ========================= -->
  <!-- TOP-LEFT QUADRANT (0..50, 0..50) -->
  <!-- Diagonal: (0,0) -> (50,50) -->
  <!-- Blade triangle touches top midpoint (50,0) and center -->
  <polygon points="0,0 50,0 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,0 0,50 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- TOP-RIGHT QUADRANT (50..100, 0..50) -->
  <!-- Diagonal: (100,0) -> (50,50) -->
  <!-- Blade triangle touches right midpoint (100,50) and center -->
  <polygon points="100,0 100,50 50,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,0 100,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- BOTTOM-RIGHT QUADRANT (50..100, 50..100) -->
  <!-- Diagonal: (100,100) -> (50,50) -->
  <!-- Blade triangle touches bottom midpoint (50,100) and center -->
  <polygon points="100,100 50,100 50,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,100 100,50 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- BOTTOM-LEFT QUADRANT (0..50, 50..100) -->
  <!-- Diagonal: (0,100) -> (50,50) -->
  <!-- Blade triangle touches left midpoint (0,50) and center -->
  <polygon points="0,100 0,50 50,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,100 50,100 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Optional seam guides -->
  <line x1="50" y1="0" x2="50" y2="100" stroke="#ccc" stroke-width="0.5"/>
  <line x1="0" y1="50" x2="100" y2="50" stroke="#ccc" stroke-width="0.5"/>
`;

export const PINWHEEL = PINWHEEL_TEMPLATE;
