/**
 * QuiltPattern interface
 * Represents a generated quilt pattern with all its metadata
 */
import { Border, BorderConfiguration, BorderDimensions } from './Border';

export interface QuiltPattern {
  id?: string;
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
  fabricRequirements?: FabricRequirement[];
  
  // Border configuration and dimensions
  borderConfiguration?: BorderConfiguration;
  borderDimensions?: BorderDimensions;
}

export interface FabricRequirement {
  role: string;
  yards: number;
  description: string;
  inches?: number; // For binding - total inches needed
}
