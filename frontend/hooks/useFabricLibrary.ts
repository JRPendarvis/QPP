import { useCallback, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import fabricService, { FabricRecord, FabricUsage, QuiltAvailability } from '@/services/fabricService';

function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  const apiMessage = axiosError?.response?.data?.message;
  return apiMessage || (error instanceof Error ? error.message : fallback);
}

export function useFabricLibrary() {
  const [fabrics, setFabrics] = useState<FabricRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);

  const fetchFabrics = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fabricService.list();
      setFabrics(result);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to load fabrics'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFabric = useCallback(async (data: {
    name: string;
    color: string;
    imageUrl?: string;
    type?: string;
    notes?: string;
    yardageAvailable?: number;
    tags?: unknown;
  }) => {
    try {
      const result = await fabricService.create(data);
      setFabrics((prev) => [result.fabric, ...prev]);
      setLimit(result.limit);
      toast.success('Fabric saved');
      return result.fabric;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save fabric'));
      throw error;
    }
  }, []);

  const updateFabric = useCallback(async (fabricId: string, data: Partial<{
    name: string;
    color: string;
    imageUrl: string | null;
    type: string | null;
    notes: string | null;
    yardageAvailable: number;
    yardageReserved: number;
    tags: unknown;
  }>) => {
    try {
      const updated = await fabricService.update(fabricId, data);
      setFabrics((prev) => prev.map((fabric) => (fabric.id === fabricId ? updated : fabric)));
      toast.success('Fabric updated');
      return updated;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update fabric'));
      throw error;
    }
  }, []);

  const checkUsage = useCallback(async (fabricId: string): Promise<FabricUsage> => {
    try {
      return await fabricService.usage(fabricId);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to check usage'));
      throw error;
    }
  }, []);

  const deleteFabric = useCallback(async (fabricId: string, force = false) => {
    try {
      const result = await fabricService.delete(fabricId, force);
      setFabrics((prev) => prev.filter((fabric) => fabric.id !== fabricId));
      toast.success('Fabric deleted');
      return result;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete fabric'));
      throw error;
    }
  }, []);

  const checkAvailability = useCallback(async (requirements: Array<{ fabricId: string; requiredYardage: number }>): Promise<QuiltAvailability> => {
    try {
      return await fabricService.checkAvailability(requirements);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to check fabric availability'));
      throw error;
    }
  }, []);

  const commitQuilt = useCallback(async (
    requirements: Array<{ fabricId: string; requiredYardage: number }>,
    mode: 'reserve' | 'consume' = 'reserve',
    quiltName?: string
  ) => {
    try {
      await fabricService.commitQuilt(requirements, mode, quiltName);
      toast.success(mode === 'reserve' ? 'Fabric reserved for quilt' : 'Fabric consumed');
      await fetchFabrics();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to commit quilt fabric usage'));
      throw error;
    }
  }, [fetchFabrics]);

  const usageStats = useMemo(() => ({
    used: fabrics.length,
    limit,
  }), [fabrics.length, limit]);

  return {
    fabrics,
    loading,
    usageStats,
    fetchFabrics,
    createFabric,
    updateFabric,
    checkUsage,
    deleteFabric,
    checkAvailability,
    commitQuilt,
  };
}
