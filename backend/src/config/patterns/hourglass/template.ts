export const HOURGLASS_TEMPLATE = `
    <!-- Hourglass: COLOR1 = top-left + bottom-right diagonal, COLOR2 = top-right + bottom-left diagonal (hourglass) -->
    <polygon points="0,0 100,0 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,100 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 0,100 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS = HOURGLASS_TEMPLATE;