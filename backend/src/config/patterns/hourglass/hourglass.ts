export const HOURGLASS = `
    <!-- 2-color: Top+Bottom = COLOR1, Left+Right = COLOR2 -->
    <polygon points="0,0 100,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,100 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 0,100 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,0 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS_3 = `
    <!-- 3-color: Top = COLOR1, Bottom = COLOR2, Left+Right = COLOR3 -->
    <polygon points="0,0 100,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,100 50,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 0,100 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,0 50,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS_4 = `
    <!-- 4-color: Each triangle unique -->
    <polygon points="0,0 100,0 50,50" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,100 50,50" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 0,100 50,50" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,0 50,50" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS_5 = `
    <!-- 5-color: 2x2 hourglass units -->
    <!-- Top-left hourglass -->
    <polygon points="0,0 50,0 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 0,50 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,0 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right hourglass -->
    <polygon points="50,0 100,0 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,50 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 50,50 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,0 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left hourglass -->
    <polygon points="0,50 50,50 25,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,100 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 0,100 25,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,50 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right hourglass -->
    <polygon points="50,50 100,50 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 100,100 75,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 50,100 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 50,50 75,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS_6 = `
    <!-- 6-color: 2x2 hourglass units with more variety -->
    <!-- Top-left hourglass: COLOR1/COLOR2 -->
    <polygon points="0,0 50,0 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 0,50 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,0 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right hourglass: COLOR3/COLOR4 -->
    <polygon points="50,0 100,0 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,50 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 50,50 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,0 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left hourglass: COLOR5/COLOR6 -->
    <polygon points="0,50 50,50 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,100 25,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 0,100 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,50 25,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right hourglass: COLOR3/COLOR4 -->
    <polygon points="50,50 100,50 75,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 100,100 75,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 50,100 75,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 50,50 75,75" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS_7 = `
    <!-- 7-color: 2x2 hourglass units, each unique pair + shared -->
    <!-- Top-left hourglass: COLOR1/COLOR2 -->
    <polygon points="0,0 50,0 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 0,50 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,0 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right hourglass: COLOR3/COLOR4 -->
    <polygon points="50,0 100,0 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,50 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 50,50 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,0 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left hourglass: COLOR5/COLOR6 -->
    <polygon points="0,50 50,50 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,100 25,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 0,100 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,50 25,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right hourglass: COLOR7/COLOR1 -->
    <polygon points="50,50 100,50 75,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 100,100 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 50,100 75,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 50,50 75,75" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;

export const HOURGLASS_8 = `
    <!-- 8-color: 2x2 hourglass units, 4 unique pairs -->
    <!-- Top-left hourglass: COLOR1/COLOR2 -->
    <polygon points="0,0 50,0 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,0 50,50 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 0,50 25,25" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,50 0,0 25,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top-right hourglass: COLOR3/COLOR4 -->
    <polygon points="50,0 100,0 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,0 100,50 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 50,50 75,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,0 75,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-left hourglass: COLOR5/COLOR6 -->
    <polygon points="0,50 50,50 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,50 50,100 25,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 0,100 25,75" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="0,100 0,50 25,75" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom-right hourglass: COLOR7/COLOR8 -->
    <polygon points="50,50 100,50 75,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,50 100,100 75,75" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="100,100 50,100 75,75" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,100 50,50 75,75" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>`;