export const SAWTOOTH_STAR_TEMPLATE = `
  <!-- Corner squares -->
  <rect x="0" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <rect x="75" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <rect x="0" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <rect x="75" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Center square -->
  <rect x="25" y="25" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <!-- Top flying geese (pointing DOWN) -->
  <polygon points="25,0 75,0 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,0 25,25 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,0 50,25 75,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Right flying geese (pointing LEFT) -->
  <polygon points="100,25 100,75 75,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,25 75,25 75,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,75 75,50 75,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Bottom flying geese (pointing UP) -->
  <polygon points="25,100 75,100 50,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,100 25,75 50,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,100 50,75 75,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Left flying geese (pointing RIGHT) -->
  <polygon points="0,25 0,75 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,25 25,25 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,75 25,50 25,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;
  
export const SAWTOOTH_STAR = SAWTOOTH_STAR_TEMPLATE;