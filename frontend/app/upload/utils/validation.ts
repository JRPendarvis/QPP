import { PatternChoice, PatternDetails } from './types';
import { getPatternsForSkillLevel } from '../uploadUtils';

export function validateFabricCount(
  patternChoice: PatternChoice,
  selectedPattern: string,
  selectedPatternDetails: PatternDetails | null,
  fabricsLength: number
): boolean {
  if (patternChoice === 'auto') {
    // Use user's skill level if available, otherwise default to 'beginner'
    const skillLevel = 'beginner';
    const patterns: PatternDetails[] = getPatternsForSkillLevel(skillLevel);
    const valid = patterns.some((p) => fabricsLength >= p.minFabrics && fabricsLength <= p.maxFabrics);
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
  fabricsLength: number
): string | null {
  if (patternChoice === 'auto') {
    // Use user's skill level if available, otherwise default to 'beginner'
    const skillLevel = 'beginner';
    const patterns: PatternDetails[] = getPatternsForSkillLevel(skillLevel);
    // Assume minimum is 2 for auto mode
    if (fabricsLength < 2) {
      return `Upload at least 2 fabrics to generate a pattern`;
    }
    const valid = patterns.some((p) => fabricsLength >= p.minFabrics && fabricsLength <= p.maxFabrics);
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