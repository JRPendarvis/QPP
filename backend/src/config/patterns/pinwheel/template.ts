
export const PINWHEEL_TEMPLATE = `
    <!-- 2-color: COLOR1 blades spinning, COLOR2 background -->
    <!-- Top-left HST -->
    <polygon points="0,0 50,0 0,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right HST -->
    <polygon points="50,0 100,0 100,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 100,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left HST -->
    <polygon points="0,50 0,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 50,50 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right HST -->
    <polygon points="100,50 100,100 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 100,50 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL = PINWHEEL_TEMPLATE;