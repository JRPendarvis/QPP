/**
 * Fabric analysis information from Claude
 */
export interface FabricAnalysis {
  fabricIndex: number;
  description: string;
  type: 'printed' | 'solid';
  value: 'light' | 'medium' | 'dark';
  printScale: 'solid' | 'small' | 'medium' | 'large';
  dominantColor: string;
  role?: string;
  recommendedRole?: 'background' | 'primary' | 'secondary' | 'accent';
  roleReason?: string;
}

/**
 * Parsed response from Claude API
 */
export interface ClaudeResponse {
  patternName: string;
  description: string;
  fabricLayout: string;
  estimatedSize: string;
  instructions: string[];
  fabricColors?: string[];
  fabricAnalysis?: FabricAnalysis[];
}

/**
 * Fabric object with color, type, and image data
 */
export interface Fabric {
  color: string;
  type: 'printed' | 'solid';
  image: string;
}
