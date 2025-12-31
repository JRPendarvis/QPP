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
    // Find all patterns for the user's skill level that match the fabric count
    // (import getPatternsForSkillLevel from uploadUtils)
    // We import here to avoid circular deps
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getPatternsForSkillLevel } = require('../uploadUtils');
    // Assume skillLevel is passed in selectedPatternDetails?.skillLevel or fallback to 'beginner'
    const skillLevel = selectedPatternDetails?.skillLevel || 'beginner';
    const patterns = getPatternsForSkillLevel(skillLevel);
    const valid = patterns.some((p: any) => fabricsLength >= p.minFabrics && fabricsLength <= p.maxFabrics);
    return valid;
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getPatternsForSkillLevel } = require('../uploadUtils');
    const skillLevel = selectedPatternDetails?.skillLevel || 'beginner';
    const patterns = getPatternsForSkillLevel(skillLevel);
    if (fabricsLength < MIN_FABRICS) {
      return `Upload at least ${MIN_FABRICS} fabrics to generate a pattern`;
    }
    const valid = patterns.some((p: any) => fabricsLength >= p.minFabrics && fabricsLength <= p.maxFabrics);
    if (!valid) {
      return `No available pattern for your skill level matches ${fabricsLength} fabric${fabricsLength !== 1 ? 's' : ''}. Please add or remove fabrics to match a supported pattern.`;
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