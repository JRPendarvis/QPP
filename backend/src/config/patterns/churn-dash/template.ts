export const CHURN_DASH_TEMPLATE = `
  <!-- Constants:
       3x3 grid => each cell ~33.3333
       rail split => ~16.6667
  -->

  <!-- Corner squares (full cells - BACKGROUND COLOR1) -->
  <rect x="0" y="0" width="33.3333" height="33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="66.6667" y="0" width="33.3333" height="33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="0" y="66.6667" width="33.3333" height="33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="66.6667" y="66.6667" width="33.3333" height="33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Center square (COLOR3 - accent/center) -->
  <rect x="33.3333" y="33.3333" width="33.3334" height="33.3334" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- Rail units (each is a square split into two rectangles) -->
  <!-- Top-middle rail: left COLOR2, right COLOR1 -->
  <rect x="33.3333" y="0" width="16.6667" height="33.3333" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <rect x="50.0000" y="0" width="16.6667" height="33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Right-middle rail: top COLOR2, bottom COLOR1 -->
  <rect x="66.6667" y="33.3333" width="33.3333" height="16.6667" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <rect x="66.6667" y="50.0000" width="33.3333" height="16.6667" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Bottom-middle rail: left COLOR1, right COLOR2 -->
  <rect x="33.3333" y="66.6667" width="16.6667" height="33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="50.0000" y="66.6667" width="16.6667" height="33.3333" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Left-middle rail: top COLOR1, bottom COLOR2 -->
  <rect x="0" y="33.3333" width="33.3333" height="16.6667" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="0" y="50.0000" width="33.3333" height="16.6667" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Corner HST units - triangles match adjacent rails to create "blades" -->
  
  <!-- Top-left corner: COLOR2 triangle on right side (matches left portion of top rail) -->
  <polygon points="0,0 33.3333,0 33.3333,33.3333" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Top-right corner: COLOR2 triangle on left side (matches left portion of top rail) -->
  <polygon points="66.6667,0 66.6667,33.3333 100,0" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Bottom-right corner: COLOR2 triangle on left side (matches right portion of bottom rail) -->
  <polygon points="66.6667,66.6667 66.6667,100 100,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Bottom-left corner: COLOR2 triangle on right side (matches right portion of bottom rail) -->
  <polygon points="0,66.6667 33.3333,66.6667 0,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
`;

export const CHURN_DASH = CHURN_DASH_TEMPLATE;