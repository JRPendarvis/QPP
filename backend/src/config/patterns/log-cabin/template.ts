// Log Cabin templates with varying color counts
// All templates maintain: center hearth, light side (top+right), dark side (bottom+left)

// 3-color: Basic light/dark split
export const LOG_CABIN_TEMPLATE = `
    <!-- Center hearth -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1 -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2 -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3 -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4 -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

// 4-color: Alternating lights OR darks
export const LOG_CABIN_4 = `
    <!-- Center hearth -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2 - Light: COLOR4, Dark: COLOR3 -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4 - Light: COLOR4, Dark: COLOR3 -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

// 5-color: 2 alternating lights, 2 alternating darks
export const LOG_CABIN_5 = `
    <!-- Center hearth -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2 - Light: COLOR4, Dark: COLOR5 -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4 - Light: COLOR4, Dark: COLOR5 -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>`;

// 6-color: 3 lights, 2 darks (or vice versa)
export const LOG_CABIN_6 = `
    <!-- Center hearth -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2 - Light: COLOR4, Dark: COLOR5 -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3 - Light: COLOR6, Dark: COLOR3 -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4 - Light: COLOR2, Dark: COLOR5 -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>`;

// 7-color: 3 lights, 3 darks
export const LOG_CABIN_7 = `
    <!-- Center hearth -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2 - Light: COLOR4, Dark: COLOR5 -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3 - Light: COLOR6, Dark: COLOR7 -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4 - Light: COLOR2, Dark: COLOR3 (cycle back) -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

// 8-color: 4 lights, 3 darks (each round unique)
export const LOG_CABIN_8 = `
    <!-- Center hearth -->
    <rect x="40" y="40" width="20" height="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 1 - Light: COLOR2, Dark: COLOR3 -->
    <rect x="60" y="40" width="10" height="20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="40" y="30" width="30" height="10" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="30" width="10" height="30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="60" width="40" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 2 - Light: COLOR4, Dark: COLOR5 -->
    <rect x="70" y="30" width="10" height="40" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="30" y="20" width="50" height="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="20" width="10" height="50" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="70" width="60" height="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 3 - Light: COLOR6, Dark: COLOR7 -->
    <rect x="80" y="20" width="10" height="60" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="20" y="10" width="70" height="10" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="10" width="10" height="70" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="80" width="80" height="10" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Round 4 - Light: COLOR8, Dark: COLOR3 -->
    <rect x="90" y="10" width="10" height="80" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <rect x="10" y="0" width="90" height="10" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="0" width="10" height="90" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="90" width="100" height="10" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

export const LOG_CABIN = LOG_CABIN_TEMPLATE;
