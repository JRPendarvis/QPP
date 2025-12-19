export const FOUR_PATCH_2 = `
    <!-- Single four-patch: 2 colors on opposite diagonals -->
    <rect x="0" y="0" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="0" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="50" width="50" height="50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="50" width="50" height="50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH_3 = `
    <!-- 2x2 four-patch units: COLOR1/COLOR2 and COLOR1/COLOR3 alternating -->
    <!-- Top-left unit: COLOR1/COLOR2 -->
    <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="25" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right unit: COLOR1/COLOR3 -->
    <rect x="50" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="25" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left unit: COLOR1/COLOR3 -->
    <rect x="0" y="50" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right unit: COLOR1/COLOR2 -->
    <rect x="50" y="50" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="50" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH_4 = `
    <!-- 2x2 four-patch units: each unit uses a unique pair -->
    <!-- Top-left unit: COLOR1/COLOR2 -->
    <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="25" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right unit: COLOR3/COLOR4 -->
    <rect x="50" y="0" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="25" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="25" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left unit: COLOR3/COLOR4 -->
    <rect x="0" y="50" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right unit: COLOR1/COLOR2 -->
    <rect x="50" y="50" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="50" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH_5 = `
    <!-- 2x2 four-patch units: 5 colors, COLOR5 pairs with COLOR1 -->
    <!-- Top-left unit: COLOR1/COLOR2 -->
    <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="25" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right unit: COLOR3/COLOR4 -->
    <rect x="50" y="0" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="25" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="25" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left unit: COLOR5/COLOR1 -->
    <rect x="0" y="50" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right unit: COLOR2/COLOR3 -->
    <rect x="50" y="50" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="50" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="75" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH_6 = `
    <!-- 2x2 four-patch units: 6 colors, 3 pairs -->
    <!-- Top-left unit: COLOR1/COLOR2 -->
    <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="25" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right unit: COLOR3/COLOR4 -->
    <rect x="50" y="0" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="25" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="25" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left unit: COLOR5/COLOR6 -->
    <rect x="0" y="50" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right unit: COLOR1/COLOR3 -->
    <rect x="50" y="50" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="50" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="75" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH_7 = `
    <!-- 2x2 four-patch units: 7 colors -->
    <!-- Top-left unit: COLOR1/COLOR2 -->
    <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="25" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right unit: COLOR3/COLOR4 -->
    <rect x="50" y="0" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="25" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="25" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left unit: COLOR5/COLOR6 -->
    <rect x="0" y="50" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right unit: COLOR7/COLOR1 -->
    <rect x="50" y="50" width="25" height="25" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="50" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="75" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>`;

export const FOUR_PATCH_8 = `
    <!-- 2x2 four-patch units: 8 colors, 4 unique pairs -->
    <!-- Top-left unit: COLOR1/COLOR2 -->
    <rect x="0" y="0" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="0" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="25" width="25" height="25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right unit: COLOR3/COLOR4 -->
    <rect x="50" y="0" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="0" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="25" width="25" height="25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="25" width="25" height="25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left unit: COLOR5/COLOR6 -->
    <rect x="0" y="50" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="75" width="25" height="25" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right unit: COLOR7/COLOR8 -->
    <rect x="50" y="50" width="25" height="25" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="50" width="25" height="25" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <rect x="50" y="75" width="25" height="25" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <rect x="75" y="75" width="25" height="25" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>`;