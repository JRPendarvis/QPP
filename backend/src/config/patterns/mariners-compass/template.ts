export const MARINERS_COMPASS_TEMPLATE = `
    <!-- Background circle and corners - BACKGROUND (COLOR1) -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Long cardinal points (N, E, S, W) - PRIMARY (COLOR2) -->
    <polygon points="50,2 56,40 50,50 44,40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="98,50 60,56 50,50 60,44" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,98 44,60 50,50 56,60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="2,50 40,44 50,50 40,56" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Medium ordinal points (NE, SE, SW, NW) - SECONDARY (COLOR3) -->
    <polygon points="85,15 58,42 50,50 56,38" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="85,85 58,58 50,50 56,62" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="15,85 42,58 50,50 44,62" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="15,15 42,42 50,50 44,38" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Short intermediate points - alternating CONTRAST (COLOR5) and ADDITIONAL (COLOR6) -->
    <!-- Between N and NE (COLOR5) -->
    <polygon points="68,8 55,38 50,50 52,40" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between NE and E (COLOR6) -->
    <polygon points="92,32 62,45 50,50 60,48" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between E and SE (COLOR5) -->
    <polygon points="92,68 62,55 50,50 60,52" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between SE and S (COLOR6) -->
    <polygon points="68,92 55,62 50,50 52,60" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between S and SW (COLOR5) -->
    <polygon points="32,92 45,62 50,50 48,60" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between SW and W (COLOR6) -->
    <polygon points="8,68 38,55 50,50 40,52" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between W and NW (COLOR5) -->
    <polygon points="8,32 38,45 50,50 40,48" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Between NW and N (COLOR6) -->
    <polygon points="32,8 45,38 50,50 48,40" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center circle/octagon - ACCENT (COLOR4) -->
    <polygon points="44,40 50,38 56,40 58,46 58,54 56,60 50,62 44,60 42,54 42,46" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const MARINERS_COMPASS = MARINERS_COMPASS_TEMPLATE;