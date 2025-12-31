export const STORM_AT_SEA_TEMPLATE = `
  <!-- Background - BACKGROUND (COLOR1) - the "sea" -->
  <rect x="0" y="0" width="100" height="100" fill="COLOR1"/>
  
  <!-- Corner diamonds - PRIMARY waves (COLOR2) with SECONDARY centers (COLOR3) -->
  <polygon points="10,0 20,10 10,20 0,10" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="10,5 15,10 10,15 5,10" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="90,0 100,10 90,20 80,10" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="90,5 95,10 90,15 85,10" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="10,80 20,90 10,100 0,90" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="10,85 15,90 10,95 5,90" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="90,80 100,90 90,100 80,90" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="90,85 95,90 90,95 85,90" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  
  <!-- Side connector diamonds - PRIMARY waves (COLOR2) with SECONDARY centers (COLOR3) -->
  <polygon points="20,10 50,0 80,10 50,20" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="35,10 50,4 65,10 50,16" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="20,90 50,80 80,90 50,100" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="35,90 50,84 65,90 50,96" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="10,20 20,50 10,80 0,50" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="10,35 16,50 10,65 4,50" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="90,20 100,50 90,80 80,50" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="90,35 96,50 90,65 84,50" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>
  
  <!-- Center diamond - PRIMARY wave (COLOR2) with SECONDARY center (COLOR3) -->
  <polygon points="50,20 80,50 50,80 20,50" fill="COLOR2" stroke="#ccc" stroke-width="0.3"/>
  <polygon points="50,32 68,50 50,68 32,50" fill="COLOR3" stroke="#ccc" stroke-width="0.3"/>`;

export const STORM_AT_SEA = STORM_AT_SEA_TEMPLATE;