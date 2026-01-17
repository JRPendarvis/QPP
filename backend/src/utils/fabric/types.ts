/**
 * Shared types for fabric calculations
 */

export interface QuiltDimensions {
  width: number;  // inches
  height: number; // inches
}

export interface FabricRequirement {
  role: string;
  yards: number;
  description: string;
  inches?: number; // For binding - total inches needed
}

export interface FabricInfo {
  color: string;
  type: 'printed' | 'solid';
  description?: string;
}
