export const OHIO_STAR_TEMPLATE = `
    <!-- Ohio Star: 8 QST units surrounding center, creating 8-pointed star -->
    
    <!-- Center square - SECONDARY (COLOR3) -->
    <rect x="33.33" y="33.33" width="33.34" height="33.34" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- TOP-LEFT CORNER QST (rotated 45°) -->
    <polygon points="0,0 0,33.33 16.67,16.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,0 16.67,16.67 33.33,0" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="16.67,16.67 0,33.33 33.33,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="16.67,16.67 33.33,0 33.33,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- TOP SIDE QST (straight orientation) -->
    <polygon points="33.33,0 50,16.67 33.33,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,0 50,16.67 66.67,0" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,0 50,16.67 66.67,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,33.33 50,16.67 66.67,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- TOP-RIGHT CORNER QST (rotated 45°) -->
    <polygon points="100,0 66.67,0 83.33,16.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 83.33,16.67 100,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="83.33,16.67 66.67,0 66.67,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="83.33,16.67 66.67,33.33 100,33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- RIGHT SIDE QST (straight orientation) -->
    <polygon points="100,33.33 83.33,50 66.67,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,33.33 83.33,50 100,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,66.67 83.33,50 66.67,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,33.33 83.33,50 66.67,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- BOTTOM-RIGHT CORNER QST (rotated 45°) -->
    <polygon points="100,100 100,66.67 83.33,83.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 83.33,83.33 66.67,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="83.33,83.33 100,66.67 66.67,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="83.33,83.33 66.67,66.67 66.67,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- BOTTOM SIDE QST (straight orientation) -->
    <polygon points="33.33,100 50,83.33 33.33,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,100 50,83.33 66.67,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,100 50,83.33 66.67,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,66.67 50,83.33 66.67,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- BOTTOM-LEFT CORNER QST (rotated 45°) -->
    <polygon points="0,100 33.33,100 16.67,83.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 16.67,83.33 0,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="16.67,83.33 33.33,100 33.33,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="16.67,83.33 33.33,66.67 0,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- LEFT SIDE QST (straight orientation) -->
    <polygon points="0,33.33 16.67,50 33.33,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,33.33 16.67,50 0,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,66.67 16.67,50 33.33,66.67" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,33.33 16.67,50 33.33,66.67" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const OHIO_STAR = OHIO_STAR_TEMPLATE;