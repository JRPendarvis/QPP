import { PatternChoice, PatternDetails } from './types';

export function validateFabricCount(
  patternChoice: PatternChoice,
  selectedPattern: string,
  selectedPatternDetails: PatternDetails | null,
  fabricsLength: number,
  borderCount: number = 0
): boolean {
  // Subtract border fabrics to get pattern fabric count
  const patternFabricCount = Math.max(0, fabricsLength - borderCount);
  if (patternChoice === 'auto' || patternChoice === 'unique') {
    // Auto and unique modes delegate compatibility to backend generation logic.
    return patternFabricCount >= 2;
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
  if (patternChoice === 'auto' || patternChoice === 'unique') {
    // Assume minimum is 2 for auto and unique modes
    if (patternFabricCount < 2) {
      const borderSuffix = borderCount > 0 ? ` (plus ${borderCount} for borders)` : '';
      return `Upload at least 2 fabrics for the pattern${borderSuffix}`;
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