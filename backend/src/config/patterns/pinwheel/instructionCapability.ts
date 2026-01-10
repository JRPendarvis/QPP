// src/config/patterns/pinwheel/instructionCapability.ts

import type { InstructionCapability } from '../../../services/instructions/instructionCapability';

export const pinwheelInstructionCapability: InstructionCapability = {
  patternId: 'pinwheel',
  supported: true,
  minFabrics: 2,
  maxFabrics: 4,
  notes: 'Deterministic Pinwheel instructions generated from pinwheel plan.',
};
