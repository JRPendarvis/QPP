import { SvgGenerator } from '../../utils/svgGenerator';
import { InstructionValidator } from './instructionValidator';
import { QuiltPattern } from '../../types/QuiltPattern';
import { ClaudeResponse } from '../../types/ClaudeResponse';
import { BorderConfiguration } from '../../types/Border';
import { BorderSizeCalculator } from '../../utils/borderSizeCalculator';
import { FabricAssembler } from './fabricAssembler';
import { SizeResolver } from './sizeResolver';
import { PatternMetadataFormatter } from './patternMetadataFormatter';
import { LayoutComputer } from './layoutComputer';
import { RequirementsCalculator } from './requirementsCalculator';

/**
 * Orchestrates building QuiltPattern objects from Claude responses
 * Delegates to specialized services following Single Responsibility Principle
 */
export class PatternBuilder {
  /**
   * Builds a complete QuiltPattern from parsed Claude response
   */
  static build(
    parsedResponse: ClaudeResponse,
    patternForSvg: string,
    patternDifficulty: string,
    fabricImages: string[],
    quiltSize?: string,
    borderConfiguration?: BorderConfiguration
  ): QuiltPattern {
    // Allocate fabrics between pattern and border
    const { patternImages, borderImages } = FabricAssembler.allocateFabrics(
      fabricImages,
      borderConfiguration
    );

    // Build pattern fabrics
    const patternFabrics = FabricAssembler.buildPatternFabrics(
      parsedResponse,
      patternImages
    );

    // Build all fabrics (pattern + border) for SVG rendering
    const borderFabrics = FabricAssembler.buildBorderFabrics(borderImages);
    const allFabrics = FabricAssembler.combineAllFabrics(patternFabrics, borderFabrics);

    // Generate SVG with borders if configured
    const visualSvg = SvgGenerator.generateFromTemplate(
      patternForSvg,
      patternFabrics,
      borderConfiguration,
      allFabrics
    );

    console.log('🎨 [PatternBuilder] SVG Generated:', {
      patternForSvg,
      svgLength: visualSvg?.length || 0,
      svgPreview: visualSvg?.substring(0, 100) || 'EMPTY',
      fabricCount: patternFabrics.length,
      hasBorders: !!borderConfiguration?.enabled
    });

    // Extract metadata
    const displayPatternName = PatternMetadataFormatter.extractPatternName(
      parsedResponse.patternName,
      patternForSvg
    );
    const formattedDifficulty = PatternMetadataFormatter.formatDifficulty(patternDifficulty);
    const validatedInstructions = InstructionValidator.validate(parsedResponse.instructions);
    const finalSize = SizeResolver.getDisplaySize(quiltSize, parsedResponse.estimatedSize);

    // Calculate fabric requirements
    const fabricRequirements = RequirementsCalculator.calculateAllRequirements(
      quiltSize,
      patternForSvg,
      patternFabrics,
      parsedResponse.fabricAnalysis,
      borderConfiguration,
      borderImages.length,
      fabricImages,
      finalSize,
      PatternMetadataFormatter.getBorderFabricName
    );

    // Compute accurate fabric layout
    const fabricNames = fabricRequirements
      .filter(req => !['Backing', 'Batting', 'Binding'].includes(req.role))
      .map(req => req.role);

    const computedLayout = LayoutComputer.computeAccurateLayout(
      patternForSvg,
      finalSize,
      fabricNames,
      quiltSize || 'default'
    );

    const accurateFabricLayout = LayoutComputer.enhanceLayout(
      computedLayout,
      parsedResponse.fabricLayout,
      fabricNames
    );

    // Calculate border dimensions if configured
    let borderDimensions;
    if (borderConfiguration?.enabled && borderConfiguration.borders.length > 0) {
      const dimensions = SizeResolver.parseDimensions(finalSize);
      borderDimensions = BorderSizeCalculator.calculateBorderDimensions(
        borderConfiguration.borders,
        dimensions.widthIn,
        dimensions.heightIn
      );
    }

    const pattern = {
      patternName: displayPatternName,
      description: parsedResponse.description || `A beautiful ${patternForSvg} pattern`,
      fabricLayout: accurateFabricLayout,
      difficulty: formattedDifficulty,
      estimatedSize: finalSize,
      instructions: validatedInstructions,
      visualSvg: visualSvg,
      fabricRequirements: fabricRequirements,
      fabricImages: fabricImages,
      ...(borderConfiguration && { borderConfiguration }),
      ...(borderDimensions && { borderDimensions }),
    };

    console.log('📦 [PatternBuilder] Pattern Object:', {
      hasVisualSvg: !!pattern.visualSvg,
      visualSvgLength: pattern.visualSvg?.length || 0,
      hasBorders: !!borderConfiguration?.enabled,
      borderCount: borderConfiguration?.borders.length || 0,
      fabricImagesCount: fabricImages.length,
      keys: Object.keys(pattern)
    });

    return pattern;
  }
}
