import { FabricYardageRef, PatternChoice } from './types';

export type UniqueStashPlan =
  | {
      isPossible: false;
      reason: string;
    }
  | {
      isPossible: true;
      plannedFabrics: File[];
      plannedPreviews: string[];
      plannedYardageRefs: Array<FabricYardageRef | null>;
      effectiveQuiltSize?: string;
      notes: string[];
    };

interface PrepareGenerationRequestOptions {
  patternChoice: PatternChoice;
  selectedPattern: string;
  quiltSize: string;
  fabrics: File[];
  buildUniqueStashPlan: (explicitQuiltSize?: string) => UniqueStashPlan;
}

export interface PreparedGenerationRequest {
  patternOverride?: string;
  effectiveQuiltSize?: string;
  fabricsForGeneration: File[];
  blockingReason?: string;
  uniquePlan?: Extract<UniqueStashPlan, { isPossible: true }>;
}

export function prepareGenerationRequest({
  patternChoice,
  selectedPattern,
  quiltSize,
  fabrics,
  buildUniqueStashPlan,
}: PrepareGenerationRequestOptions): PreparedGenerationRequest {
  const patternOverride = patternChoice === 'unique'
    ? 'unique'
    : patternChoice === 'manual'
      ? selectedPattern
      : undefined;

  if (patternChoice !== 'unique') {
    return {
      patternOverride,
      effectiveQuiltSize: quiltSize || undefined,
      fabricsForGeneration: fabrics,
    };
  }

  const plan = buildUniqueStashPlan(quiltSize || undefined);
  if (!plan.isPossible) {
    return {
      patternOverride,
      effectiveQuiltSize: quiltSize || undefined,
      fabricsForGeneration: fabrics,
      blockingReason: plan.reason,
    };
  }

  return {
    patternOverride,
    effectiveQuiltSize: plan.effectiveQuiltSize,
    fabricsForGeneration: plan.plannedFabrics,
    uniquePlan: plan,
  };
}
