import Anthropic from '@anthropic-ai/sdk';
import { StreamResponseCollector } from '../pattern/streamResponseCollector';
import { FabricAnalysis } from '../../types/ClaudeResponse';

/**
 * Service for analyzing fabric images using Claude API
 */
export class FabricAnalysisService {
  private static readonly ANALYSIS_PROMPT = 
    `You are an expert quilter. For each uploaded fabric image, provide a JSON array with objects containing: fabricIndex, description, type (printed|solid), value (light|medium|dark), printScale (solid|small|medium|large), dominantColor (hex code). Do NOT assign roles. Example: [{"fabricIndex":1, ...}, ...]`;

  /**
   * Analyzes fabric images to extract characteristics
   * 
   * @param anthropic - Anthropic API client
   * @param imageContent - Array of image content objects for Claude API
   * @returns Array of fabric analysis objects
   * 
   * @example
   * ```typescript
   * const analysis = await FabricAnalysisService.analyze(anthropic, imageContent);
   * ```
   */
  static async analyze(
    anthropic: Anthropic,
    imageContent: any[]
  ): Promise<FabricAnalysis[]> {
    try {
      const analysisStream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: this.ANALYSIS_PROMPT },
              ...imageContent,
            ],
          },
        ],
      });
      
      const analysisResponse = await StreamResponseCollector.collect(analysisStream);
      return this.parseAnalysisResponse(analysisResponse);
      
    } catch (e) {
      console.warn('Could not parse fabric analysis, falling back to default prompt.');
      return [];
    }
  }

  /**
   * Parses fabric analysis JSON from Claude response
   */
  private static parseAnalysisResponse(response: string): FabricAnalysis[] {
    const firstBracket = response.indexOf('[');
    const lastBracket = response.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      return JSON.parse(response.substring(firstBracket, lastBracket + 1));
    }
    
    return [];
  }
}
