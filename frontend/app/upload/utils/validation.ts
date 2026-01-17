import { PatternChoice, PatternDetails } from './types';
import { getPatternsForSkillLevel } from '../uploadUtils';

export function validateFabricCount(
  patternChoice: PatternChoice,
  selectedPattern: string,
  selectedPatternDetails: PatternDetails | null,
  fabricsLength: number,
  borderCount: number = 0
): boolean {
  // Subtract border fabrics to get pattern fabric count
  const patternFabricCount = Math.max(0, fabricsLength - borderCount);
  if (patternChoice === 'auto') {
    // Use user's skill level if available, otherwise default to 'beginner'
    const skillLevel = 'beginner';
    const patterns: PatternDetails[] = getPatternsForSkillLevel(skillLevel);
    const valid = patterns.some((p) => patternFabricCount >= p.minFabrics && patternFabricCount <= p.maxFabrics);
    return valid;
  }
  if (!selectedPattern) {
    return false;
  }
  if (!selectedPatternDetails) {
    return false;
  }
  return (
    patternFabricCount >= selectedPatternDetails.minFabrics &&
    patternFabricCount <= selectedPatternDetails.maxFabrics
  );
}

export function getFabricValidationMessage(
  patternChoice: PatternChoice,
  selectedPattern: string,
  selectedPatternDetails: PatternDetails | null,
  fabricsLength: number,
  borderCount: number = 0
): string | null {
  // Subtract border fabrics to get pattern fabric count
  const patternFabricCount = Math.max(0, fabricsLength - borderCount);
  if (patternChoice === 'auto') {
    // Use user's skill level if available, otherwise default to 'beginner'
    const skillLevel = 'beginner';
    const patterns: PatternDetails[] = getPatternsForSkillLevel(skillLevel);
    // Assume minimum is 2 for auto mode
    if (patternFabricCount < 2) {
      const borderSuffix = borderCount > 0 ? ` (plus ${borderCount} for borders)` : '';
      return `Upload at least 2 fabrics for the pattern${borderSuffix}`;
    }
    const valid = patterns.some((p) => patternFabricCount >= p.minFabrics && patternFabricCount <= p.maxFabrics);
    if (!valid) {
      const borderSuffix = borderCount > 0 ? ` for the pattern (plus ${borderCount} for borders)` : '';
      return `No available pattern for your skill level matches ${patternFabricCount} fabric${patternFabricCount !== 1 ? 's' : ''}${borderSuffix}. Please add or remove fabrics to match a supported pattern.`;
    }
    return null;
  }

  if (!selectedPattern) {
    return 'Please select a pattern';
  }

  if (!selectedPatternDetails) return null;

  if (patternFabricCount < selectedPatternDetails.minFabrics) {
    const needed = selectedPatternDetails.minFabrics - patternFabricCount;
    const borderSuffix = borderCount > 0 ? ` (plus ${borderCount} for borders)` : '';
    return `${selectedPatternDetails.name} requires at least ${selectedPatternDetails.minFabrics} pattern fabrics${borderSuffix}. Please add ${needed} more.`;
  }

  if (patternFabricCount > selectedPatternDetails.maxFabrics) {
    const excess = patternFabricCount - selectedPatternDetails.maxFabrics;
    const borderSuffix = borderCount > 0 ? `. You have ${borderCount} border fabric${borderCount !== 1 ? 's' : ''}` : '';
    return `${selectedPatternDetails.name} uses at most ${selectedPatternDetails.maxFabrics} pattern fabrics${borderSuffix}. Please remove ${excess} pattern fabric${excess !== 1 ? 's' : ''} or choose a different pattern.`;
  }

  return null;
}