export const PINWHEEL = `
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

export const PINWHEEL_3 = `
    <!-- 3-color: opposite blade pairs + background -->
    <!-- Top-left HST - COLOR1 blade -->
    <polygon points="0,0 50,0 0,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right HST - COLOR2 blade -->
    <polygon points="50,0 100,0 100,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 100,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left HST - COLOR2 blade -->
    <polygon points="0,50 0,100 50,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 50,50 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right HST - COLOR1 blade -->
    <polygon points="100,50 100,100 50,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 100,50 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL_4 = `
    <!-- 4-color: each blade unique, alternating backgrounds -->
    <!-- Top-left HST - COLOR1 blade -->
    <polygon points="0,0 50,0 0,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 0,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right HST - COLOR2 blade -->
    <polygon points="50,0 100,0 100,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 100,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left HST - COLOR2 blade -->
    <polygon points="0,50 0,100 50,100" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 50,50 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right HST - COLOR1 blade -->
    <polygon points="100,50 100,100 50,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 100,50 50,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL_5 = `
    <!-- 5-color: 2x2 pinwheel units -->
    <!-- Top-left pinwheel: COLOR1/COLOR2 -->
    <polygon points="0,0 25,0 0,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 0,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 50,0 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 0,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 25,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,25 50,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right pinwheel: COLOR3/COLOR4 -->
    <polygon points="50,0 75,0 50,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 100,0 100,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 100,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 75,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,25 100,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,25 100,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left pinwheel: COLOR3/COLOR5 -->
    <polygon points="0,50 25,50 0,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 0,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 50,50 50,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 50,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 0,100 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 25,75 25,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,75 50,75 25,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right pinwheel: COLOR1/COLOR2 -->
    <polygon points="50,50 75,50 50,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 50,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 100,50 100,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 100,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 75,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 75,75 75,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,75 100,100 75,100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,75 100,75 75,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL_6 = `
    <!-- 6-color: 2x2 pinwheel units, 3 unique pairs -->
    <!-- Top-left pinwheel: COLOR1/COLOR2 -->
    <polygon points="0,0 25,0 0,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 0,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 50,0 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 0,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 25,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,25 50,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right pinwheel: COLOR3/COLOR4 -->
    <polygon points="50,0 75,0 50,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 100,0 100,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 100,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 75,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,25 100,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,25 100,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left pinwheel: COLOR5/COLOR6 -->
    <polygon points="0,50 25,50 0,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 0,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 50,50 50,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 50,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 0,100 25,100" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 25,75 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 25,100" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,75 50,75 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right pinwheel: COLOR3/COLOR4 -->
    <polygon points="50,50 75,50 50,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 50,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 100,50 100,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 100,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 75,100" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 75,75 75,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,75 100,100 75,100" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,75 100,75 75,100" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL_7 = `
    <!-- 7-color: 2x2 pinwheel units -->
    <!-- Top-left pinwheel: COLOR1/COLOR2 -->
    <polygon points="0,0 25,0 0,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 0,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 50,0 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 0,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 25,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,25 50,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right pinwheel: COLOR3/COLOR4 -->
    <polygon points="50,0 75,0 50,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 100,0 100,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 100,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 75,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,25 100,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,25 100,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left pinwheel: COLOR5/COLOR6 -->
    <polygon points="0,50 25,50 0,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 0,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 50,50 50,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 50,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 0,100 25,100" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 25,75 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 25,100" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,75 50,75 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right pinwheel: COLOR7/COLOR1 -->
    <polygon points="50,50 75,50 50,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 50,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 100,50 100,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 100,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 75,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 75,75 75,100" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,75 100,100 75,100" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,75 100,75 75,100" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>`;

export const PINWHEEL_8 = `
    <!-- 8-color: 2x2 pinwheel units, 4 unique pairs -->
    <!-- Top-left pinwheel: COLOR1/COLOR2 -->
    <polygon points="0,0 25,0 0,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 0,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 50,0 50,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,0 25,25 50,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 0,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,25 25,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 25,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,25 50,25 25,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right pinwheel: COLOR3/COLOR4 -->
    <polygon points="50,0 75,0 50,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 50,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 100,0 100,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,0 75,25 100,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 50,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,25 75,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,25 100,50 75,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,25 100,25 75,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left pinwheel: COLOR5/COLOR6 -->
    <polygon points="0,50 25,50 0,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 0,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 50,50 50,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,50 25,75 50,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 0,100 25,100" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,75 25,75 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 25,100" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="25,75 50,75 25,100" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right pinwheel: COLOR7/COLOR8 -->
    <polygon points="50,50 75,50 50,75" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 50,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 100,50 100,75" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,50 75,75 100,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 50,100 75,100" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,75 75,75 75,100" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,75 100,100 75,100" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="75,75 100,75 75,100" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>`;