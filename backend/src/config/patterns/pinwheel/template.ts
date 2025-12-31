export const PINWHEEL_TEMPLATE = `
    <!-- Pinwheel: 4 HSTs with blades spinning clockwise around center -->
    
    <!-- Top-left HST: BACKGROUND (top-left), PRIMARY blade (bottom-right) -->
    <polygon points="0,0 50,0 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 0,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top-right HST: BACKGROUND (top-right), PRIMARY blade (bottom-left) -->
    <polygon points="50,0 100,0 100,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 100,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-left HST: BACKGROUND (bottom-left), PRIMARY blade (top-right) -->
    <polygon points="0,50 0,100 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 50,50 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-right HST: BACKGROUND (bottom-right), PRIMARY blade (top-left) -->
    <polygon points="100,50 100,100 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 100,50 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL = PINWHEEL_TEMPLATE;