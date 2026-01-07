import { QuiltPattern } from './QuiltPattern';

/**
 * Pattern Generation Response
 * API response structure for pattern generation
 */
export interface PatternGenerationResponse {
  success: boolean;
  data?: {
    pattern: QuiltPattern;
    usage?: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
  message?: string;
}
