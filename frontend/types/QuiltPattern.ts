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

  // Auto pattern selection details for "Let QuiltPlannerPro choose"
  autoSelection?: {
    selectedBy: 'ai' | 'deterministic';
    reason?: string;
    targetSkillLevel?: string;
  };

  // Selection rationale details for non-catalog unique generation.
  selectionRationale?: {
    mode: 'unique';
    reason?: string;
    targetSkillLevel?: string;
  };

  meta?: {
    isUnique?: boolean;
    uniqueVersion?: string;
    localOnly?: boolean;
  };
}

export interface FabricRequirement {
  role: string;
  yards: number;
  description: string;
  inches?: number; // For binding - total inches needed
}
