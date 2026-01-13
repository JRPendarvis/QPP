import Anthropic from '@anthropic-ai/sdk';
import { StreamResponseCollector } from '../pattern/streamResponseCollector';
import { PatternGenerationLogger } from '../pattern/patternGenerationLogger';

/**
 * Client for making Claude API requests
 */
export class ClaudeApiClient {
  private static readonly MODEL = 'claude-sonnet-4-20250514';
  private static readonly MAX_TOKENS = 8000;

  /**
   * Calls Claude API for pattern generation
   * 
   * @param anthropic - Anthropic API client
   * @param promptText - The prompt text for Claude
   * @param imageContent - Array of image content objects
   * @returns Response text from Claude API
   * 
   * @example
   * ```typescript
   * const response = await ClaudeApiClient.generatePattern(
   *   anthropic,
   *   'Create a quilt pattern...',
   *   imageContent
   * );
   * ```
   */
  static async generatePattern(
    anthropic: Anthropic,
    promptText: string,
    imageContent: any[]
  ): Promise<string> {
    const stream = await anthropic.messages.stream({
      model: this.MODEL,
      max_tokens: this.MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            ...imageContent,
          ],
        },
      ],
    });

    const responseText = await StreamResponseCollector.collect(stream);
    PatternGenerationLogger.logResponsePreview(responseText);
    
    return responseText;
  }
}
