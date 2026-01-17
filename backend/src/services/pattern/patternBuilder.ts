import { SvgGenerator } from '../../utils/svgGenerator';
import { PatternFormatter } from '../../utils/patternFormatter';
import { InstructionValidator } from './instructionValidator';
import { QuiltPattern } from '../../types/QuiltPattern';
import { ClaudeResponse, Fabric } from '../../types/ClaudeResponse';
import { FabricYardageCalculator } from '../../utils/fabric';
import { renderInstructions as renderCheckerboardInstructions } from '../../config/patterns/checkerboard/renderInstructions';
import { renderInstructions as renderFourPatchInstructions } from '../../config/patterns/four-patch/renderInstructions';
import { renderInstructions as renderNinePatchInstructions } from '../../config/patterns/nine-patch/renderInstructions';

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
    
    // Calculate fabric requirements with actual fabric info
    const fabricInfo = fabrics.map((fabric, idx) => {
      const fabricAnalysis = parsedResponse.fabricAnalysis?.[idx];
      return {
        color: fabric.color,
        type: fabric.type,
        description: fabricAnalysis?.description || undefined
      };
    });
    const fabricRequirements = FabricYardageCalculator.calculateRequirements(
      quiltSize || 'default',
      fabricInfo,
      patternForSvg
    );
    
    // Get accurate fabricLayout from computed instructions using actual fabric names
    const fabricNames = fabricRequirements
      .filter(req => !['Backing', 'Batting', 'Binding'].includes(req.role))
      .map(req => req.role);
    
    const computedLayout = this.computeAccurateFabricLayout(
      patternForSvg,
      finalSize,
      fabricNames,
      quiltSize || 'default' // Pass the actual quilt size key (baby, twin, queen, etc.)
    );
    
    // Combine computed accurate dimensions with Claude's descriptive verbiage
    const accurateFabricLayout = this.enhanceLayoutDescription(
      computedLayout,
      parsedResponse.fabricLayout,
      fabricNames
    );

    const pattern = {
      patternName: displayPatternName,
      description: parsedResponse.description || `A beautiful ${patternForSvg} pattern`,
      fabricLayout: accurateFabricLayout,
      difficulty: formattedDifficulty,
      estimatedSize: finalSize,
      instructions: validatedInstructions,
      visualSvg: visualSvg,
      fabricRequirements: fabricRequirements,
    };
    
    console.log('📦 [PatternBuilder] Pattern Object:', {
      hasVisualSvg: !!pattern.visualSvg,
      visualSvgLength: pattern.visualSvg?.length || 0,
      keys: Object.keys(pattern)
    });
    
    return pattern;
  }

  /**
   * Compute accurate fabricLayout description from renderInstructions
   * This ensures the description matches the actual PDF instructions
   */
  private static computeAccurateFabricLayout(
    patternForSvg: string,
    estimatedSize: string,
    fabricNames: string[],
    quiltSizeKey?: string
  ): string | null {
    // Use quilt size dimensions from the same source as fabric calculator
    const QUILT_SIZES = {
      baby: { widthIn: 36, heightIn: 52 },
      lap: { widthIn: 50, heightIn: 65 },
      twin: { widthIn: 66, heightIn: 90 },
      full: { widthIn: 80, heightIn: 90 },
      queen: { widthIn: 90, heightIn: 95 },
      king: { widthIn: 105, heightIn: 95 },
      default: { widthIn: 60, heightIn: 72 }
    };

    const quiltSize = QUILT_SIZES[quiltSizeKey as keyof typeof QUILT_SIZES] || QUILT_SIZES.default;

    // Create fabric assignments with actual color names
    const fabricAssignments = {
      namesBySlot: fabricNames.length > 0 ? fabricNames : Array.from({ length: 2 }, (_, i) => `Fabric ${i + 1}`),
      slotsByRole: {}
    };

    try {
      let instructions: string[] = [];
      
      // Normalize pattern name for comparison (lowercase)
      const normalizedPattern = patternForSvg.toLowerCase();
      
      // Call appropriate renderInstructions based on pattern
      switch (normalizedPattern) {
        case 'checkerboard':
          instructions = renderCheckerboardInstructions(quiltSize, fabricAssignments, {
            preferredFinishedBlockIn: [12, 10, 8]
          });
          break;
        case 'four-patch':
          instructions = renderFourPatchInstructions(quiltSize, fabricAssignments);
          break;
        case 'nine-patch':
          instructions = renderNinePatchInstructions(quiltSize, fabricAssignments, {
            finishedBlockIn: 12,
            squareFinishedIn: 4
          });
          break;
        default:
          return null;
      }
      
      // Extract layout description from computed instructions
      // Look for lines containing "grid", "layout", or "squares"
      const layoutLine = instructions.find(line => 
        line.toLowerCase().includes('computed layout') || 
        line.toLowerCase().includes('grid') ||
        (line.toLowerCase().includes('squares') && line.toLowerCase().includes('total'))
      );

      if (layoutLine) {
        // Clean up the layout description
        return layoutLine
          .replace('Computed layout: ', '')
          .replace(/^[^:]+:\s*/, '') // Remove "Quilt size target:" prefix if present
          .trim();
      }
    } catch (error) {
      console.error('Error computing accurate fabric layout:', error);
    }

    return null;
  }

  /**
   * Enhance layout description by combining computed dimensions with Claude's descriptive verbiage
   */
  private static enhanceLayoutDescription(
    computedLayout: string | null,
    claudeLayout: string,
    fabricNames: string[]
  ): string {
    // If no computed layout, fall back to Claude's description
    if (!computedLayout) {
      return claudeLayout || 'Arranged in a grid pattern';
    }

    // Extract descriptive phrases from Claude's description
    const claudeDescriptive = this.extractDescriptiveElements(claudeLayout, fabricNames);
    
    // If Claude provided good descriptive content, combine it with accurate dimensions
    if (claudeDescriptive) {
      return `${claudeDescriptive} ${computedLayout}`;
    }
    
    // Otherwise just use the computed layout
    return computedLayout;
  }

  /**
   * Extract descriptive pattern arrangement details from Claude's description
   */
  private static extractDescriptiveElements(claudeLayout: string, fabricNames: string[]): string | null {
    if (!claudeLayout) return null;

    // Look for descriptive phrases about pattern arrangement
    const patterns = [
      /classic checkerboard alternation[^.]*\)/i,
      /checkerboard pattern with[^.]*\)/i,
      /alternating[^.]*squares/i,
    ];

    for (const pattern of patterns) {
      const match = claudeLayout.match(pattern);
      if (match) {
        // Clean up the match and ensure it ends properly
        let description = match[0].trim();
        if (!description.endsWith('.') && !description.endsWith(')')) {
          description += '.';
        }
        return description;
      }
    }

    // If no specific pattern found but Claude provided fabric-specific details
    if (claudeLayout.includes('(row+col=') || claudeLayout.includes('even positions')) {
      const sentences = claudeLayout.split('.');
      const descriptiveSentence = sentences.find(s => 
        s.includes('alternation') || s.includes('even positions') || s.includes('odd positions')
      );
      if (descriptiveSentence) {
        return descriptiveSentence.trim() + '.';
      }
    }

    return null;
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
