export const PICKLE_DISH = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <!-- Center circle -->
    <circle cx="50" cy="50" r="20" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Curved petals radiating outward -->
    <path d="M 50,30 Q 50,10 30,20 Q 35,35 50,30 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 70,30 Q 90,10 70,20 Q 65,35 70,30 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 70,70 Q 90,90 70,80 Q 65,65 70,70 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 30,70 Q 10,90 30,80 Q 35,65 30,70 Z" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <!-- Additional petal details -->
    <path d="M 50,20 Q 30,5 20,15 Q 35,25 50,20 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 80,50 Q 95,30 85,20 Q 75,35 80,50 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 50,80 Q 70,95 80,85 Q 65,75 50,80 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <path d="M 20,50 Q 5,70 15,80 Q 25,65 20,50 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>`;
    
export const PICKLE_DISH_3 = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR3"/>
    
    <!-- Top arc with spikes -->
    <path d="M 15,15 Q 50,0 85,15 L 80,25 Q 50,12 20,25 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc spikes -->
    <polygon points="25,20 32,5 39,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="45,18 50,2 55,18" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="61,20 68,5 75,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc with spikes -->
    <path d="M 85,15 Q 100,50 85,85 L 75,80 Q 88,50 75,20 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc spikes -->
    <polygon points="80,25 95,32 80,39" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,45 98,50 82,55" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,61 95,68 80,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc with spikes -->
    <path d="M 85,85 Q 50,100 15,85 L 20,75 Q 50,88 80,75 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc spikes -->
    <polygon points="75,80 68,95 61,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,82 50,98 45,82" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="39,80 32,95 25,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc with spikes -->
    <path d="M 15,85 Q 0,50 15,15 L 25,20 Q 12,50 25,80 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc spikes -->
    <polygon points="20,75 5,68 20,61" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,55 2,50 18,45" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,39 5,32 20,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melons -->
    <ellipse cx="15" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="15" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center opening -->
    <ellipse cx="50" cy="50" rx="18" ry="18" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>`;

export const PICKLE_DISH_4 = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR4"/>
    
    <!-- Top arc with spikes -->
    <path d="M 15,15 Q 50,0 85,15 L 80,25 Q 50,12 20,25 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc spikes - alternating -->
    <polygon points="25,20 32,5 39,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="45,18 50,2 55,18" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="61,20 68,5 75,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc with spikes -->
    <path d="M 85,15 Q 100,50 85,85 L 75,80 Q 88,50 75,20 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc spikes - alternating -->
    <polygon points="80,25 95,32 80,39" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,45 98,50 82,55" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,61 95,68 80,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc with spikes -->
    <path d="M 85,85 Q 50,100 15,85 L 20,75 Q 50,88 80,75 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc spikes - alternating -->
    <polygon points="75,80 68,95 61,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,82 50,98 45,82" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="39,80 32,95 25,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc with spikes -->
    <path d="M 15,85 Q 0,50 15,15 L 25,20 Q 12,50 25,80 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc spikes - alternating -->
    <polygon points="20,75 5,68 20,61" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,55 2,50 18,45" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,39 5,32 20,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melons -->
    <ellipse cx="15" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="15" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center opening -->
    <ellipse cx="50" cy="50" rx="18" ry="18" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>`;

export const PICKLE_DISH_5 = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR5"/>
    
    <!-- Top arc with spikes -->
    <path d="M 15,15 Q 50,0 85,15 L 80,25 Q 50,12 20,25 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc spikes -->
    <polygon points="25,20 32,5 39,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="45,18 50,2 55,18" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="61,20 68,5 75,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc with spikes -->
    <path d="M 85,15 Q 100,50 85,85 L 75,80 Q 88,50 75,20 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc spikes -->
    <polygon points="80,25 95,32 80,39" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,45 98,50 82,55" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,61 95,68 80,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc with spikes -->
    <path d="M 85,85 Q 50,100 15,85 L 20,75 Q 50,88 80,75 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc spikes -->
    <polygon points="75,80 68,95 61,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,82 50,98 45,82" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="39,80 32,95 25,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc with spikes -->
    <path d="M 15,85 Q 0,50 15,15 L 25,20 Q 12,50 25,80 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc spikes -->
    <polygon points="20,75 5,68 20,61" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,55 2,50 18,45" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,39 5,32 20,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melons -->
    <ellipse cx="15" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="15" rx="10" ry="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="15" cy="85" rx="10" ry="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center opening -->
    <ellipse cx="50" cy="50" rx="18" ry="18" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>`;

