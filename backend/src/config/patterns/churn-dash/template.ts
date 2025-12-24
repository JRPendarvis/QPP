export const CHURN_DASH_TEMPLATE = `
    <!-- Center square - BACKGROUND -->
    <rect x="33.33" y="33.33" width="33.34" height="33.34" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top dash - PRIMARY (solid) -->
    <rect x="33.33" y="0" width="33.34" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom dash - PRIMARY (solid) -->
    <rect x="33.33" y="66.67" width="33.34" height="33.33" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left dash - PRIMARY (solid) -->
    <rect x="0" y="33.33" width="33.33" height="33.34" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right dash - PRIMARY (solid) -->
    <rect x="66.67" y="33.33" width="33.33" height="33.34" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top-left corner HST (outer=accent, inner=background) -->
    <polygon points="0,0 33.33,0 0,33.33" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="33.33,0 33.33,33.33 0,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Top-right corner HST (outer=accent, inner=background) -->
    <polygon points="66.67,0 100,0 100,33.33" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,0 66.67,33.33 100,33.33" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-left corner HST (outer=accent, inner=background) -->
    <polygon points="0,66.67 0,100 33.33,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,66.67 33.33,66.67 33.33,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom-right corner HST (outer=accent, inner=background) -->
    <polygon points="100,66.67 100,100 66.67,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="66.67,66.67 100,66.67 66.67,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const CHURN_DASH = CHURN_DASH_TEMPLATE;