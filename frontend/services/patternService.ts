import api from '@/lib/api';
import { convertFilesToBase64 } from '@/lib/fileUtils';
import { QuiltPattern } from '@/types/QuiltPattern';
import { PatternGenerationRequest } from '@/types/PatternGenerationRequest';
import { PatternGenerationResponse } from '@/types/PatternGenerationResponse';

// Re-export types for convenience
export type { QuiltPattern, PatternGenerationRequest, PatternGenerationResponse };

/**
 * Pattern API Service
 * Single Responsibility: Pattern generation API communication
 */
export class PatternService {
  /**
   * Generate a quilt pattern from fabric images
   */
  static async generatePattern(request: PatternGenerationRequest): Promise<PatternGenerationResponse> {
    const fabricsWithTypes = await convertFilesToBase64(request.fabrics);

    const response = await api.post<PatternGenerationResponse>('/api/patterns/generate', {
      fabrics: fabricsWithTypes.map(f => f.data),
      fabricTypes: fabricsWithTypes.map(f => f.type),
      skillLevel: request.skillLevel,
      challengeMe: request.challengeMe,
      selectedPattern: request.selectedPattern || 'auto',
    });

    return response.data;
  }
}
