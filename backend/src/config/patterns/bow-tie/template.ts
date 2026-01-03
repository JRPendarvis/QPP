export const BOW_TIE_TEMPLATE = `
  <!-- Bow Tie (2×2 unit) in 100×100 local space -->
  <!-- COLOR1 = Background (3.5" squares) -->
  <!-- COLOR2 = Bow / Primary (3.5" squares) -->
  <!-- COLOR3 = Knot corner patches (from 2.5" square) -->

  <!-- Top-left: Background square -->
  <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <!-- Knot patch on bottom-right corner of TL square -->
  <polygon points="50,50 50,30 30,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- Top-right: Bow square -->
  <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Bottom-left: Bow square -->
  <rect x="0" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Bottom-right: Background square -->
  <rect x="50" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <!-- Knot patch on top-left corner of BR square -->
  <polygon points="50,50 70,50 50,70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
`;

export const BOW_TIE = BOW_TIE_TEMPLATE;
