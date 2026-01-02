export const CHURN_DASH_TEMPLATE = `
  <!-- Base background -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>

  <!-- Constants:
       3x3 grid => each cell ~33.3333
       rail split => ~16.6667
  -->

  <!-- Center square (accent) -->
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

  <!-- Corner HST units (COLOR1 + COLOR3) -->
  <!-- Top-left -->
  <polygon points="0,0 33.3333,0 0,33.3333" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="33.3333,0 33.3333,33.3333 0,33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Top-right -->
  <polygon points="66.6667,0 100,0 100,33.3333" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="66.6667,0 100,33.3333 66.6667,33.3333" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Bottom-right -->
  <polygon points="100,66.6667 100,100 66.6667,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="66.6667,66.6667 100,66.6667 66.6667,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Bottom-left -->
  <polygon points="0,66.6667 33.3333,100 0,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,66.6667 33.3333,66.6667 33.3333,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
`;

export const CHURN_DASH = CHURN_DASH_TEMPLATE;
