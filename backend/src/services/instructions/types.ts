// src/services/instructions/types.ts

export type QuiltSizeIn = {
  widthIn: number;
  heightIn: number;
};

export type InstructionResult =
  | { kind: 'generated'; instructions: string[] }
  | { kind: 'unsupported'; reason: string };

/**
 * Generic deterministic instruction plan contract.
 * Each pattern registers an InstructionPlan keyed by patternId.
 *
 * TFabrics is pattern-specific input describing fabric usage.
 * (Example: Bow Tie uses slot-based inputs; Pinwheel can adapt.)
 */
export type InstructionPlan<TFabrics = unknown> = {
  patternId: string;
  render: (quiltSize: QuiltSizeIn, fabrics: TFabrics) => string[];
};
