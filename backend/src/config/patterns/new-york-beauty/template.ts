export const NEW_YORK_BEAUTY_TEMPLATE = `
    <!-- Background - BACKGROUND (COLOR1) -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Outer arc band (spike background) - PRIMARY (COLOR2) -->
    <path d="M 0,100 L 0,50 A 50,50 0 0,1 50,100 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Spikes radiating from corner - alternating SECONDARY (COLOR3) and CONTRAST (COLOR5) -->
    <polygon points="0,85 10,75 12,80" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="5,75 18,66 20,72" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="12,66 28,58 28,64" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,58 36,52 36,58" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="28,52 44,48 42,54" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="36,48 52,46 48,52" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="44,46 60,46 56,52" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="52,46 68,48 64,54" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="60,48 76,52 70,58" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="68,52 82,58 76,64" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="76,58 88,66 82,72" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,66 94,76 88,82" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Inner corner quarter-circle - ACCENT (COLOR4) -->
    <path d="M 0,100 L 0,75 A 25,25 0 0,1 25,100 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const NEW_YORK_BEAUTY = NEW_YORK_BEAUTY_TEMPLATE;