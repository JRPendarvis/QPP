// config/patterns/PatternPrompt.ts

/**
 * Defines the structure for AI prompt generation for quilt patterns.
 * This interface contains all the guidance needed to instruct an AI
 * on how to generate specific quilt pattern instructions.
 */
export interface PatternPrompt {
  patternName: string;
  recommendedFabricCount: number;
  characteristics: string;
  fabricRoleGuidance: string;
  cuttingInstructions: string;
  assemblyNotes: string;
  commonMistakes: string;
}
