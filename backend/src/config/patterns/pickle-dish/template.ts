export const PICKLE_DISH_TEMPLATE = `
    <!-- Background - COLOR1 -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
    
    <!-- Top arc band with spikes - COLOR2 arc, COLOR3 spikes -->
    <path d="M 15,8 C 15,25 30,38 50,38 C 70,38 85,25 85,8 L 85,18 C 85,32 70,45 50,45 C 30,45 15,32 15,18 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top spikes -->
    <polygon points="20,8 25,0 30,8" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="35,6 40,0 45,6" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,5 55,0 60,5" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,6 60,0 65,6" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="70,8 75,0 80,8" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc band with spikes -->
    <path d="M 15,92 C 15,75 30,62 50,62 C 70,62 85,75 85,92 L 85,82 C 85,68 70,55 50,55 C 30,55 15,68 15,82 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom spikes -->
    <polygon points="20,92 25,100 30,92" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="35,94 40,100 45,94" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="50,95 55,100 60,95" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,94 60,100 65,94" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="70,92 75,100 80,92" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc band with spikes -->
    <path d="M 8,15 C 25,15 38,30 38,50 C 38,70 25,85 8,85 L 18,85 C 32,85 45,70 45,50 C 45,30 32,15 18,15 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left spikes -->
    <polygon points="8,20 0,25 8,30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="6,35 0,40 6,45" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="5,50 0,55 5,60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="6,55 0,60 6,65" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="8,70 0,75 8,80" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc band with spikes -->
    <path d="M 92,15 C 75,15 62,30 62,50 C 62,70 75,85 92,85 L 82,85 C 68,85 55,70 55,50 C 55,30 68,15 82,15 Z" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right spikes -->
    <polygon points="92,20 100,25 92,30" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="94,35 100,40 94,45" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="95,50 100,55 95,60" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="94,55 100,60 94,65" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="92,70 100,75 92,80" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melon shapes - COLOR4 -->
    <path d="M 0,0 L 15,0 C 10,5 5,10 0,15 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,0 L 85,0 C 90,5 95,10 100,15 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 0,100 L 15,100 C 10,95 5,90 0,85 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 100,100 L 85,100 C 90,95 95,90 100,85 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const PICKLE_DISH = PICKLE_DISH_TEMPLATE;