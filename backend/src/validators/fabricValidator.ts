export type CreateFabricPayload = {
  name?: string;
  color?: string;
  imageUrl?: string;
  type?: string;
  notes?: string;
  tags?: unknown;
  yardageAvailable?: number;
};

export type UpdateFabricPayload = {
  name?: string;
  color?: string;
  imageUrl?: string | null;
  type?: string | null;
  notes?: string | null;
  tags?: unknown;
  yardageAvailable?: number;
  yardageReserved?: number;
};

export type FabricRequirement = {
  fabricId: string;
  requiredYardage: number;
};

export class FabricValidator {
  static validateCreatePayload(payload: CreateFabricPayload): string | null {
    if (!payload.name || typeof payload.name !== 'string') {
      return 'Fabric name is required';
    }

    if (!payload.color || typeof payload.color !== 'string') {
      return 'Fabric color is required';
    }

    const yardageAvailable = Number(payload.yardageAvailable ?? 0);
    if (!Number.isFinite(yardageAvailable) || yardageAvailable < 0) {
      return 'Yardage must be a non-negative number';
    }

    return null;
  }

  static validateUpdatePayload(payload: UpdateFabricPayload): string | null {
    if (payload.yardageAvailable !== undefined) {
      const value = Number(payload.yardageAvailable);
      if (!Number.isFinite(value) || value < 0) {
        return 'Yardage must be a non-negative number';
      }
    }

    if (payload.yardageReserved !== undefined) {
      const value = Number(payload.yardageReserved);
      if (!Number.isFinite(value) || value < 0) {
        return 'Reserved yardage must be a non-negative number';
      }
    }

    return null;
  }

  static normalizeRequirements(input: unknown): FabricRequirement[] {
    if (!Array.isArray(input)) return [];

    return input
      .map((item) => {
        if (!item || typeof item !== 'object') return null;

        const data = item as { fabricId?: unknown; requiredYardage?: unknown };
        if (typeof data.fabricId !== 'string') return null;

        const requiredYardage = Number(data.requiredYardage);
        if (!Number.isFinite(requiredYardage) || requiredYardage < 0) return null;

        return {
          fabricId: data.fabricId,
          requiredYardage,
        };
      })
      .filter((item): item is FabricRequirement => Boolean(item));
  }
}
