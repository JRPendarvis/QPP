export const FOUR_PATCH_TEMPLATE = `
    <!-- Single four-patch: 2 colors on opposite diagonals -->
    <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH = FOUR_PATCH_TEMPLATE;