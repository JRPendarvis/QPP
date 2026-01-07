/**
 * Pattern Generation Request
 * Parameters required to generate a quilt pattern
 */
export interface PatternGenerationRequest {
  fabrics: File[];
  skillLevel: string;
  challengeMe: boolean;
  selectedPattern?: string;
}
