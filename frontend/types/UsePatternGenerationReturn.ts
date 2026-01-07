import { QuiltPattern } from '@/types/QuiltPattern';

/**
 * Return type for usePatternGeneration hook
 * Provides complete pattern generation functionality
 */
export interface UsePatternGenerationReturn {
  // Fabric state
  fabrics: File[];
  previews: string[];
  handleFilesAdded: (files: File[]) => void;
  removeFabric: (index: number) => void;
  setFabrics: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Pattern state
  generating: boolean;
  pattern: QuiltPattern | null;
  error: string;
  
  // Constants
  MAX_FABRICS: number;
  MIN_FABRICS: number;
  
  // Actions
  clearAll: () => void;
  resetPattern: () => void;
  generatePattern: (
    userSkillLevel: string,
    challengeMe: boolean,
    selectedPattern?: string
  ) => Promise<void>;
}
