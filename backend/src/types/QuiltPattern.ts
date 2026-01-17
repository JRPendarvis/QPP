// types/QuiltPattern.ts
import { Border, BorderConfiguration, BorderDimensions } from './Border';

export type FabricsByRole = {
  background?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
  [key: string]: string | undefined;
};

export interface FabricRequirement {
  role: string;
  yards: number;
  description: string;
  inches?: number; // For binding - total inches needed
}

export interface QuiltPattern {
  // Existing fields (used by PDFService)
  patternName: string;
  difficulty: string;
  estimatedSize: string;
  description: string;
  fabricLayout: string;
  visualSvg: string;
  instructions: string[];

  // New (recommended) stable id (e.g., "pinwheel")
  patternId?: string;

  // New (recommended) structured fabric names by role
  // Avoid parsing fabricLayout prose.
  fabricsByRole?: FabricsByRole;
  
  // Fabric yardage requirements
  fabricRequirements?: FabricRequirement[];

  // Border configuration and dimensions
  borderConfiguration?: BorderConfiguration;
  borderDimensions?: BorderDimensions;
  
  // All fabric images (base64) - includes pattern fabrics AND border fabrics
  fabricImages?: string[];
}
