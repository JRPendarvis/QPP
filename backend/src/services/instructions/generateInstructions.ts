// src/services/instructions/generateInstructions.ts

import type { QuiltSizeIn, FabricsByRole } from './types';
import { getInstructionCapability, registerInstructionCapability } from './registry';

// ✅ NOTE: we are now importing from src/config/patterns
import { instructionCapabilities } from '../../config/patterns/instructionCapabilities';

export type GenerateInstructionsResult =
  | { kind: 'generated'; instructions: string[] }
  | { kind: 'not-supported' };

// One-time registration (module init)
let isRegistered = false;
function ensureRegistered(): void {
  if (isRegistered) return;
  for (const cap of instructionCapabilities) {
    registerInstructionCapability(cap);
  }
  isRegistered = true;
}

export function generateInstructions(
  patternId: string,
  quiltSize: QuiltSizeIn,
  fabricsByRole: FabricsByRole
): GenerateInstructionsResult {
  ensureRegistered();

  const capability = getInstructionCapability(patternId);
  if (!capability) return { kind: 'not-supported' };

  const plan = capability.buildPlan(quiltSize);
  const instructions = capability.renderInstructions(plan, fabricsByRole);

  return { kind: 'generated', instructions };
}
