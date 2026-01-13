import { ClaudeResponse } from '../../types/ClaudeResponse';

/**
 * Service for parsing JSON responses from Claude API
 */
export class ResponseParser {
  /**
   * Parses JSON from Claude response text
   * 
   * @param responseText - Raw text response from Claude
   * @returns Parsed response object
   * @throws Error if JSON cannot be parsed
   * 
   * @example
   * ```typescript
   * const parsed = ResponseParser.parse(responseText);
   * console.log(parsed.patternName);
   * ```
   */
  static parse(responseText: string): ClaudeResponse {
    let jsonText = this.cleanResponseText(responseText);
    const jsonContent = this.extractJsonContent(jsonText);
    
    const parsedResponse = JSON.parse(jsonContent);
    this.logParsedResponse(parsedResponse);
    
    return parsedResponse;
  }

  /**
   * Removes code blocks and extraneous markers from response text
   */
  private static cleanResponseText(text: string): string {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    cleaned = cleaned.replace(/=+ CLAUDE RESPONSE (START|END) =+\s*/g, '');
    return cleaned;
  }

  /**
   * Extracts JSON content between first { and last }
   */
  private static extractJsonContent(text: string): string {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      console.error('Could not find valid JSON object in response');
      throw new Error('Could not parse pattern from Claude response');
    }

    return text.substring(firstBrace, lastBrace + 1);
  }

  /**
   * Logs parsed response details for debugging
   */
  private static logParsedResponse(response: ClaudeResponse): void {
    // Logging disabled for production
  }
}
