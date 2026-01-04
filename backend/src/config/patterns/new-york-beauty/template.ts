export const NEW_YORK_BEAUTY_TEMPLATE = `
  <!-- New York Beauty (Traditional MVP): Corner spike fan -->
  <!-- 100x100 block, fan origin at bottom-left corner (0,100) -->
  <!-- Spikes are narrow triangles from inner arc (r=40) to outer arc (r=70) -->
  <!-- 12 spikes across 90° => 7.5° each -->

  <!-- Background - COLOR1 -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>

  <!-- Optional arc band behind spikes - COLOR2 (helps if you want a visible "arc base") -->
  <path
    d="M 0,100
       L 0,30
       A 70,70 0 0,1 70,100
       Z"
    fill="COLOR2"
    opacity="0.55"
    stroke="#ccc"
    stroke-width="0.5"
  />

  <!-- Spikes (traditional NY Beauty look) -->
  <!-- Each spike: base corners on inner radius r=40, apex on outer radius r=70 -->
  <!-- Center: (0,100). Polar -> x=r*cos(theta), y=100-r*sin(theta) -->

  <!-- Spike 1 -->
  <polygon points="40.00,100.00 39.66,94.78 69.85,95.43" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 2 -->
  <polygon points="39.66,94.78 38.64,89.65 68.62,86.40" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 3 -->
  <polygon points="38.64,89.65 36.96,84.69 66.21,77.67" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 4 -->
  <polygon points="36.96,84.69 34.64,79.99 62.69,69.38" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 5 -->
  <polygon points="34.64,79.99 31.73,75.56 58.16,61.68" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 6 -->
  <polygon points="31.73,75.56 28.28,71.47 52.76,54.70" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 7 -->
  <polygon points="28.28,71.47 24.35,67.74 46.63,48.56" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 8 -->
  <polygon points="24.35,67.74 20.00,64.36 39.93,43.39" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 9 -->
  <polygon points="20.00,64.36 15.32,61.36 32.80,39.30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 10 -->
  <polygon points="15.32,61.36 10.35,58.76 25.41,36.39" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 11 -->
  <polygon points="10.35,58.76 5.22,56.56 17.92,34.75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <!-- Spike 12 -->
  <polygon points="5.22,56.56 0.00,55.76 10.50,34.43" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>

  <!-- Inner corner quarter-circle (the "sun") - COLOR4 -->
  <path d="M 0,100 L 0,75 A 25,25 0 0,1 25,100 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>

  <!-- Optional outer arc outline (helps it read as a curved spike edge) -->
  <path d="M 0,30 A 70,70 0 0,1 70,100" fill="none" stroke="#ccc" stroke-width="0.8"/>
`;

export const NEW_YORK_BEAUTY = NEW_YORK_BEAUTY_TEMPLATE;
