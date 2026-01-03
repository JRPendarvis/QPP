export const DRUNKARDS_PATH_TEMPLATE = `
  <!-- Drunkard's Path: base square + quarter-circle overlay -->
  <!-- NOTE: COLOR1/COLOR2 may be swapped per-block via getColors() to invert dominance -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>

  <!-- Quarter-circle anchored at top-left -->
  <path d="M 0,0 L 0,100 A 100,100 0 0,0 100,0 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
`;

export const DRUNKARDS_PATH = DRUNKARDS_PATH_TEMPLATE;
