export const DRUNKARDS_PATH_TEMPLATE = `
    <!-- Background with concave curve - BACKGROUND (COLOR1) -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Quarter-circle "pie slice" path anchored at top-left corner - PRIMARY/path (COLOR2) -->
    <path d="M 0,0 L 0,100 A 100,100 0 0,0 100,0 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const DRUNKARDS_PATH = DRUNKARDS_PATH_TEMPLATE;