// template.ts
export const STRIP_QUILT_TEMPLATE = `
    <!-- Strip Quilt: 4 equal vertical strips (governed mapping from 3–8 fabrics) -->
    <!-- Strip 1 - BACKGROUND (COLOR1) -->
    <rect x="0" y="0" width="25" height="100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Strip 2 - PRIMARY (COLOR2) -->
    <rect x="25" y="0" width="25" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Strip 3 - SECONDARY (COLOR3) -->
    <rect x="50" y="0" width="25" height="100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Strip 4 - ACCENT (COLOR4) -->
    <rect x="75" y="0" width="25" height="100" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const STRIP_QUILT = STRIP_QUILT_TEMPLATE;
