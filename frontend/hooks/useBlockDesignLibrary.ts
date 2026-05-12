import { useState, useCallback } from 'react';
import blockDesignService, { BlockDesignListItem, SavedBlockDesign } from '@/services/blockDesignService';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

function getErrorMessage(err: unknown, fallback: string): string {
  const axiosError = err as AxiosError<{ message?: string }>;
  const status = axiosError?.response?.status;
  const apiMessage = axiosError?.response?.data?.message;

  if (status === 401) {
    return 'Please log in to manage block designs';
  }

  return apiMessage || (err instanceof Error ? err.message : fallback);
}

export function useBlockDesignLibrary() {
  const [designs, setDesigns] = useState<BlockDesignListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await blockDesignService.list();
      setDesigns(result);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to fetch block designs');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDesign = useCallback(
    async (data: {
      name: string;
      patternId: string;
      patternName: string;
      globalRotation: number;
      fabrics: unknown[];
      regions: unknown[];
    }) => {
      try {
        setError(null);
        const result = await blockDesignService.save(data as any);
        await fetchDesigns();
        toast.success('Design saved!');
        return result;
      } catch (err) {
        const message = getErrorMessage(err, 'Failed to save design');
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    [fetchDesigns]
  );

  const updateDesign = useCallback(
    async (
      designId: string,
      data: {
        name: string;
        patternId: string;
        patternName: string;
        globalRotation: number;
        fabrics: unknown[];
        regions: unknown[];
      }
    ) => {
      try {
        setError(null);
        const result = await blockDesignService.update(designId, data as any);
        await fetchDesigns();
        toast.success('Design updated!');
        return result;
      } catch (err) {
        const message = getErrorMessage(err, 'Failed to update design');
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    [fetchDesigns]
  );

  const deleteDesign = useCallback(
    async (designId: string) => {
      try {
        setError(null);
        await blockDesignService.delete(designId);
        setDesigns((prev) => prev.filter((d) => d.id !== designId));
        toast.success('Design deleted');
      } catch (err) {
        const message = getErrorMessage(err, 'Failed to delete design');
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    []
  );

  const duplicateDesign = useCallback(
    async (designId: string) => {
      try {
        setError(null);
        const design = designs.find((d) => d.id === designId);
        if (!design) throw new Error('Design not found');
        const newName = `${design.name} (Copy)`;
        const result = await blockDesignService.duplicate(designId, newName);
        await fetchDesigns();
        toast.success('Design duplicated!');
        return result;
      } catch (err) {
        const message = getErrorMessage(err, 'Failed to duplicate design');
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    [designs, fetchDesigns]
  );

  return {
    designs,
    loading,
    error,
    fetchDesigns,
    saveDesign,
    updateDesign,
    deleteDesign,
    duplicateDesign,
  };
}
