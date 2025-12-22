export const DRUNKARDS_PATH_TEMPLATE = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR2"/>
    
    <!-- Top-left corner: quarter circle -->
    <path d="M 0,0 L 0,25 A 25,25 0 0,1 25,0 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top-right corner: quarter circle -->
    <path d="M 100,0 L 75,0 A 25,25 0 0,1 100,25 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-left corner: quarter circle -->
    <path d="M 0,100 L 25,100 A 25,25 0 0,1 0,75 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-right corner: quarter circle -->
    <path d="M 100,100 L 100,75 A 25,25 0 0,1 75,100 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const DRUNKARDS_PATH = DRUNKARDS_PATH_TEMPLATE;