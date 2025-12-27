// Pickle Dish Template
// Traditional pattern with curved arcs featuring fan-shaped spike sections
// The spikes radiate outward creating a sunburst effect - this is what distinguishes it from Double Wedding Ring

export const PICKLE_DISH_TEMPLATE = `
    <!-- Background - COLOR1 -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- ============================================ -->
    <!-- TOP ARC with fan spikes -->
    <!-- ============================================ -->
    
    <!-- Top arc base band - COLOR2 -->
    <path d="M 20,15 Q 50,35 80,15 L 80,20 Q 50,42 20,20 Z" fill="COLOR2" stroke="#888" stroke-width="0.3"/>
    
    <!-- Top fan spikes - COLOR3 - radiating wedges -->
    <polygon points="22,15 25,3 28,15" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="28,14 31,2 34,13" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="34,12 37,1 40,11" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="40,10 43,0 46,10" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="46,10 50,0 54,10" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="54,10 57,0 60,10" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="60,11 63,1 66,12" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="66,13 69,2 72,14" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="72,15 75,3 78,15" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    
    <!-- ============================================ -->
    <!-- BOTTOM ARC with fan spikes -->
    <!-- ============================================ -->
    
    <!-- Bottom arc base band - COLOR2 -->
    <path d="M 20,85 Q 50,65 80,85 L 80,80 Q 50,58 20,80 Z" fill="COLOR2" stroke="#888" stroke-width="0.3"/>
    
    <!-- Bottom fan spikes - COLOR3 - radiating wedges -->
    <polygon points="22,85 25,97 28,85" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="28,86 31,98 34,87" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="34,88 37,99 40,89" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="40,90 43,100 46,90" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="46,90 50,100 54,90" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="54,90 57,100 60,90" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="60,89 63,99 66,88" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="66,87 69,98 72,86" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="72,85 75,97 78,85" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    
    <!-- ============================================ -->
    <!-- LEFT ARC with fan spikes -->
    <!-- ============================================ -->
    
    <!-- Left arc base band - COLOR2 -->
    <path d="M 15,20 Q 35,50 15,80 L 20,80 Q 42,50 20,20 Z" fill="COLOR2" stroke="#888" stroke-width="0.3"/>
    
    <!-- Left fan spikes - COLOR3 - radiating wedges -->
    <polygon points="15,22 3,25 15,28" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="14,28 2,31 13,34" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="12,34 1,37 11,40" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="10,40 0,43 10,46" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="10,46 0,50 10,54" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="10,54 0,57 10,60" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="11,60 1,63 12,66" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="13,66 2,69 14,72" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="15,72 3,75 15,78" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    
    <!-- ============================================ -->
    <!-- RIGHT ARC with fan spikes -->
    <!-- ============================================ -->
    
    <!-- Right arc base band - COLOR2 -->
    <path d="M 85,20 Q 65,50 85,80 L 80,80 Q 58,50 80,20 Z" fill="COLOR2" stroke="#888" stroke-width="0.3"/>
    
    <!-- Right fan spikes - COLOR3 - radiating wedges -->
    <polygon points="85,22 97,25 85,28" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="86,28 98,31 87,34" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="88,34 99,37 89,40" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="90,40 100,43 90,46" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="90,46 100,50 90,54" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="90,54 100,57 90,60" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="89,60 99,63 88,66" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="87,66 98,69 86,72" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    <polygon points="85,72 97,75 85,78" fill="COLOR3" stroke="#888" stroke-width="0.2"/>
    
    <!-- ============================================ -->
    <!-- CORNER MELONS - COLOR4 -->
    <!-- These create the distinctive melon shapes where blocks meet -->
    <!-- ============================================ -->
    
    <!-- Top-left corner melon -->
    <path d="M 0,0 L 20,0 Q 15,8 15,20 L 0,20 Q 8,15 0,0 Z" fill="COLOR4" stroke="#888" stroke-width="0.3"/>
    
    <!-- Top-right corner melon -->
    <path d="M 100,0 L 80,0 Q 85,8 85,20 L 100,20 Q 92,15 100,0 Z" fill="COLOR4" stroke="#888" stroke-width="0.3"/>
    
    <!-- Bottom-left corner melon -->
    <path d="M 0,100 L 20,100 Q 15,92 15,80 L 0,80 Q 8,85 0,100 Z" fill="COLOR4" stroke="#888" stroke-width="0.3"/>
    
    <!-- Bottom-right corner melon -->
    <path d="M 100,100 L 80,100 Q 85,92 85,80 L 100,80 Q 92,85 100,100 Z" fill="COLOR4" stroke="#888" stroke-width="0.3"/>
    
    <!-- ============================================ -->
    <!-- CENTER AREA - left as background COLOR1 -->
    <!-- This creates the open "melon" center of each block -->
    <!-- ============================================ -->
`;

export const PICKLE_DISH = PICKLE_DISH_TEMPLATE;