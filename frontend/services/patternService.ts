import api from '@/lib/api';
import { convertFilesToBase64 } from '@/lib/fileUtils';
import { AxiosError } from 'axios';
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
  private static readonly MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

  private static validateFabricPayload(fabrics: File[]): void {
    fabrics.forEach((file, index) => {
      if (file.size > this.MAX_IMAGE_SIZE_BYTES) {
        throw new Error(`Image ${index + 1} exceeds 5MB limit. Please replace it with a smaller image.`);
      }
    });
  }

  private static normalizeSkillLevel(skillLevel: string): string {
    const normalized = (skillLevel || '').trim().toLowerCase().replace(/\s+/g, '_');
    const valid = new Set(['beginner', 'advanced_beginner', 'intermediate', 'advanced', 'expert']);
    return valid.has(normalized) ? normalized : 'beginner';
  }

  private static normalizeSelectedPattern(selectedPattern?: string): string {
    if (!selectedPattern) return 'auto';
    const normalized = selectedPattern.trim().toLowerCase();
    if (normalized.includes('unique')) return 'unique';
    return selectedPattern;
  }

  /**
   * Generate a quilt pattern from fabric images
   */
  static async generatePattern(request: PatternGenerationRequest): Promise<PatternGenerationResponse> {
    this.validateFabricPayload(request.fabrics);
    const fabricsWithTypes = await convertFilesToBase64(request.fabrics);
    const normalizedSelectedPattern = this.normalizeSelectedPattern(request.selectedPattern);
    const forceUnique = normalizedSelectedPattern === 'unique';
    const endpoint = forceUnique ? '/api/patterns/generate-unique' : '/api/patterns/generate';

    const payload = {
      fabrics: fabricsWithTypes.map(f => f.data),
      fabricTypes: fabricsWithTypes.map(f => f.type),
      skillLevel: this.normalizeSkillLevel(request.skillLevel),
      challengeMe: request.challengeMe,
      selectedPattern: normalizedSelectedPattern,
      forceUnique,
      quiltSize: request.quiltSize,
      borderConfiguration: request.borders && request.borders.length > 0 ? {
        enabled: true,
        borders: request.borders
      } : undefined,
    };

    let response;
    try {
      response = await api.post<PatternGenerationResponse>(endpoint, payload);
    } catch (error) {
      const axiosError = error as AxiosError;
      const shouldFallbackToLegacyUniqueRoute = forceUnique && axiosError?.response?.status === 404;

      if (!shouldFallbackToLegacyUniqueRoute) {
        throw error;
      }

      response = await api.post<PatternGenerationResponse>('/api/patterns/generate', payload);
    }

    return response.data;
  }
}
