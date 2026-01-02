// Double Wedding Ring template - SOLID CURVED BANDS
// Each arc is a solid curved band with color divisions suggested by strokes

export const DOUBLE_WEDDING_RING_TEMPLATE = `
  <!-- Background -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
  
  <!-- TOP ARC - Solid curved band -->
  <!-- Outer curve -->
  <path d="M 0,50 Q 15,10 50,0 Q 85,10 100,50 L 95,50 Q 90,15 50,7 Q 10,15 5,50 Z" 
        fill="COLOR2" stroke="none"/>
  
  <!-- Inner background cutout to create ring opening -->
  <path d="M 10,50 Q 15,20 50,12 Q 85,20 90,50 L 95,50 Q 90,15 50,7 Q 10,15 5,50 Z" 
        fill="COLOR1" stroke="none"/>
  
  <!-- Wedge division lines (visual only) -->
  <line x1="12" y1="35" x2="15" y2="45" stroke="COLOR3" stroke-width="3"/>
  <line x1="20" y1="20" x2="23" y2="28" stroke="COLOR5" stroke-width="3"/>
  <line x1="30" y1="10" x2="32" y2="17" stroke="COLOR3" stroke-width="3"/>
  <line x1="40" y1="5" x2="42" y2="11" stroke="COLOR5" stroke-width="3"/>
  <line x1="50" y1="3" x2="50" y2="9" stroke="COLOR3" stroke-width="3"/>
  <line x1="58" y1="5" x2="60" y2="11" stroke="COLOR5" stroke-width="3"/>
  <line x1="68" y1="10" x2="70" y2="17" stroke="COLOR3" stroke-width="3"/>
  <line x1="77" y1="20" x2="80" y2="28" stroke="COLOR5" stroke-width="3"/>
  <line x1="85" y1="35" x2="88" y2="45" stroke="COLOR3" stroke-width="3"/>
  
  <!-- BOTTOM ARC - Solid curved band -->
  <path d="M 0,50 Q 15,90 50,100 Q 85,90 100,50 L 95,50 Q 90,85 50,93 Q 10,85 5,50 Z" 
        fill="COLOR2" stroke="none"/>
  
  <!-- Inner background cutout -->
  <path d="M 10,50 Q 15,80 50,88 Q 85,80 90,50 L 95,50 Q 90,85 50,93 Q 10,85 5,50 Z" 
        fill="COLOR1" stroke="none"/>
  
  <!-- Wedge division lines -->
  <line x1="12" y1="65" x2="15" y2="55" stroke="COLOR6" stroke-width="3"/>
  <line x1="20" y1="80" x2="23" y2="72" stroke="COLOR5" stroke-width="3"/>
  <line x1="30" y1="90" x2="32" y2="83" stroke="COLOR6" stroke-width="3"/>
  <line x1="40" y1="95" x2="42" y2="89" stroke="COLOR5" stroke-width="3"/>
  <line x1="50" y1="97" x2="50" y2="91" stroke="COLOR6" stroke-width="3"/>
  <line x1="58" y1="95" x2="60" y2="89" stroke="COLOR5" stroke-width="3"/>
  <line x1="68" y1="90" x2="70" y2="83" stroke="COLOR6" stroke-width="3"/>
  <line x1="77" y1="80" x2="80" y2="72" stroke="COLOR5" stroke-width="3"/>
  <line x1="85" y1="65" x2="88" y2="55" stroke="COLOR6" stroke-width="3"/>
  
  <!-- LEFT ARC - Solid curved band -->
  <path d="M 50,0 Q 10,15 0,50 Q 10,85 50,100 L 50,95 Q 15,90 7,50 Q 15,10 50,5 Z" 
        fill="COLOR3" stroke="none"/>
  
  <!-- Inner background cutout -->
  <path d="M 50,10 Q 20,15 12,50 Q 20,85 50,90 L 50,95 Q 15,90 7,50 Q 15,10 50,5 Z" 
        fill="COLOR1" stroke="none"/>
  
  <!-- Wedge division lines -->
  <line x1="35" y1="12" x2="45" y2="15" stroke="COLOR2" stroke-width="3"/>
  <line x1="20" y1="20" x2="28" y2="23" stroke="COLOR5" stroke-width="3"/>
  <line x1="10" y1="30" x2="17" y2="32" stroke="COLOR2" stroke-width="3"/>
  <line x1="5" y1="40" x2="11" y2="42" stroke="COLOR5" stroke-width="3"/>
  <line x1="3" y1="50" x2="9" y2="50" stroke="COLOR2" stroke-width="3"/>
  <line x1="5" y1="58" x2="11" y2="60" stroke="COLOR5" stroke-width="3"/>
  <line x1="10" y1="68" x2="17" y2="70" stroke="COLOR2" stroke-width="3"/>
  <line x1="20" y1="77" x2="28" y2="80" stroke="COLOR5" stroke-width="3"/>
  <line x1="35" y1="85" x2="45" y2="88" stroke="COLOR2" stroke-width="3"/>
  
  <!-- RIGHT ARC - Solid curved band -->
  <path d="M 50,0 Q 90,15 100,50 Q 90,85 50,100 L 50,95 Q 85,90 93,50 Q 85,10 50,5 Z" 
        fill="COLOR6" stroke="none"/>
  
  <!-- Inner background cutout -->
  <path d="M 50,10 Q 80,15 88,50 Q 80,85 50,90 L 50,95 Q 85,90 93,50 Q 85,10 50,5 Z" 
        fill="COLOR1" stroke="none"/>
  
  <!-- Wedge division lines -->
  <line x1="65" y1="12" x2="55" y2="15" stroke="COLOR2" stroke-width="3"/>
  <line x1="80" y1="20" x2="72" y2="23" stroke="COLOR5" stroke-width="3"/>
  <line x1="90" y1="30" x2="83" y2="32" stroke="COLOR2" stroke-width="3"/>
  <line x1="95" y1="40" x2="89" y2="42" stroke="COLOR5" stroke-width="3"/>
  <line x1="97" y1="50" x2="91" y2="50" stroke="COLOR2" stroke-width="3"/>
  <line x1="95" y1="58" x2="89" y2="60" stroke="COLOR5" stroke-width="3"/>
  <line x1="90" y1="68" x2="83" y2="70" stroke="COLOR2" stroke-width="3"/>
  <line x1="80" y1="77" x2="72" y2="80" stroke="COLOR5" stroke-width="3"/>
  <line x1="65" y1="85" x2="55" y2="88" stroke="COLOR2" stroke-width="3"/>
  
  <!-- MELONS at edge midpoints -->
  <ellipse cx="50" cy="0" rx="12" ry="8" 
           fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  
  <ellipse cx="100" cy="50" rx="8" ry="12" 
           fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  
  <ellipse cx="50" cy="100" rx="12" ry="8" 
           fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  
  <ellipse cx="0" cy="50" rx="8" ry="12" 
           fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
  
  <!-- Center square -->
  <rect x="45" y="45" width="10" height="10" 
        fill="COLOR4" stroke="#ccc" stroke-width="0.3"/>`;

export const DOUBLE_WEDDING_RING = DOUBLE_WEDDING_RING_TEMPLATE;