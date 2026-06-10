import api from '@/lib/api';

export interface FabricRecord {
  id: string;
  userId: string;
  name: string;
  color: string;
  imageUrl?: string | null;
  type?: string | null;
  notes?: string | null;
  yardageAvailable: number;
  yardageReserved: number;
  tags?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface FabricUsage {
  usedInBlockDesigns: number;
  usedInSavedQuilts: number;
  blockDesignNames: string[];
  quiltNames: string[];
}

export interface AvailabilityBreakdown {
  fabricId: string;
  name: string;
  requiredYardage: number;
  availableYardage: number;
  shortageYardage: number;
}

export interface QuiltAvailability {
  hasShortage: boolean;
  statement: string;
  summary: {
    totalRequired: number;
    totalAvailable: number;
    totalShortage: number;
  };
  breakdown: AvailabilityBreakdown[];
}

export interface FabricListData {
  fabrics: FabricRecord[];
  limit: number | null;
  used: number;
}

export interface FabricListFilters {
  search?: string;
  type?: string;
  minYardage?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class FabricService {
  async list(filters?: FabricListFilters): Promise<FabricListData> {
    const params: Record<string, string> = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.type) params.type = filters.type;
    if (filters?.minYardage) params.minYardage = filters.minYardage;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    const response = await api.get('/api/fabrics', { params });
    const data = response.data?.data;
    return {
      fabrics: data?.fabrics ?? [],
      limit: typeof data?.limit === 'number' ? data.limit : null,
      used: typeof data?.used === 'number' ? data.used : (data?.fabrics?.length ?? 0),
    };
  }

  async create(data: {
    name: string;
    color: string;
    imageUrl?: string;
    type?: string;
    notes?: string;
    yardageAvailable?: number;
    tags?: unknown;
  }): Promise<{ fabric: FabricRecord; limit: number }> {
    const response = await api.post('/api/fabrics', data);
    return response.data?.data;
  }

  async update(
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
  ): Promise<FabricRecord> {
    const response = await api.put(`/api/fabrics/${fabricId}`, data);
    return response.data?.data?.fabric;
  }

  async usage(fabricId: string): Promise<FabricUsage> {
    const response = await api.get(`/api/fabrics/${fabricId}/usage`);
    return response.data?.data?.usage;
  }

  async delete(fabricId: string, force = false): Promise<{ usage: FabricUsage }> {
    const response = await api.delete(`/api/fabrics/${fabricId}`, {
      params: { force },
    });
    return response.data?.data;
  }

  async checkAvailability(requirements: Array<{ fabricId: string; requiredYardage: number }>): Promise<QuiltAvailability> {
    const response = await api.post('/api/fabrics/check-availability/quilt', { requirements });
    return response.data?.data;
  }

  async commitQuilt(
    requirements: Array<{ fabricId: string; requiredYardage: number }>,
    mode: 'reserve' | 'consume' = 'reserve',
    quiltName?: string
  ): Promise<void> {
    await api.post('/api/fabrics/commit-quilt', { requirements, mode, quiltName });
  }
}

export default new FabricService();
