import { PatternChoice, PatternDetails } from './types';

export function validateFabricCount(
  patternChoice: PatternChoice,
  selectedPattern: string,
  selectedPatternDetails: PatternDetails | null,
  fabricsLength: number,
  MIN_FABRICS: number,
  MAX_FABRICS: number
): boolean {
  if (patternChoice === 'auto') {
    return fabricsLength >= MIN_FABRICS && fabricsLength <= MAX_FABRICS;
  }
  if (!selectedPattern) {
    return false;
  }
  if (!selectedPatternDetails) {
    return false;
  }
  return (
    fabricsLength >= selectedPatternDetails.minFabrics &&
    fabricsLength <= selectedPatternDetails.maxFabrics
  );
}

export function getFabricValidationMessage(
  patternChoice: PatternChoice,
  selectedPattern: string,
  selectedPatternDetails: PatternDetails | null,
  fabricsLength: number,
  MIN_FABRICS: number
): string | null {
  if (patternChoice === 'auto') {
    if (fabricsLength < MIN_FABRICS) {
      return `Upload at least ${MIN_FABRICS} fabrics to generate a pattern`;
    }
    return null;
  }

  if (!selectedPattern) {
    return 'Please select a pattern';
  }

  if (!selectedPatternDetails) return null;

  if (fabricsLength < selectedPatternDetails.minFabrics) {
    const needed = selectedPatternDetails.minFabrics - fabricsLength;
    return `${selectedPatternDetails.name} requires at least ${selectedPatternDetails.minFabrics} fabrics. Please add ${needed} more.`;
  }

  if (fabricsLength > selectedPatternDetails.maxFabrics) {
    const excess = fabricsLength - selectedPatternDetails.maxFabrics;
    return `${selectedPatternDetails.name} uses at most ${selectedPatternDetails.maxFabrics} fabrics. Please remove ${excess} or choose a different pattern.`;
  }

  return null;
}