// Re-export types and services for backward compatibility
export { PatternSelector, PatternSelectionResult } from './prompt/PatternSelector';
export { ProductionSpecHandler, ProductionQuiltSpec } from './prompt/ProductionSpecHandler';
export { 
  RoleValidationService,
  FabricAnalysis,
  RoleAssignment,
  RoleAssignments,
  FabricValue,
  PrintScale,
  FabricRole
} from './prompt/RoleValidationService';
export { ImageContentBuilder, ImageContent } from './prompt/ImageContentBuilder';
export { PromptTemplateBuilder } from './prompt/PromptTemplateBuilder';
export { PatternResponse } from '../types/PatternResponse';

/**
 * PromptBuilder - Facade class that orchestrates prompt building services
 * 
 * This class follows the Facade pattern, providing a simple interface
 * to the complex subsystems of prompt generation while maintaining
 * backward compatibility with existing code.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Each service has one reason to change
 * - Open/Closed: Services can be extended without modifying existing code
 * - Dependency Inversion: Depends on abstractions (static methods) not concrete implementations
 */
export class PromptBuilder {
  /**
   * Select pattern based on skill level, user preference, and fabric count
   * Delegates to PatternSelector service
   */
  static selectPattern(
    skillLevel: string,
    selectedPattern?: string,
    fabricCount?: number
  ): PatternSelectionResult {
    return PatternSelector.selectPattern(skillLevel, selectedPattern, fabricCount);
  }

  /**
   * Build complete prompt for Claude API
   * Delegates to PromptTemplateBuilder service
   */
  static buildPrompt(
    fabricCount: number,
    patternForSvg: string,
    patternInstruction: string,
    skillLevel: string,
    patternId?: string,
    productionSpec?: ProductionQuiltSpec
  ): string {
    return PromptTemplateBuilder.buildMainPrompt(
      fabricCount,
      patternForSvg,
      patternInstruction,
      skillLevel,
      patternId,
      productionSpec
    );
  }

  /**
   * Build prompt for re-analyzing with swapped roles
   * Delegates to PromptTemplateBuilder service
   */
  static buildRoleSwapPrompt(
    fabricAnalysis: FabricAnalysis[],
    newRoleAssignments: RoleAssignments,
    patternForSvg: string,
    skillLevel: string,
    patternId?: string,
    productionSpec?: ProductionQuiltSpec
  ): string {
    return PromptTemplateBuilder.buildRoleSwapPrompt(
      fabricAnalysis,
      newRoleAssignments,
      patternForSvg,
      skillLevel,
      patternId,
      productionSpec
    );
  }

  /**
   * Build image content array for Claude API
   * Delegates to ImageContentBuilder utility
   */
  static buildImageContent(
    fabricImages: string[],
    imageTypes: string[] = []
  ): ImageContent[] {
    return ImageContentBuilder.buildImageContent(fabricImages, imageTypes);
  }
}
