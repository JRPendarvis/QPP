// Log Cabin template
// Center hearth with strips spiraling outward in 4 rounds
// Light side (top+right), Dark side (bottom+left)
// Supports 3-8 fabrics with proper fallback behavior

export const LOG_CABIN_TEMPLATE = `
    <!-- Center hearth - BACKGROUND (COLOR1) -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1: Light=PRIMARY (COLOR2), Dark=SECONDARY (COLOR3) -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2: Light=ACCENT (COLOR4), Dark=CONTRAST (COLOR5) -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3: Light=Light3 (COLOR6), Dark=Dark3 (COLOR7) -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4: Light=Light4 (COLOR8), Dark=SECONDARY (COLOR3 fallback) -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

export const LOG_CABIN = LOG_CABIN_TEMPLATE;