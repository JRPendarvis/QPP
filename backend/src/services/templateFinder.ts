// src/services/templateFinder.ts

import { getPattern } from '../config/patterns';
import { getQuiltPattern } from '../config/quiltPatterns';
import { normalizePatternId } from '../utils/patternNormalization';

export class TemplateFinder {
  static find(patternType: string): { template: string; patternDef: any } {
    const normalizedId = normalizePatternId(patternType);

    const patternDef = getPattern(normalizedId);
    if (!patternDef) {
      throw new Error(`Pattern not found: ${patternType} (normalized: ${normalizedId})`);
    }

    const quiltPattern = getQuiltPattern(normalizedId);
    const template = patternDef.template ?? (patternDef.getTemplate ? patternDef.getTemplate([]) : undefined);

    if (!template) {
      throw new Error(`SVG template missing for pattern: ${normalizedId}`);
    }

    return { template, patternDef: { ...patternDef, quiltPattern } };
  }
}
