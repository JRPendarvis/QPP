// Flying Geese template
// Creates a 2x2 grid of 4 flying geese units per block
// Supports 2-6 fabrics with proper role mapping

export const FLYING_GEESE_TEMPLATE = `
    <!-- 2x2 grid of 4 flying geese units -->
    <!-- Each unit: 1 large upward-pointing triangle (goose) + 2 small triangles (sky) -->
    
    <!-- Top-left goose unit (GOOSE1) -->
    <polygon points="25,0 0,50 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,0 25,0 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 50,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top-right goose unit (GOOSE2) -->
    <polygon points="75,0 50,50 100,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 75,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 100,0 100,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-left goose unit (GOOSE3) -->
    <polygon points="25,50 0,100 50,100" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 25,50 0,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 50,50 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-right goose unit (GOOSE4) -->
    <polygon points="75,50 50,100 100,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 75,50 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 100,50 100,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const FLYING_GEESE = FLYING_GEESE_TEMPLATE;