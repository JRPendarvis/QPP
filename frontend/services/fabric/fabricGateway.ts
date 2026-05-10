import fabricService, { FabricRecord, FabricUsage, QuiltAvailability } from '@/services/fabricService';

export type FabricGateway = {
  list: () => Promise<FabricRecord[]>;
  create: (data: {
    name: string;
    color: string;
    imageUrl?: string;
    type?: string;
    notes?: string;
    yardageAvailable?: number;
    tags?: unknown;
  }) => Promise<{ fabric: FabricRecord; limit: number }>;
  update: (
    fabricId: string,
    data: Partial<{
      name: string;
      color: string;
      imageUrl: string | null;
      type: string | null;
      notes: string | null;
      yardageAvailable: number;
      yardageReserved: number;
      tags: unknown;
    }>
  ) => Promise<FabricRecord>;
  usage: (fabricId: string) => Promise<FabricUsage>;
  delete: (fabricId: string, force?: boolean) => Promise<{ usage: FabricUsage }>;
  checkAvailability: (requirements: Array<{ fabricId: string; requiredYardage: number }>) => Promise<QuiltAvailability>;
  commitQuilt: (
    requirements: Array<{ fabricId: string; requiredYardage: number }>,
    mode?: 'reserve' | 'consume',
    quiltName?: string
  ) => Promise<void>;
};

export const defaultFabricGateway: FabricGateway = {
  list: () => fabricService.list(),
  create: (data) => fabricService.create(data),
  update: (fabricId, data) => fabricService.update(fabricId, data),
  usage: (fabricId) => fabricService.usage(fabricId),
  delete: (fabricId, force) => fabricService.delete(fabricId, force),
  checkAvailability: (requirements) => fabricService.checkAvailability(requirements),
  commitQuilt: (requirements, mode, quiltName) => fabricService.commitQuilt(requirements, mode, quiltName),
};
