/**
 * Border Types
 * Types for quilt border functionality
 */

export interface Border {
  id: string;
  width: number;        // Width in inches (0.5" increments)
  fabricIndex: number;  // Index of fabric from uploaded fabrics
  order: number;        // Border order (1 = closest to quilt top)
}

export interface BorderConfiguration {
  enabled: boolean;
  borders: Border[];
}

export interface BorderDimensions {
  quiltTopWidth: number;      // Width before borders
  quiltTopHeight: number;     // Height before borders
  totalBorderWidth: number;   // Sum of all border widths
  finishedWidth: number;      // Width after borders
  finishedHeight: number;     // Height after borders
}

export interface BorderFabricRequirement {
  borderNumber: number;
  width: number;
  fabricName: string;
  strips: number;          // Number of strips needed
  totalYards: number;      // Total yardage for this border
  cutInstructions: string; // Instructions for cutting
}

export const BORDER_CONSTRAINTS = {
  MIN_WIDTH: 0.5,
  MAX_WIDTH: 12,
  STEP: 0.5,
  MAX_BORDERS: 3
} as const;
