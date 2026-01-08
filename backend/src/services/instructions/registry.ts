// src/services/instructions/registry.ts

import type { InstructionCapability } from './types';

const registry = new Map<string, InstructionCapability>();

export function registerInstructionCapability(capability: InstructionCapability): void {
  registry.set(capability.patternId, capability);
}

export function getInstructionCapability(patternId: string): InstructionCapability | undefined {
  return registry.get(patternId);
}
