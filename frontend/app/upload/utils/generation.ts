import { FabricYardageRef, PatternChoice } from './types';

interface PrepareGenerationRequestOptions {
  patternChoice: PatternChoice;
  selectedPattern: string;
  quiltSize: string;
  fabrics: File[];
}

export interface PreparedGenerationRequest {
  patternOverride?: string;
  effectiveQuiltSize?: string;
  fabricsForGeneration: File[];
  blockingReason?: string;
}

export function prepareGenerationRequest({
  patternChoice,
  selectedPattern,
  quiltSize,
  fabrics,
}: PrepareGenerationRequestOptions): PreparedGenerationRequest {
  const patternOverride = patternChoice === 'manual'
    ? selectedPattern
    : patternChoice === 'unique'
      ? 'unique'
      : undefined;

  return {
    patternOverride,
    effectiveQuiltSize: quiltSize || undefined,
    fabricsForGeneration: fabrics,
  };
}
