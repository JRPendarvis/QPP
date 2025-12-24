export const LONE_STAR_TEMPLATE = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Corner squares - BACKGROUND -->
    <rect x="0" y="0" width="22" height="22" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="78" y="0" width="22" height="22" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="78" width="22" height="22" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="78" y="78" width="22" height="22" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Outer ring (Ring 3) - COLOR4 -->
    <polygon points="50,5 62,22 50,22" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,5 38,22 50,22" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="95,50 78,62 78,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="95,50 78,38 78,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,95 62,78 50,78" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,95 38,78 50,78" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="5,50 22,62 22,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="5,50 22,38 22,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Middle ring (Ring 2) - COLOR3 -->
    <polygon points="50,22 58,35 50,35" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,22 42,35 50,35" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="78,50 65,58 65,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="78,50 65,42 65,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,78 58,65 50,65" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,78 42,65 50,65" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="22,50 35,58 35,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="22,50 35,42 35,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Inner ring (Ring 1) - COLOR2 (ACCENT/center) -->
    <polygon points="50,35 54,42 50,42" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,35 46,42 50,42" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="65,50 58,54 58,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="65,50 58,46 58,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,65 54,58 50,58" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,65 46,58 50,58" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="35,50 42,54 42,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="35,50 42,46 42,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center - COLOR2 -->
    <polygon points="46,42 54,42 58,46 58,54 54,58 46,58 42,54 42,46" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const LONE_STAR = LONE_STAR_TEMPLATE;