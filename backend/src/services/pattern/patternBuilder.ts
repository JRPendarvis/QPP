import { SvgGenerator } from '../../utils/svgGenerator';
import { PatternFormatter } from '../../utils/patternFormatter';
import { InstructionValidator } from './instructionValidator';
import { QuiltPattern } from '../../types/QuiltPattern';
import { ClaudeResponse, Fabric } from '../../types/ClaudeResponse';

/**
 * Service for building QuiltPattern objects from Claude API responses
 */
export class PatternBuilder {
  /**
   * Builds a complete QuiltPattern from parsed Claude response
   * 
   * @param parsedResponse - Parsed response from Claude API
   * @param patternForSvg - Pattern type for SVG generation
   * @param patternDifficulty - The pattern's difficulty level (beginner/intermediate/advanced)
   * @param fabricImages - Array of base64 fabric images
   * @returns Complete QuiltPattern object
   * 
   * @example
   * ```typescript
   * const pattern = PatternBuilder.build(
   *   parsedResponse,
   *   'nine-patch',
   *   'beginner',  // Pattern difficulty, not user skill level
   *   ['base64...', 'base64...']
   * );
   * ```
   */
  static build(
    parsedResponse: ClaudeResponse,
    patternForSvg: string,
    patternDifficulty: string,
    fabricImages: string[]
  ): QuiltPattern {
    const fabrics = this.buildFabrics(parsedResponse, fabricImages);
    const visualSvg = SvgGenerator.generateFromTemplate(patternForSvg, fabrics);
    
    console.log('🎨 [PatternBuilder] SVG Generated:', {
      patternForSvg,
      svgLength: visualSvg?.length || 0,
      svgPreview: visualSvg?.substring(0, 100) || 'EMPTY',
      fabricCount: fabrics.length
    });
    
    const displayPatternName = this.extractPatternName(parsedResponse.patternName, patternForSvg);
    const formattedDifficulty = this.formatDifficulty(patternDifficulty);
    const validatedInstructions = InstructionValidator.validate(parsedResponse.instructions);

    const pattern = {
      patternName: displayPatternName,
      description: parsedResponse.description || `A beautiful ${patternForSvg} pattern`,
      fabricLayout: parsedResponse.fabricLayout || 'Arranged in a 4x4 grid',
      difficulty: formattedDifficulty,
      estimatedSize: parsedResponse.estimatedSize || '60x72 inches',
      instructions: validatedInstructions,
      visualSvg: visualSvg,
    };
    
    console.log('📦 [PatternBuilder] Pattern Object:', {
      hasVisualSvg: !!pattern.visualSvg,
      visualSvgLength: pattern.visualSvg?.length || 0,
      keys: Object.keys(pattern)
    });
    
    return pattern;
  }

  /**
   * Builds fabric array with color, type, and image data
   */
  private static buildFabrics(
    parsedResponse: ClaudeResponse,
    fabricImages: string[]
  ): Fabric[] {
    const fabricAnalysis = parsedResponse.fabricAnalysis || [];
    const fabricColors = parsedResponse.fabricColors || [];

    // Build fabrics from analysis
    if (fabricAnalysis.length > 0) {
      return fabricAnalysis.map((fa, idx) => ({
        color: fa.dominantColor || fabricColors[idx] || '#CCCCCC',
        type: fa.type || 'solid',
        image: fabricImages[idx] || '',
      }));
    }

    // Fallback to colors only
    if (fabricColors.length > 0) {
      return fabricColors.map((color, idx) => ({
        color: color,
        type: 'solid' as const,
        image: fabricImages[idx] || '',
      }));
    }

    return [];
  }

  /**
   * Extracts display name from Claude's pattern name
   */
  private static extractPatternName(claudeName: string, patternForSvg: string): string {
    const displayName = PatternFormatter.extractDisplayName(claudeName, patternForSvg);
    return displayName;
  }

  /**
   * Formats difficulty level for display
   */
  private static formatDifficulty(skillLevel: string): string {
    return skillLevel.replace('_', ' ');
  }
}
