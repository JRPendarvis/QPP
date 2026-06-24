export const CREDIT_COSTS = {
  // Procedural/deterministic — no AI involved, no credit cost
  patternGeneration: 0,
  // AI-assisted quilt choice from predefined patterns
  aiChooseQuilt: 2,
  // AI-driven unique quilt composition
  aiGenerateQuilt: 3,
  patternSelection: 0,
  fabricImageAnalysis: 0,
  // AI action — Claude assigns fabric roles (background/primary/secondary/accent)
  fabricCoordination: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export function getCreditCost(action: CreditAction): number {
  return CREDIT_COSTS[action];
}
