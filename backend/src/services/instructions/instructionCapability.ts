// src/services/instructions/instructionCapability.ts

export type InstructionCapability = {
  patternId: string;
  supported: boolean;
  notes?: string;
  minFabrics?: number;
  maxFabrics?: number;
};
