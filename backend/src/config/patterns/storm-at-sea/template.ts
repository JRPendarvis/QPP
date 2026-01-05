// src/patterns/traditional/storm-at-sea/template.ts

export const STORM_AT_SEA_TEMPLATE = `
  <!-- Storm at Sea (H-corners + G-side single triangles)
       100x100 coordinate system

       COLOR1 = Background / Light
       COLOR2 = Mid
       COLOR3 = Dark
  -->

  <!-- ===================================================== -->
  <!-- OUTER CORNER TRIANGLES (outside the big diamond) -->
  <!-- ===================================================== -->
  <polygon points="0,0 50,0 0,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,0 100,0 100,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,50 100,100 50,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,50 50,100 0,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ===================================================== -->
  <!-- BIG DIAMOND BASE -->
  <!-- ===================================================== -->
  <polygon points="50,0 100,50 50,100 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ===================================================== -->
  <!-- OUTER QST SIDE TRIANGLES (diamond point -> ring square edge) -->
  <!-- Ring square corners: (25,25) (75,25) (75,75) (25,75) -->
  <!-- ===================================================== -->
  <polygon points="50,0 75,25 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="100,50 75,75 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="50,100 25,75 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <polygon points="0,50 25,25 25,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ===================================================== -->
  <!-- NEXT SQUARE RING BASE (reserve area for H + G) -->
  <!-- ===================================================== -->
  <rect x="25" y="25" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- Inner diamond points: (50,30) (70,50) (50,70) (30,50) -->
  <!-- Ring square side midpoints: (50,25) (75,50) (50,75) (25,50) -->

  <!-- ===================================================== -->
  <!-- H CORNER POCKETS (these are the H pieces in your diagram) -->
  <!-- We make them explicit 4-point polygons so they look like the reference "H" fillers. -->
  <!-- ===================================================== -->

  <!-- H: Top-Left corner pocket -->
  <polygon points="25,25 50,25 30,50 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- H: Top-Right corner pocket -->
  <polygon points="50,25 75,25 75,50 70,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- H: Bottom-Right corner pocket -->
  <polygon points="70,50 75,50 75,75 50,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- H: Bottom-Left corner pocket -->
  <polygon points="25,50 30,50 50,75 25,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ===================================================== -->
  <!-- G SIDE TRIANGLES (single triangles) -->
  <!-- These are the 4 "green highlighted" areas you wanted as ONE triangle each. -->
  <!-- ===================================================== -->

  <!-- G: Top (points into the inner diamond) -->
  <polygon points="30,50 70,50 50,30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- G: Right -->
  <polygon points="70,50 50,70 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- G: Bottom -->
  <polygon points="30,50 70,50 50,70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- G: Left -->
  <polygon points="30,50 50,30 25,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>

  <!-- ===================================================== -->
  <!-- INNER DIAMOND (turn boundary) -->
  <!-- (drawn last so it stays crisp and not "cut" by ring pieces) -->
  <!-- ===================================================== -->
  <polygon points="50,30 70,50 50,70 30,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>

  <!-- ===================================================== -->
  <!-- CENTER 4-PATCH (20x20 total, 10x10 each) -->
  <!-- ===================================================== -->
  <rect x="40" y="40" width="10" height="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
  <rect x="50" y="40" width="10" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <rect x="40" y="50" width="10" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
  <rect x="50" y="50" width="10" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
`;

export const STORM_AT_SEA = STORM_AT_SEA_TEMPLATE;
