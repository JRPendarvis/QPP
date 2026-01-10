// src/services/instructions/generateInstructions.ts

import type { QuiltSizeIn } from './types';
import type { FabricAssignments } from './fabricAssignments';
import { getInstructionPlan } from './registry';

export type GenerateInstructionsResult =
  | { kind: 'generated'; instructions: string[] }
  | { kind: 'not-supported' };

export function generateInstructions(
  patternId: string,
  quiltSize: QuiltSizeIn,
  fabricsByRole: FabricAssignments
): GenerateInstructionsResult {
  const plan = getInstructionPlan(patternId);
  
  if (!plan) {
    return { kind: 'not-supported' };
  }

  try {
    const instructions = plan.render(quiltSize, fabricsByRole);
    return { kind: 'generated', instructions };
  } catch (error) {
    console.error(`[INSTRUCTIONS] Error generating instructions for ${patternId}:`, error);
    return { kind: 'not-supported' };
  }
}
