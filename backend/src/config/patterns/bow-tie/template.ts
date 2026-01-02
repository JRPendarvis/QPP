export const BOW_TIE_TEMPLATE = `
  <!-- Traditional Bow Tie block (100×100 local space) -->
  <!-- COLOR1 = Background -->
  <!-- COLOR2 = Tie -->
  <!-- COLOR3 = Inner-corner triangles -->

  <!-- Tie squares (diagonal corners) -->
  <rect x="0" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <rect x="50" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Background squares -->
  <rect x="50" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="0" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Inner-corner triangles near center -->
  <polygon points="50,50 66,50 50,34" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,50 50,66 34,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
`;

export const BOW_TIE = BOW_TIE_TEMPLATE;
