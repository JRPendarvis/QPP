/**
 * Service for collecting streaming responses from Claude API
 */
export class StreamResponseCollector {
  /**
   * Collects streaming response from Claude API
   * 
   * @param stream - The streaming response from Anthropic API
   * @returns Complete response text
   * 
   * @example
   * ```typescript
   * const stream = await anthropic.messages.stream({...});
   * const text = await StreamResponseCollector.collect(stream);
   * ```
   */
  static async collect(stream: any): Promise<string> {
    let responseText = '';
    
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        responseText += chunk.delta.text;
      }
    }
    
    return responseText;
  }
}
