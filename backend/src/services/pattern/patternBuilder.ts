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
   * @param quiltSize - Optional desired quilt size (baby, lap, twin, full, queen, king)
   * @returns Complete QuiltPattern object
   * 
   * @example
   * ```typescript
   * const pattern = PatternBuilder.build(
   *   parsedResponse,
   *   'nine-patch',
   *   'beginner',  // Pattern difficulty, not user skill level
   *   ['base64...', 'base64...'],
   *   'queen'  // Optional size
   * );
   * ```
   */
  static build(
    parsedResponse: ClaudeResponse,
    patternForSvg: string,
    patternDifficulty: string,
    fabricImages: string[],
    quiltSize?: string
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
    const finalSize = this.getQuiltSize(quiltSize, parsedResponse.estimatedSize);

    const pattern = {
      patternName: displayPatternName,
      description: parsedResponse.description || `A beautiful ${patternForSvg} pattern`,
      fabricLayout: parsedResponse.fabricLayout || 'Arranged in a 4x4 grid',
      difficulty: formattedDifficulty,
      estimatedSize: finalSize,
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

    console.log('🧵 [PatternBuilder] Building fabrics:', {
      fabricAnalysisCount: fabricAnalysis.length,
      fabricColorsCount: fabricColors.length,
      fabricImagesCount: fabricImages.length,
      analysis: fabricAnalysis.map((fa: any) => ({ 
        type: fa.type, 
        fabricType: fa.fabricType,
        hasImage: !!fabricImages[fabricAnalysis.indexOf(fa)] 
      }))
    });

    // Build fabrics from analysis
    if (fabricAnalysis.length > 0) {
      const fabrics = fabricAnalysis.map((fa: any, idx) => {
        // Claude may return 'type' or 'fabricType' field, and may be uppercase
        const rawType = fa.type || fa.fabricType || 'solid';
        const normalizedType: 'printed' | 'solid' = rawType.toLowerCase() === 'printed' ? 'printed' : 'solid';
        
        return {
          color: fa.dominantColor || fabricColors[idx] || '#CCCCCC',
          type: normalizedType,
          image: fabricImages[idx] || '',
        };
      });
      
      console.log('🧵 [PatternBuilder] Built fabrics from analysis:', fabrics.map((f, i) => ({
        index: i,
        type: f.type,
        color: f.color,
        hasImage: !!f.image,
        imageLength: f.image?.length || 0
      })));
      
      return fabrics;
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

  /**
   * Gets the appropriate quilt size based on user selection or defaults
   */
  private static getQuiltSize(quiltSize?: string, claudeSize?: string): string {
    // If user specified a size, use the corresponding dimensions
    if (quiltSize) {
      const sizeMap: Record<string, string> = {
        'baby': '36×52 inches',
        'lap': '50×65 inches',
        'twin': '66×90 inches',
        'full': '80×90 inches',
        'queen': '90×95 inches',
        'king': '105×95 inches',
      };
      
      return sizeMap[quiltSize] || claudeSize || '60×72 inches';
    }
    
    // Otherwise use Claude's suggested size or default
    return claudeSize || '60×72 inches';
  }
}
