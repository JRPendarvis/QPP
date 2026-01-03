export const NEW_YORK_BEAUTY_TEMPLATE = `
  <!-- New York Beauty (MVP): Corner Fan with curved wedges -->
  <!-- Coordinate system: 100x100 block, fan center at (0,100) (bottom-left corner) -->
  <!-- Radii: inner = 25, outer = 50 -->
  <!-- Wedges: 7 slices (alternating COLOR3 / COLOR5) -->

  <!-- Background - BACKGROUND (COLOR1) -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>

  <!-- Fan band base (ring sector) - FAN BASE (COLOR2) -->
  <!-- From inner arc point (0,75) to outer arc point (0,50), around to (50,100), then back on inner arc to (0,75) -->
  <path
    d="M 0,75
       L 0,50
       A 50,50 0 0,1 50,100
       L 25,100
       A 25,25 0 0,0 0,75
       Z"
    fill="COLOR2"
    stroke="#ccc"
    stroke-width="0.5"
  />

  <!-- Fan wedges (curved pie slices inside the band) -->
  <!-- Alternate FAN WEDGES: COLOR3 and COLOR5 -->
  <path d="M 0.00,75.00 L 0.00,50.00 A 50,50 0 0,1 11.13,51.25 L 5.56,75.63 A 25,25 0 0,0 0.00,75.00 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <path d="M 5.56,75.63 L 11.13,51.25 A 50,50 0 0,1 21.70,54.95 L 10.85,77.48 A 25,25 0 0,0 5.56,75.63 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <path d="M 10.85,77.48 L 21.70,54.95 A 50,50 0 0,1 31.17,60.91 L 15.58,80.45 A 25,25 0 0,0 10.85,77.48 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <path d="M 15.58,80.45 L 31.17,60.91 A 50,50 0 0,1 39.09,68.83 L 19.54,84.42 A 25,25 0 0,0 15.58,80.45 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <path d="M 19.54,84.42 L 39.09,68.83 A 50,50 0 0,1 45.05,78.30 L 22.52,89.15 A 25,25 0 0,0 19.54,84.42 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <path d="M 22.52,89.15 L 45.05,78.30 A 50,50 0 0,1 48.75,88.87 L 24.37,94.44 A 25,25 0 0,0 22.52,89.15 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <path d="M 24.37,94.44 L 48.75,88.87 A 50,50 0 0,1 50.00,100.00 L 25.00,100.00 A 25,25 0 0,0 24.37,94.44 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- Inner corner quarter-circle - CORNER (COLOR4) -->
  <path d="M 0,100 L 0,75 A 25,25 0 0,1 25,100 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
`;

export const NEW_YORK_BEAUTY = NEW_YORK_BEAUTY_TEMPLATE;
