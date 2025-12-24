export const NEW_YORK_BEAUTY_TEMPLATE = `
    <!-- Background - COLOR1 -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Outer arc band (spike background) - COLOR2 -->
    <path d="M 0,100 L 0,70 A 70,70 0 0,1 70,100 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Spikes radiating from corner - COLOR3 -->
    <polygon points="0,85 18,72 22,78" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="8,72 28,62 30,70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,60 40,52 40,60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="30,50 52,45 50,54" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="42,42 65,40 62,48" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,35 78,36 72,44" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68,30 88,34 82,42" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,26 96,32 88,40" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Inner arc ring - COLOR4 -->
    <path d="M 0,100 L 0,50 A 50,50 0 0,1 50,100 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Inner corner piece (quarter circle) - COLOR4 -->
    <path d="M 0,100 L 0,75 A 25,25 0 0,1 25,100 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const NEW_YORK_BEAUTY = NEW_YORK_BEAUTY_TEMPLATE;