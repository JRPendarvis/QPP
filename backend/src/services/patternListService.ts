import { getAllPatterns, PatternDefinition } from '../config/patterns';
import { getQuiltPattern } from '../config/quiltPatterns';
import { normalizePatternId } from '../utils/patternNormalization';

export interface PatternListItem {
  id: string;
  name: string;
  skillLevel: string;
  description: string;
  recommendedFabricCount: number | null;
  minColors: number;
  maxFabrics: number;
  allowRotation: boolean;
}

export interface PatternFabricRoles {
  patternId: string;
  patternName: string;
  fabricRoles: string[];
  minFabrics: number;
  maxFabrics: number;
}

export class PatternListService {
  /**
   * Get all available patterns filtered by environment
   */
  static getAvailablePatterns(): PatternListItem[] {
    const isProduction = process.env.NODE_ENV === 'production';

    return getAllPatterns()
      .filter((patternDef: PatternDefinition) => {
        if (!isProduction) return true;
        return patternDef.enabled !== false;
      })
      .map((patternDef: PatternDefinition) => {
        const quiltPattern = getQuiltPattern(patternDef.id);
        return {
          id: patternDef.id,
          name: patternDef.name,
          skillLevel: quiltPattern?.skillLevel || 'intermediate',
          description: quiltPattern?.description || '',
          recommendedFabricCount: quiltPattern?.recommendedFabricCount || null,
          minColors: patternDef.minFabrics,
          maxFabrics: patternDef.maxFabrics,
          allowRotation: patternDef.allowRotation ?? true,
        };
      });
  }

  /**
   * Get fabric roles for a specific pattern
   */
  static getFabricRolesForPattern(patternId: string): PatternFabricRoles | null {
    const normalizedId = normalizePatternId(patternId);

    if (normalizedId === 'auto') {
      return null;
    }

    const patterns = getAllPatterns();
    const pattern = patterns.find((p: PatternDefinition) => p.id === normalizedId);

    if (!pattern) {
      return null;
    }

    const defaultRoles = [
      'Background',
      'Primary',
      'Secondary',
      'Accent',
      'Contrast',
      'Highlight',
      'Border',
      'Binding',
    ];
    const fabricRoles = pattern.fabricRoles || defaultRoles.slice(0, pattern.maxFabrics);

    return {
      patternId: pattern.id,
      patternName: pattern.name,
      fabricRoles: fabricRoles,
      minFabrics: pattern.minFabrics,
      maxFabrics: pattern.maxFabrics,
    };
  }
}
