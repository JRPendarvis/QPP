// template.ts

export const SAWTOOTH_STAR_TEMPLATE = `
  <!-- Sawtooth Star (Traditional / Quilt-Accurate) -->
  <!-- 4×4 grid in a 100×100 block => unit = 25 -->
  <!-- COLOR1 = Background -->
  <!-- COLOR2 = Star -->
  <!-- COLOR3 = Center -->

  <!-- ========================= -->
  <!-- Corner squares -->
  <rect x="0"  y="0"  width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="75" y="0"  width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="0"  y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="75" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ========================= -->
  <!-- Center 2×2 -->
  <rect x="25" y="25" width="50" height="50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- ========================= -->
  <!-- HST Units -->

  <!-- UNIT 2 -->
  <polygon points="25,0 50,0 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,0 25,25 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- UNIT 3 -->
  <polygon points="50,0 75,0 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,0 75,25 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

 <!-- UNIT 5 (LEFT–RIGHT FLIPPED) --> 
 <polygon points="0,25 25,25 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
 <polygon points="0,25 0,50 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/> 
 
 <!-- UNIT 8 (LEFT–RIGHT FLIPPED) -->
  <polygon points="100,25 75,50 100,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,25 100,25 75,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- UNIT 9 -->
  <polygon points="0,50 25,50 0,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,50 25,75 0,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- UNIT 12 -->
  <polygon points="75,50 100,50 100,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,50 75,75 100,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- UNIT 14 (TOP–BOTTOM FLIPPED) -->
  <polygon points="25,100 50,100 50,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,100 25,75 50,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- UNIT 15 (TOP–BOTTOM FLIPPED) -->
  <polygon points="50,100 75,100 50,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,100 75,75 50,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
`;

export const SAWTOOTH_STAR = SAWTOOTH_STAR_TEMPLATE;
