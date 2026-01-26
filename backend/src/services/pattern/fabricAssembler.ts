import { Fabric, ClaudeResponse } from '../../types/ClaudeResponse';
import { BorderConfiguration } from '../../types/Border';
import { FabricFromAnalysisBuilder } from './fabricFromAnalysisBuilder';
import { FabricFromColorsBuilder } from './fabricFromColorsBuilder';
import { BorderCountCalculator } from './borderCountCalculator';
import { FabricDataExtractor } from './fabricDataExtractor';
import { FabricBuildLogger } from './fabricBuildLogger';

/**
 * Handles fabric assembly and allocation between pattern and border fabrics
 */
export class FabricAssembler {
  /**
   * Builds pattern fabrics from Claude response and images
   */
  static buildPatternFabrics(
    parsedResponse: ClaudeResponse,
    fabricImages: string[]
  ): Fabric[] {
    const { fabricAnalysis, fabricColors } = FabricDataExtractor.extract(parsedResponse);
    
    FabricBuildLogger.log(fabricAnalysis, fabricColors, fabricImages);

    if (fabricAnalysis.length > 0) {
      return FabricFromAnalysisBuilder.build(fabricAnalysis, fabricColors, fabricImages);
    }

    if (fabricColors.length > 0) {
      return FabricFromColorsBuilder.build(fabricColors, fabricImages);
    }

    return [];
  }

  /**
   * Allocates fabrics between pattern and border based on configuration
   */
  static allocateFabrics(
    allFabricImages: string[],
    borderConfiguration?: BorderConfiguration
  ): { patternImages: string[]; borderImages: string[] } {
    const borderCount = BorderCountCalculator.calculate(borderConfiguration);
    
    const patternImages = borderCount > 0 
      ? allFabricImages.slice(0, allFabricImages.length - borderCount)
      : allFabricImages;
    
    const borderImages = borderCount > 0
      ? allFabricImages.slice(allFabricImages.length - borderCount)
      : [];

    console.log('📦 [FabricAssembler] Allocation:', {
      totalFabrics: allFabricImages.length,
      patternFabrics: patternImages.length,
      borderFabrics: borderImages.length,
      borderConfiguration: borderConfiguration?.enabled ? 'enabled' : 'disabled'
    });

    return { patternImages, borderImages };
  }

  /**
   * Builds border fabrics from images
   */
  static buildBorderFabrics(borderImages: string[]): Fabric[] {
    return borderImages.map(image => ({
      color: '#CCCCCC',
      type: 'printed' as const,
      image: image
    }));
  }

  /**
   * Combines pattern and border fabrics
   */
  static combineAllFabrics(
    patternFabrics: Fabric[],
    borderFabrics: Fabric[]
  ): Fabric[] {
    const allFabrics = [...patternFabrics, ...borderFabrics];
    
    console.log('🎨 [FabricAssembler] Combined fabrics:', {
      patternFabricCount: patternFabrics.length,
      borderFabricCount: borderFabrics.length,
      totalFabricCount: allFabrics.length
    });

    return allFabrics;
  }
}
