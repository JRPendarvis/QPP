// Mosaic Star template
// Complex star with "feather" triangles along the edges
// Supports 3-5 fabrics with proper role mapping

export const MOSAIC_STAR_TEMPLATE = `
    <!-- Background - fills entire block -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Four corner squares - BACKGROUND -->
    <rect x="0" y="0" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="0" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="80" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="80" y="80" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center square - ACCENT (COLOR4, falls back to SECONDARY for 3 fabrics) -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Main star points (4 cardinal directions) - PRIMARY -->
    <polygon points="40,20 60,20 50,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,40 80,60 60,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="40,80 60,80 50,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,40 20,60 40,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Diagonal star points (4 corners) - PRIMARY -->
    <polygon points="20,20 40,20 40,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,20 20,40 40,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,20 60,20 60,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,20 80,40 60,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,80 40,80 40,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,80 20,60 40,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,80 60,80 60,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,80 80,60 60,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- FEATHERS - Top edge (alternating SECONDARY and CONTRAST) -->
    <polygon points="20,20 27,20 23.5,13" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="27,20 34,20 30.5,13" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="34,20 40,20 37,13" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="60,20 66,20 63,13" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66,20 73,20 69.5,13" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="73,20 80,20 76.5,13" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- FEATHERS - Bottom edge (alternating SECONDARY and CONTRAST) -->
    <polygon points="20,80 27,80 23.5,87" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="27,80 34,80 30.5,87" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="34,80 40,80 37,87" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="60,80 66,80 63,87" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66,80 73,80 69.5,87" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="73,80 80,80 76.5,87" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- FEATHERS - Left edge (alternating SECONDARY and CONTRAST) -->
    <polygon points="20,20 20,27 13,23.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,27 20,34 13,30.5" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,34 20,40 13,37" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,60 20,66 13,63" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,66 20,73 13,69.5" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,73 20,80 13,76.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- FEATHERS - Right edge (alternating SECONDARY and CONTRAST) -->
    <polygon points="80,20 80,27 87,23.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,27 80,34 87,30.5" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,34 80,40 87,37" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,60 80,66 87,63" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,66 80,73 87,69.5" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,73 80,80 87,76.5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

export const MOSAIC_STAR = MOSAIC_STAR_TEMPLATE;