export const FEATHERED_STAR = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR2"/>
    
    <!-- Four corner squares -->
    <rect x="0" y="0" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="0" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="80" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="80" width="20" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center square -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Main star points (flying geese pointing toward center) -->
    <!-- Top point -->
    <polygon points="40,20 60,20 50,40" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right point -->
    <polygon points="80,40 80,60 60,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom point -->
    <polygon points="40,80 60,80 50,60" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left point -->
    <polygon points="20,40 20,60 40,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Diagonal star points (connecting corners to center) -->
    <!-- Top-left diagonal -->
    <polygon points="20,20 40,20 40,40" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,20 20,40 40,40" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right diagonal -->
    <polygon points="80,20 60,20 60,40" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,20 80,40 60,40" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left diagonal -->
    <polygon points="20,80 40,80 40,60" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,80 20,60 40,60" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right diagonal -->
    <polygon points="80,80 60,80 60,60" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,80 80,60 60,60" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- FEATHERS - alternating small triangles along outer edges -->
    <!-- Top feathers (pointing up, along y=20 line) -->
    <polygon points="20,20 27,20 23.5,13" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="27,20 34,20 30.5,13" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="34,20 40,20 37,13" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="60,20 66,20 63,13" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66,20 73,20 69.5,13" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="73,20 80,20 76.5,13" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom feathers (pointing down, along y=80 line) -->
    <polygon points="20,80 27,80 23.5,87" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="27,80 34,80 30.5,87" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="34,80 40,80 37,87" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="60,80 66,80 63,87" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66,80 73,80 69.5,87" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="73,80 80,80 76.5,87" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left feathers (pointing left, along x=20 line) -->
    <polygon points="20,20 20,27 13,23.5" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,27 20,34 13,30.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,34 20,40 13,37" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,60 20,66 13,63" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,66 20,73 13,69.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,73 20,80 13,76.5" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right feathers (pointing right, along x=80 line) -->
    <polygon points="80,20 80,27 87,23.5" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,27 80,34 87,30.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,34 80,40 87,37" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,60 80,66 87,63" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,66 80,73 87,69.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,73 80,80 87,76.5" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;