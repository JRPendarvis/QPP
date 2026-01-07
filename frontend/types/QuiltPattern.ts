/**
 * QuiltPattern interface
 * Represents a generated quilt pattern with all its metadata
 */
export interface QuiltPattern {
  id?: string;
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
}
