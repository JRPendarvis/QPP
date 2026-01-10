// src/config/patterns/instructionCapabilities.ts

import type { InstructionCapability } from '../../services/instructions/instructionCapability';

import { pinwheelInstructionCapability } from './pinwheel/instructionCapability';
import { bowTieInstructionCapability } from './bow-tie/instructionCapability';

/**
 * Central registry of patterns that have deterministic (non-LLM) instruction support.
 * Add new patterns here as you implement their plan/renderers.
 */
export const instructionCapabilities: InstructionCapability[] = [
  pinwheelInstructionCapability,
  bowTieInstructionCapability,
];
