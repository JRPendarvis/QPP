import { BorderConfiguration } from '../../types/Border';
import { ClaudeResponse, FabricAnalysis } from '../../types/ClaudeResponse';
import { QuiltPattern } from '../../types/QuiltPattern';
import { getPatternById } from '../../config/quiltPatterns';
import { PATTERNS_BY_SKILL } from '../../config/skill-levels';
import { getSkillHierarchy } from '../../utils/skillLevelHelper';
import { PromptBuilder } from './promptBuilder';
import { PatternBuilder } from './patternBuilder';
import { SizeResolver } from './sizeResolver';
import { listSupportedInstructionPatternIds } from '../instructions/registry';
import sharp from 'sharp';

const DEFAULT_COLORS = ['#E5E7EB', '#C084FC', '#34D399', '#F59E0B', '#60A5FA', '#F87171'];
const DEFAULT_ROLE_ORDER: Array<FabricAnalysis['recommendedRole']> = ['background', 'primary', 'secondary', 'accent'];

export class DeterministicQuiltGenerationService {
  private static readonly SUPPORTED_PATTERNS = new Set(listSupportedInstructionPatternIds());

  canGenerate(selectedPattern?: string): boolean {
    if (!selectedPattern || selectedPattern === 'auto') {
      return true;
    }

    return DeterministicQuiltGenerationService.SUPPORTED_PATTERNS.has(selectedPattern);
  }

  async generateQuiltPattern(
    fabricImages: string[],
    skillLevel: string,
    selectedPattern: string,
    quiltSize?: string,
    borderConfiguration?: BorderConfiguration
  ): Promise<QuiltPattern> {
    const borderCount = borderConfiguration?.enabled ? borderConfiguration.borders.length : 0;
    const patternFabricImages = borderCount > 0
      ? fabricImages.slice(0, fabricImages.length - borderCount)
      : fabricImages;

    const { patternForSvg, patternId } = PromptBuilder.selectPattern(
      skillLevel,
      selectedPattern,
      patternFabricImages.length
    );

    let resolvedPatternId = patternId;
    let resolvedPatternForSvg = patternForSvg;

    if (!resolvedPatternId || !DeterministicQuiltGenerationService.SUPPORTED_PATTERNS.has(resolvedPatternId)) {
      const fallbackPatternId = this.findSupportedFallbackPattern(skillLevel, patternFabricImages.length);
      if (!fallbackPatternId) {
        throw new Error(`Deterministic generation is not supported for pattern "${selectedPattern}"`);
      }

      const fallbackPattern = getPatternById(fallbackPatternId);
      resolvedPatternId = fallbackPatternId;
      resolvedPatternForSvg = fallbackPattern?.name || fallbackPatternId;

      console.warn('[DeterministicQuiltGenerationService] Falling back to supported deterministic pattern.', {
        requestedPattern: selectedPattern,
        autoSelectedPattern: patternId,
        fallbackPatternId,
        skillLevel,
        fabricCount: patternFabricImages.length,
      });
    }

    const parsedResponse = await this.buildResponse(resolvedPatternId, resolvedPatternForSvg, patternFabricImages, quiltSize);
    const patternDifficulty = getPatternById(resolvedPatternId)?.skillLevel || skillLevel;

    const pattern = PatternBuilder.build(
      parsedResponse,
      resolvedPatternForSvg,
      patternDifficulty,
      fabricImages,
      quiltSize,
      borderConfiguration
    );

    // Keep the resolved pattern id so downstream services can stay deterministic in auto mode.
    pattern.patternId = resolvedPatternId;

    return pattern;
  }

  private findSupportedFallbackPattern(skillLevel: string, fabricCount: number): string | undefined {
    const hierarchy = getSkillHierarchy();
    const skillIndex = hierarchy.indexOf(skillLevel);
    const startIndex = skillIndex === -1 ? 0 : skillIndex;

    for (let i = startIndex; i < hierarchy.length; i += 1) {
      const ids = PATTERNS_BY_SKILL[hierarchy[i]] || [];
      for (const id of ids) {
        if (!DeterministicQuiltGenerationService.SUPPORTED_PATTERNS.has(id)) {
          continue;
        }

        const pattern = getPatternById(id);
        if (!pattern || pattern.enabled === false) {
          continue;
        }

        const min = typeof pattern.minColors === 'number' ? pattern.minColors : 0;
        const max = typeof pattern.maxFabrics === 'number' ? pattern.maxFabrics : Number.MAX_SAFE_INTEGER;
        if (fabricCount >= min && fabricCount <= max) {
          return id;
        }
      }
    }

    return undefined;
  }

  private async buildResponse(
    patternId: string,
    patternForSvg: string,
    patternFabricImages: string[],
    quiltSize?: string
  ): Promise<ClaudeResponse> {
    const patternDefinition = getPatternById(patternId);
    const patternName = patternDefinition?.name || patternForSvg;
    const estimatedSize = SizeResolver.getDisplaySize(quiltSize);
    const extractedColors = await this.extractDominantColors(patternFabricImages);
    const fabricAnalysis = patternFabricImages.map((_, index) => this.buildFabricAnalysis(index, extractedColors[index]));

    return {
      patternName,
      description: `A deterministic ${patternName} quilt plan generated from your selected pattern.`,
      fabricLayout: `${patternName} layout generated deterministically from your selected pattern and quilt size.`,
      estimatedSize,
      instructions: [],
      fabricColors: extractedColors,
      fabricAnalysis,
    };
  }

  private buildFabricAnalysis(index: number, dominantColor: string): FabricAnalysis {
    const value = this.estimateValueFromHex(dominantColor);

    return {
      fabricIndex: index,
      description: `Fabric ${index + 1}`,
      type: index === 0 ? 'solid' : 'printed',
      value,
      printScale: index === 0 ? 'solid' : 'medium',
      dominantColor,
      recommendedRole: DEFAULT_ROLE_ORDER[index],
    };
  }

  private async extractDominantColors(fabricImages: string[]): Promise<string[]> {
    const colors: string[] = [];

    for (let i = 0; i < fabricImages.length; i += 1) {
      const fallback = DEFAULT_COLORS[i % DEFAULT_COLORS.length];
      const image = fabricImages[i];

      try {
        if (!image || typeof image !== 'string') {
          colors.push(fallback);
          continue;
        }

        const buffer = Buffer.from(image, 'base64');
        const stats = await sharp(buffer).stats();
        const dominant = stats.dominant;

        if (!dominant) {
          colors.push(fallback);
          continue;
        }

        colors.push(this.rgbToHex(dominant.r, dominant.g, dominant.b));
      } catch (error) {
        console.warn('[DeterministicQuiltGenerationService] Failed to extract dominant fabric color, using fallback', {
          index: i,
          error: error instanceof Error ? error.message : 'unknown',
        });
        colors.push(fallback);
      }
    }

    return colors;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  private estimateValueFromHex(hexColor: string): FabricAnalysis['value'] {
    const match = /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/.exec(hexColor);
    if (!match) {
      return 'medium';
    }

    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (luminance < 85) {
      return 'dark';
    }
    if (luminance > 170) {
      return 'light';
    }
    return 'medium';
  }
}