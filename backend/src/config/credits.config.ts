export const CREDIT_COSTS = {
  patternGeneration: 1,
  fabricCoordination: 1,
  patternSelection: 0,
  fabricImageAnalysis: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export function getCreditCost(action: CreditAction): number {
  return CREDIT_COSTS[action];
}
