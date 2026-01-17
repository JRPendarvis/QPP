// types/QuiltPattern.ts

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
}
