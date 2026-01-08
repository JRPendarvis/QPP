// services/instructions/types.ts

export type QuiltSizeIn = { width: number; height: number };

export type FabricsByRole = Record<string, string>;

export interface InstructionCapability<Plan = unknown> {
  patternId: string;

  buildPlan: (quiltSize: QuiltSizeIn) => Plan;

  // Given a computed plan + resolved fabric names, produce printable step strings.
  renderInstructions: (plan: Plan, fabricsByRole: FabricsByRole) => string[];
}
