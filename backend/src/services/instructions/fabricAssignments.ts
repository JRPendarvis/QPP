// src/services/instructions/fabricAssignments.ts

export type FabricAssignments = {
  /**
   * Template slot order: [COLOR1, COLOR2, COLOR3, ...]
   * For Bow Tie: [Background, Bow, Knot]
   */
  namesBySlot: string[];
};

export function normalizeSlots(namesBySlot: (string | undefined | null)[], minSlots: number): string[] {
  const cleaned = namesBySlot
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((v) => v.length > 0);

  // Ensure at least minSlots items exist
  while (cleaned.length < minSlots) {
    cleaned.push(`Fabric ${cleaned.length + 1}`);
  }

  return cleaned;
}
