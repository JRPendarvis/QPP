import { FabricAnalysis, RoleAssignments } from '../services/prompt/RoleValidationService';
import { ProductionQuiltSpec } from '../services/prompt/ProductionSpecHandler';

/**
 * Complete response structure from Claude AI for quilt pattern generation.
 * 
 * This interface represents the full data contract returned by the AI,
 * including fabric analysis, role assignments, instructions, and production specs.
 */
export interface PatternResponse {
  /** Creative pattern name combining theme and pattern type */
  patternName: string;
  
  /** 2-3 sentence description of the pattern and fabric combination */
  description: string;
  
  /** Detailed analysis of each fabric's characteristics */
  fabricAnalysis: FabricAnalysis[];
  
  /** Assigned roles for each fabric (background, primary, etc.) */
  roleAssignments: RoleAssignments;
  
  /** Description of how fabrics are arranged in the pattern */
  fabricLayout: string;
  
  /** Skill level difficulty (beginner, intermediate, advanced, expert) */
  difficulty: string;
  
  /** Estimated quilt size (preview or production) */
  estimatedSize: string;
  
  /** Step-by-step instructions for creating the quilt */
  instructions: string[];
  
  /** Array of hex color codes for each fabric */
  fabricColors: string[];
  
  /** Array of fabric descriptions */
  fabricDescriptions: string[];
  
  /** Whether this is a preview-only pattern (3x4) or production-ready */
  isPreviewOnly: boolean;
  
  /** Preview grid size (always "3x4") */
  previewGrid: string;
  
  /** Production grid size (e.g., "6x8") when productionSpec is provided */
  productionGrid?: string;
  
  /** Full production specification for the quilt */
  productionSpec?: ProductionQuiltSpec | null;
}
