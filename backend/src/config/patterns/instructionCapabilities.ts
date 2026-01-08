// src/config/patterns/instructionCapabilities.ts

import type { InstructionCapability } from '../../services/instructions/types';

// MVP: register only Pinwheel for now
import { pinwheelInstructionCapability } from './pinwheel/instructionCapability';

export const instructionCapabilities: InstructionCapability[] = [
  pinwheelInstructionCapability,
];
