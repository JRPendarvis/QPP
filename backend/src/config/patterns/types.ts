// config/patterns/types.ts

export interface PatternPrompt {
  patternName: string;
  recommendedFabricCount: number;
  characteristics: string;
  fabricRoleGuidance: string;
  cuttingInstructions: string;
  assemblyNotes: string;
  commonMistakes: string;
}

export interface PatternDefinition {
  id: string;                          // 'churn-dash'
  name: string;                        // 'Churn Dash'
  template: string;                    // SVG with COLOR1, COLOR2, etc.
  prompt: PatternPrompt;
  minColors: number;                   // Minimum fabrics needed
  maxColors: number;                   // Maximum fabrics supported
  getColors: (fabricColors: string[], opts: { blockIndex?: number; row?: number; col?: number }) => string[];  // blockIndex is optional
}
