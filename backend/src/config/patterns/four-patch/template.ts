// Four Patch templates
// Classic 2x2 grid block - each block has 4 squares
// With multiple colors, blocks can have varied combinations

// Base template - uses COLOR1-COLOR4 for the four squares
// This allows each quadrant to potentially be different
export const FOUR_PATCH_TEMPLATE = `
    <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="50" width="50" height="50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="50" width="50" height="50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH = FOUR_PATCH_TEMPLATE;