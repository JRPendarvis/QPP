/**
 * Pattern Generation Request
 * Parameters required to generate a quilt pattern
 */
import { Border } from './Border';

export interface PatternGenerationRequest {
  fabrics: File[];
  skillLevel: string;
  challengeMe: boolean;
  selectedPattern?: string;
  quiltSize?: string;
  
  // Border configuration
  bordersEnabled?: boolean;
  borders?: Border[];
}
