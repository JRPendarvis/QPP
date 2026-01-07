import { QuiltPattern } from '../types/QuiltPattern';
import { ClaudeResponse } from '../types/ClaudeResponse';

/**
 * Service for logging pattern generation activities
 */
export class PatternGenerationLogger {
  /**
   * Logs Claude API request parameters
   */
  static logRequestParameters(
    patternForSvg: string,
    patternId: string | undefined,
    skillLevel: string,
    fabricCount: number,
    imageTypes: string[],
    selectedPattern?: string
  ): void {
    console.log(`🎯 Final pattern: ${patternForSvg}, Skill level: ${skillLevel}`);
    console.log('═══════════════════════════════════════════════');
    console.log('📤 CLAUDE API REQUEST PARAMETERS:');
    console.log(`  Pattern Type: ${patternForSvg}`);
    console.log(`  Pattern ID: ${patternId || 'N/A'}`);
    console.log(`  Skill Level: ${skillLevel}`);
    console.log(`  Fabric Images: ${fabricCount}`);
    console.log(`  Image Types: ${imageTypes.join(', ') || 'auto-detect'}`);
    console.log(`  Selected Pattern: ${selectedPattern || 'auto (fabric-count optimized)'}`);
    console.log('═══════════════════════════════════════════════');
  }

  /**
   * Logs Claude API response preview
   */
  static logResponsePreview(responseText: string): void {
    console.log('===== CLAUDE RESPONSE START =====');
    console.log(responseText.substring(0, 1000));
    console.log('===== CLAUDE RESPONSE END =====');
  }

  /**
   * Logs successful pattern generation completion
   */
  static logPatternSuccess(
    pattern: QuiltPattern,
    patternForSvg: string,
    parsedResponse: ClaudeResponse
  ): void {
    console.log(`✅ Successfully generated pattern: ${pattern.patternName}`);
    console.log(`   Pattern type: ${patternForSvg}`);
    console.log(`   Difficulty: ${pattern.difficulty}`);
    console.log(`   Colors: ${parsedResponse.fabricColors?.join(', ') || 'none'}`);
  }
}
