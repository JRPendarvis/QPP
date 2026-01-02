export const BOW_TIE_TEMPLATE = `
  <!-- Traditional Bow Tie block (100×100 local space) -->
  <!-- COLOR1 = Background triangles between center and corners -->
  <!-- COLOR2 = Two opposite corner squares -->
  <!-- COLOR3 = Center diamond + two opposite corner squares -->

  <!-- Corner squares - alternating colors -->
  <!-- Top-left corner (COLOR3) -->
  <rect x="0" y="0" width="50" height="50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Top-right corner (COLOR2) -->
  <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Bottom-left corner (COLOR2) -->
  <rect x="0" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Bottom-right corner (COLOR3) -->
  <rect x="50" y="50" width="50" height="50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- Background triangles (COLOR1) filling spaces around center diamond -->
  <!-- Top triangle -->
  <polygon points="50,0 75,25 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Right triangle -->
  <polygon points="100,50 75,25 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Bottom triangle -->
  <polygon points="50,100 25,75 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Left triangle -->
  <polygon points="0,50 25,25 25,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Center diamond (COLOR3) - drawn on top -->
  <polygon points="50,25 75,50 50,75 25,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
`;

export const BOW_TIE = BOW_TIE_TEMPLATE;