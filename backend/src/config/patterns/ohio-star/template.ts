export const OHIO_STAR_TEMPLATE = `
  
  <!-- Cell 1 (row 1, col 1) - CORNER SOLID -->
  <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 2 (row 1, col 2) - TOP EDGE HST (COLOR1+COLOR2) -->
  <polygon points="25,0 50,0 37.5,12.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,0 37.5,12.5 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,0 37.5,12.5 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,25 37.5,12.5 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 3 (row 1, col 3) - TOP EDGE HST (COLOR1+COLOR2) -->
  <polygon points="50,0 75,0 62.5,12.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,0 62.5,12.5 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,0 62.5,12.5 75,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,25 62.5,12.5 75,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 4 (row 1, col 4) - CORNER SOLID -->
  <rect x="75" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 5 (row 2, col 1) - LEFT EDGE HST (COLOR1+COLOR2) -->
  <polygon points="0,25 25,25 12.5,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,25 12.5,37.5 0,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,25 12.5,37.5 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,50 12.5,37.5 25,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 6 (row 2, col 2) - CENTER HST (COLOR2+COLOR3) -->
  <polygon points="25,25 50,25 37.5,37.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,25 37.5,37.5 25,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,25 37.5,37.5 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,50 37.5,37.5 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 7 (row 2, col 3) - CENTER HST (COLOR2+COLOR3) -->
  <polygon points="50,25 75,25 62.5,37.5" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,25 62.5,37.5 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,25 62.5,37.5 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,50 62.5,37.5 75,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 8 (row 2, col 4) - RIGHT EDGE HST (COLOR1+COLOR2) -->
  <polygon points="75,25 100,25 87.5,37.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,25 87.5,37.5 100,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,25 87.5,37.5 75,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,50 87.5,37.5 100,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>


  <!-- Cell 9 (row 3, col 1) - LEFT EDGE HST (COLOR1+COLOR2) -->
  <polygon points="0,50 25,50 12.5,62.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,50 12.5,62.5 0,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,50 12.5,62.5 25,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,75 12.5,62.5 25,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 10 (row 3, col 2) - CENTER HST (COLOR2+COLOR3) -->
  <polygon points="25,50 50,50 37.5,62.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,50 37.5,62.5 25,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,50 37.5,62.5 50,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="25,75 37.5,62.5 50,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 11 (row 3, col 3) - CENTER HST (COLOR2+COLOR3) -->
  <polygon points="50,50 75,50 62.5,62.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,50 62.5,62.5 50,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,50 62.5,62.5 75,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,75 62.5,62.5 75,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>

  <!-- Cell 12 (row 3, col 4) - RIGHT EDGE HST (COLOR1+COLOR2) -->
  <polygon points="75,50 100,50 87.5,62.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,50 87.5,62.5 100,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,50 87.5,62.5 75,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="75,75 87.5,62.5 100,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>


  <!-- Cell 13 (row 4, col 1) - CORNER SOLID -->
  <rect x="0" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

   <!-- Cell 14 (row 4, col 2) - BOTTOM EDGE HST (COLOR1+COLOR2) -->
  <polygon points="25,75 50,75 37.5,87.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>  <!-- top -->
  <polygon points="50,75 50,100 37.5,87.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/> <!-- right -->
  <polygon points="25,100 50,100 37.5,87.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/> <!-- bottom -->
  <polygon points="25,75 25,100 37.5,87.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/> <!-- left -->

    <!-- Cell 15 (row 4, col 3) - BOTTOM EDGE HST (COLOR1+COLOR2) -->
  <polygon points="50,75 75,75 62.5,87.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>  <!-- top -->
  <polygon points="75,75 75,100 62.5,87.5" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/> <!-- right -->
  <polygon points="50,100 75,100 62.5,87.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/> <!-- bottom -->
  <polygon points="50,75 50,100 62.5,87.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/> <!-- left -->

  <!-- Cell 16 (row 4, col 4) - CORNER SOLID -->
  <rect x="75" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

`;

export const OHIO_STAR = OHIO_STAR_TEMPLATE;
