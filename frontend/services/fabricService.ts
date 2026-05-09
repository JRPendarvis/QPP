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

class FabricService {
  async list(): Promise<FabricRecord[]> {
    const response = await api.get('/api/fabrics');
    return response.data?.data?.fabrics ?? [];
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
