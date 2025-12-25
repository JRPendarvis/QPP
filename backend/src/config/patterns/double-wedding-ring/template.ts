// Double Wedding Ring templates
// Traditional interlocking rings pattern

// 3-color version (minimum)
export const DOUBLE_WEDDING_RING_TEMPLATE = `
    <!-- Background - shows through ring centers and between rings -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Horizontal ring arcs (top and bottom) - COLOR2 -->
    <path d="M 15,0 C 15,20 30,32 50,32 C 70,32 85,20 85,0 L 85,12 C 85,28 70,42 50,42 C 30,42 15,28 15,12 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 15,100 C 15,80 30,68 50,68 C 70,68 85,80 85,100 L 85,88 C 85,72 70,58 50,58 C 30,58 15,72 15,88 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Vertical ring arcs (left and right) - COLOR3 -->
    <path d="M 0,15 C 20,15 32,30 32,50 C 32,70 20,85 0,85 L 12,85 C 28,85 42,70 42,50 C 42,30 28,15 12,15 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,15 C 80,15 68,30 68,50 C 68,70 80,85 100,85 L 88,85 C 72,85 58,70 58,50 C 58,30 72,15 88,15 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melon shapes - where rings would overlap when tiled - COLOR2 -->
    <path d="M 0,0 L 15,0 C 15,8 8,15 0,15 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,0 L 85,0 C 85,8 92,15 100,15 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 0,100 L 15,100 C 15,92 8,85 0,85 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,100 L 85,100 C 85,92 92,85 100,85 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>`;

// 4-color version - adds accent color for melon connectors
export const DOUBLE_WEDDING_RING_4 = `
    <!-- Background - shows through ring centers and between rings -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Horizontal ring arcs (top and bottom) - COLOR2 -->
    <path d="M 15,0 C 15,20 30,32 50,32 C 70,32 85,20 85,0 L 85,12 C 85,28 70,42 50,42 C 30,42 15,28 15,12 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 15,100 C 15,80 30,68 50,68 C 70,68 85,80 85,100 L 85,88 C 85,72 70,58 50,58 C 30,58 15,72 15,88 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Vertical ring arcs (left and right) - COLOR3 -->
    <path d="M 0,15 C 20,15 32,30 32,50 C 32,70 20,85 0,85 L 12,85 C 28,85 42,70 42,50 C 42,30 28,15 12,15 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,15 C 80,15 68,30 68,50 C 68,70 80,85 100,85 L 88,85 C 72,85 58,70 58,50 C 58,30 72,15 88,15 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melon shapes - accent color for visual interest - COLOR4 -->
    <path d="M 0,0 L 15,0 C 15,8 8,15 0,15 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,0 L 85,0 C 85,8 92,15 100,15 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 0,100 L 15,100 C 15,92 8,85 0,85 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,100 L 85,100 C 85,92 92,85 100,85 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const DOUBLE_WEDDING_RING = DOUBLE_WEDDING_RING_TEMPLATE;