export const PICKLE_DISH_6 = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR6"/>
    
    <!-- Top arc with spikes -->
    <path d="M 15,15 Q 50,0 85,15 L 80,25 Q 50,12 20,25 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc spikes -->
    <polygon points="25,20 32,5 39,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="45,18 50,2 55,18" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="61,20 68,5 75,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc with spikes -->
    <path d="M 85,15 Q 100,50 85,85 L 75,80 Q 88,50 75,20 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc spikes -->
    <polygon points="80,25 95,32 80,39" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,45 98,50 82,55" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,61 95,68 80,75" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc with spikes -->
    <path d="M 85,85 Q 50,100 15,85 L 20,75 Q 50,88 80,75 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc spikes -->
    <polygon points="75,80 68,95 61,80" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,82 50,98 45,82" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="39,80 32,95 25,80" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc with spikes -->
    <path d="M 15,85 Q 0,50 15,15 L 25,20 Q 12,50 25,80 Z" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc spikes -->
    <polygon points="20,75 5,68 20,61" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,55 2,50 18,45" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,39 5,32 20,25" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melons -->
    <ellipse cx="15" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="15" rx="10" ry="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="15" cy="85" rx="10" ry="10" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center opening -->
    <ellipse cx="50" cy="50" rx="18" ry="18" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>`;

export const PICKLE_DISH_7 = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR7"/>
    
    <!-- Top arc with spikes -->
    <path d="M 15,15 Q 50,0 85,15 L 80,25 Q 50,12 20,25 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc spikes -->
    <polygon points="25,20 32,5 39,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="45,18 50,2 55,18" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="61,20 68,5 75,20" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc with spikes -->
    <path d="M 85,15 Q 100,50 85,85 L 75,80 Q 88,50 75,20 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc spikes -->
    <polygon points="80,25 95,32 80,39" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,45 98,50 82,55" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,61 95,68 80,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc with spikes -->
    <path d="M 85,85 Q 50,100 15,85 L 20,75 Q 50,88 80,75 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc spikes -->
    <polygon points="75,80 68,95 61,80" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,82 50,98 45,82" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="39,80 32,95 25,80" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc with spikes -->
    <path d="M 15,85 Q 0,50 15,15 L 25,20 Q 12,50 25,80 Z" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc spikes -->
    <polygon points="20,75 5,68 20,61" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,55 2,50 18,45" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,39 5,32 20,25" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melons -->
    <ellipse cx="15" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="15" rx="10" ry="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="15" cy="85" rx="10" ry="10" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="85" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center opening -->
    <ellipse cx="50" cy="50" rx="18" ry="18" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>`;

export const PICKLE_DISH_8 = `
    <!-- Background -->
    <rect x="0" y="0" width="100" height="100" fill="COLOR8"/>
    
    <!-- Top arc with spikes -->
    <path d="M 15,15 Q 50,0 85,15 L 80,25 Q 50,12 20,25 Z" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <!-- Top arc spikes -->
    <polygon points="25,20 32,5 39,20" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="45,18 50,2 55,18" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="61,20 68,5 75,20" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Right arc with spikes -->
    <path d="M 85,15 Q 100,50 85,85 L 75,80 Q 88,50 75,20 Z" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <!-- Right arc spikes -->
    <polygon points="80,25 95,32 80,39" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="82,45 98,50 82,55" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="80,61 95,68 80,75" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Bottom arc with spikes -->
    <path d="M 85,85 Q 50,100 15,85 L 20,75 Q 50,88 80,75 Z" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    <!-- Bottom arc spikes -->
    <polygon points="75,80 68,95 61,80" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="55,82 50,98 45,82" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="39,80 32,95 25,80" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Left arc with spikes -->
    <path d="M 15,85 Q 0,50 15,15 L 25,20 Q 12,50 25,80 Z" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <!-- Left arc spikes -->
    <polygon points="20,75 5,68 20,61" fill="COLOR2" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="18,55 2,50 18,45" fill="COLOR3" stroke="#ccc" stroke-width="0.5"/>
    <polygon points="20,39 5,32 20,25" fill="COLOR4" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Corner melons -->
    <ellipse cx="15" cy="15" rx="10" ry="10" fill="COLOR1" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="15" rx="10" ry="10" fill="COLOR5" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="15" cy="85" rx="10" ry="10" fill="COLOR7" stroke="#ccc" stroke-width="0.5"/>
    <ellipse cx="85" cy="85" rx="10" ry="10" fill="COLOR6" stroke="#ccc" stroke-width="0.5"/>
    
    <!-- Center opening -->
    <ellipse cx="50" cy="50" rx="18" ry="18" fill="COLOR8" stroke="#ccc" stroke-width="0.5"/>`;