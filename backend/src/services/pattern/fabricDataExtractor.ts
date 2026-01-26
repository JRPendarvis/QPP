import { ClaudeResponse } from '../../types/ClaudeResponse';

/**
 * Extracts fabric data from Claude response
 */
export class FabricDataExtractor {
  /**
   * Extracts fabric analysis and colors from response
   */
  static extract(parsedResponse: ClaudeResponse): {
    fabricAnalysis: any[];
    fabricColors: string[];
  } {
    return {
      fabricAnalysis: parsedResponse.fabricAnalysis || [],
      fabricColors: parsedResponse.fabricColors || []
    };
  }
}
