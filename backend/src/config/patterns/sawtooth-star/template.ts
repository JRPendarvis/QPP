export const SAWTOOTH_STAR_TEMPLATE = `
  <!-- Corner squares - BACKGROUND (COLOR1) -->
  <rect x="0" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="66.67" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="0" y="66.67" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="66.67" y="66.67" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Center square - SECONDARY (COLOR3, falls back to PRIMARY for 2-fabric) -->
  <rect x="33.33" y="33.33" width="33.34" height="33.34" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Top side: 2 HSTs creating 2 star points -->
  <!-- Top-left HST -->
  <polygon points="33.33,0 33.33,33.33 50,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="33.33,0 50,0 50,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Top-right HST -->
  <polygon points="50,0 66.67,0 50,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="66.67,0 66.67,33.33 50,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Right side: 2 HSTs creating 2 star points -->
  <!-- Right-top HST -->
  <polygon points="66.67,33.33 100,33.33 66.67,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,33.33 100,50 66.67,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <!-- Right-bottom HST -->
  <polygon points="100,50 100,66.67 66.67,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="66.67,50 100,50 66.67,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Bottom side: 2 HSTs creating 2 star points -->
  <!-- Bottom-left HST -->
  <polygon points="33.33,66.67 33.33,100 50,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="33.33,100 50,100 50,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Bottom-right HST -->
  <polygon points="50,66.67 50,100 66.67,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,66.67 66.67,66.67 66.67,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Left side: 2 HSTs creating 2 star points -->
  <!-- Left-top HST -->
  <polygon points="0,33.33 33.33,33.33 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,50 33.33,50 33.33,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <!-- Left-bottom HST -->
  <polygon points="0,50 0,66.67 33.33,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,66.67 33.33,66.67 33.33,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;
  
export const SAWTOOTH_STAR = SAWTOOTH_STAR_TEMPLATE;