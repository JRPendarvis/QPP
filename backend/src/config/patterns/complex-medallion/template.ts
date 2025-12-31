export const COMPLEX_MEDALLION_TEMPLATE = `
    <!-- Outermost border - BACKGROUND (fabricColors[0]) -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1" stroke="none"/>
    
    <!-- Border 6 (if 8 fabrics provided) - fabricColors[7] -->
    <rect x="5" y="5" width="90" height="90" fill="COLOR8" stroke="none"/>
    
    <!-- Border 5 (if 7+ fabrics provided) - fabricColors[6] -->
    <rect x="10" y="10" width="80" height="80" fill="COLOR7" stroke="none"/>
    
    <!-- Border 4 (if 6+ fabrics provided) - CONTRAST (fabricColors[5]) -->
    <rect x="15" y="15" width="70" height="70" fill="COLOR6" stroke="none"/>
    
    <!-- Border 3 (if 5+ fabrics provided) - CONTRAST (fabricColors[4]) -->
    <rect x="20" y="20" width="60" height="60" fill="COLOR5" stroke="none"/>
    
    <!-- Border 2 - ACCENT (fabricColors[3]) -->
    <rect x="25" y="25" width="50" height="50" fill="COLOR4" stroke="none"/>
    
    <!-- Border 1 - SECONDARY (fabricColors[2]) -->
    <rect x="30" y="30" width="40" height="40" fill="COLOR3" stroke="none"/>
    
    <!-- Center medallion star - PRIMARY (fabricColors[1]) -->
    <!-- Top point -->
    <polygon points="50,35 55,45 50,47 45,45" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
    <!-- Right point -->
    <polygon points="65,50 55,55 53,50 55,45" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
    <!-- Bottom point -->
    <polygon points="50,65 45,55 50,53 55,55" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
    <!-- Left point -->
    <polygon points="35,50 45,45 47,50 45,55" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
    
    <!-- Center square - PRIMARY (same as star) -->
    <rect x="47" y="47" width="6" height="6" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
    
    <!-- Decorative corner accents in Border 1 - SECONDARY -->
    <circle cx="32" cy="32" r="1.5" fill="COLOR3" stroke="none"/>
    <circle cx="68" cy="32" r="1.5" fill="COLOR3" stroke="none"/>
    <circle cx="32" cy="68" r="1.5" fill="COLOR3" stroke="none"/>
    <circle cx="68" cy="68" r="1.5" fill="COLOR3" stroke="none"/>`;

export const COMPLEX_MEDALLION = COMPLEX_MEDALLION_TEMPLATE;