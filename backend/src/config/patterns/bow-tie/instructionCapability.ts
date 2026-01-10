// src/config/patterns/bow-tie/instructionCapability.ts

import type { InstructionCapability } from '../../../services/instructions/instructionCapability';

export const bowTieInstructionCapability: InstructionCapability = {
  patternId: 'bow-tie',
  supported: true,
  minFabrics: 2,
  maxFabrics: 8,
  notes:
    'Deterministic Bow Tie instructions: COLOR1 background fixed; COLOR2 bow and COLOR3 knot rotate through feature fabrics by block index.',
};
