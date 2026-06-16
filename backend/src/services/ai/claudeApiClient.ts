import Anthropic from '@anthropic-ai/sdk';
import { StreamResponseCollector } from '../pattern/streamResponseCollector';
import { PatternGenerationLogger } from '../pattern/patternGenerationLogger';

/**
 * Client for making Claude API requests
 */
export class ClaudeApiClient {
<<<<<<< HEAD
  private static readonly MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
=======
  // Override via ANTHROPIC_MODEL env var to use any model your account supports.
  // Default falls back through known versioned model IDs in order of preference.
  private static readonly CANDIDATE_MODELS = [
    process.env.ANTHROPIC_MODEL,
    'claude-sonnet-4-6',
    'claude-opus-4-8',
    'claude-haiku-4-5-20251001',
  ].filter((m): m is string => Boolean(m?.trim()));

>>>>>>> 0900b9d710fffae009884b2cf5b4a4a9b1480800
  private static readonly MAX_TOKENS = 8000;

  static async generatePattern(
    anthropic: Anthropic,
    promptText: string,
    imageContent: any[]
  ): Promise<string> {
    let lastError: unknown;

    for (const model of this.CANDIDATE_MODELS) {
      try {
        console.log(`[ClaudeApiClient] Trying model: ${model}`);
        const stream = await anthropic.messages.stream({
          model,
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
        console.log(`[ClaudeApiClient] Success with model: ${model}`);
        return responseText;
      } catch (err: any) {
        lastError = err;
        const status = err?.status ?? err?.error?.status;
        const msg = err?.error?.error?.message ?? err?.message ?? String(err);
        console.warn(`[ClaudeApiClient] Model ${model} failed (${status}): ${msg}`);

        // Do not try further models for auth/billing errors
        if (status === 401 || status === 403) {
          throw err;
        }
      }
    }

    throw lastError ?? new Error('All Claude models failed');
  }
}
