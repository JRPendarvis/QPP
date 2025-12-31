export const OHIO_STAR_TEMPLATE = `
    <!-- Ohio Star: Background corners + Primary star points + Secondary/Primary center -->
    
    <!-- Four corner squares - BACKGROUND (COLOR1) -->
    <rect x="0" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.67" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="66.67" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.67" y="66.67" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center square - SECONDARY (COLOR3, falls back to PRIMARY for 2-fabric) -->
    <rect x="33.33" y="33.33" width="33.34" height="33.34" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top QST: 2 PRIMARY triangles pointing inward, 2 BACKGROUND triangles pointing outward -->
    <polygon points="33.33,0 50,0 50,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 66.67,0 50,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,0 33.33,33.33 50,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,0 66.67,33.33 50,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right QST: 2 PRIMARY triangles pointing inward, 2 BACKGROUND triangles pointing outward -->
    <polygon points="66.67,33.33 100,33.33 66.67,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,33.33 100,50 66.67,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,50 100,50 66.67,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 100,66.67 66.67,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom QST: 2 PRIMARY triangles pointing inward, 2 BACKGROUND triangles pointing outward -->
    <polygon points="33.33,66.67 33.33,100 50,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,100 50,100 50,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,66.67 50,100 66.67,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,66.67 66.67,66.67 66.67,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left QST: 2 PRIMARY triangles pointing inward, 2 BACKGROUND triangles pointing outward -->
    <polygon points="0,33.33 33.33,33.33 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 33.33,50 33.33,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,66.67 33.33,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,66.67 33.33,66.67 33.33,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const OHIO_STAR = OHIO_STAR_TEMPLATE;