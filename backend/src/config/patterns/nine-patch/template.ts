export const NINE_PATCH_TEMPLATE = `
    <!-- Classic 2-color: COLOR1 on corners+center, COLOR2 on edges -->
    <rect x="0" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="0" width="33.34" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.67" y="0" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="33.33" width="33.33" height="33.34" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="33.33" width="33.34" height="33.34" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.67" y="33.33" width="33.33" height="33.34" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="0" y="66.67" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <rect x="33.33" y="66.67" width="33.34" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <rect x="66.67" y="66.67" width="33.33" height="33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;
    export const NINE_PATCH = NINE_PATCH_TEMPLATE;