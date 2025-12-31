// Double Wedding Ring template
// Traditional interlocking rings pattern supporting 3-6 fabrics

export const DOUBLE_WEDDING_RING_TEMPLATE = `
    <!-- Background - shows through ring centers and between rings -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Horizontal ring arcs (top and bottom) - PRIMARY (COLOR2) -->
    <!-- Top arc - outer band -->
    <path d="M 15,0 C 15,20 30,32 50,32 C 70,32 85,20 85,0 L 85,8 C 85,24 70,36 50,36 C 30,36 15,24 15,8 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc - inner band (Contrast if 5+ fabrics, else Primary) -->
    <path d="M 18,8 C 18,22 32,33 50,33 C 68,33 82,22 82,8 L 82,12 C 82,26 68,37 50,37 C 32,37 18,26 18,12 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.3"/>
    
    <!-- Bottom arc - outer band -->
    <path d="M 15,100 C 15,80 30,68 50,68 C 70,68 85,80 85,100 L 85,92 C 85,76 70,64 50,64 C 30,64 15,76 15,92 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc - inner band (Contrast if 5+ fabrics, else Primary) -->
    <path d="M 18,92 C 18,78 32,67 50,67 C 68,67 82,78 82,92 L 82,88 C 82,74 68,63 50,63 C 32,63 18,74 18,88 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.3"/>
    
    <!-- Vertical ring arcs (left and right) - SECONDARY (COLOR3) -->
    <!-- Left arc - outer band -->
    <path d="M 0,15 C 20,15 32,30 32,50 C 32,70 20,85 0,85 L 8,85 C 24,85 36,70 36,50 C 36,30 24,15 8,15 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc - inner band (Additional if 6 fabrics, else Secondary) -->
    <path d="M 8,18 C 22,18 33,32 33,50 C 33,68 22,82 8,82 L 12,82 C 26,82 37,68 37,50 C 37,32 26,18 12,18 Z" fill="COLOR6" stroke="#ccc" stroke-width="0.3"/>
    
    <!-- Right arc - outer band -->
    <path d="M 100,15 C 80,15 68,30 68,50 C 68,70 80,85 100,85 L 92,85 C 76,85 64,70 64,50 C 64,30 76,15 92,15 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc - inner band (Additional if 6 fabrics, else Secondary) -->
    <path d="M 92,18 C 78,18 67,32 67,50 C 67,68 78,82 92,82 L 88,82 C 74,82 63,68 63,50 C 63,32 74,18 88,18 Z" fill="COLOR6" stroke="#ccc" stroke-width="0.3"/>
    
    <!-- Corner melon shapes - ACCENT (COLOR4) -->
    <path d="M 0,0 L 15,0 C 15,8 8,15 0,15 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,0 L 85,0 C 85,8 92,15 100,15 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 0,100 L 15,100 C 15,92 8,85 0,85 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,100 L 85,100 C 85,92 92,85 100,85 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const DOUBLE_WEDDING_RING = DOUBLE_WEDDING_RING_TEMPLATE;