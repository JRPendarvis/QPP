/**
 * Pattern generation error types
 */
export type PatternErrorType = 'SUBSCRIPTION_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';

/**
 * Structured error for pattern generation
 */
export interface PatternGenerationError {
  type: PatternErrorType;
  message: string;
  originalError?: unknown;
}
