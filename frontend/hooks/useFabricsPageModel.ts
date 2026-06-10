import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { useFabricLibrary } from '@/hooks/useFabricLibrary';
import { FabricListFilters } from '@/services/fabricService';

export function useFabricsPageModel() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    fabrics,
    loading,
    usageStats,
    fetchFabrics,
    createFabric,
    updateFabric,
    checkUsage,
    deleteFabric,
  } = useFabricLibrary();

  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [usageWarning, setUsageWarning] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<FabricListFilters>({});
  const [totalCount, setTotalCount] = useState(0);
  const [editingFabricId, setEditingFabricId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    void fetchFabrics();
  }, [authLoading, user, router, fetchFabrics]);

  // Update totalCount whenever fabrics change and no filters are applied
  useEffect(() => {
    const hasFilters = searchFilters.search || searchFilters.type || searchFilters.minYardage;
    if (!hasFilters) {
      setTotalCount(fabrics.length);
    }
  }, [fabrics.length, searchFilters]);

  const handleSearchChange = useCallback(async (filters: FabricListFilters) => {
    setSearchFilters(filters);
    await fetchFabrics(filters);
  }, [fetchFabrics]);

  const handleCreate = useCallback(async (data: {
    name: string;
    color: string;
    yardageAvailable: number;
    imageUrl?: string;
    type?: string;
    notes?: string;
  }) => {
    await createFabric(data);
  }, [createFabric]);

  const handleDelete = useCallback(async (fabricId: string) => {
    setDeletingId(fabricId);
    try {
      const usage = await checkUsage(fabricId);
      const totalUsage = usage.usedInBlockDesigns + usage.usedInSavedQuilts;

      if (totalUsage > 0) {
        setUsageWarning(`This fabric is used in ${usage.usedInBlockDesigns} block design(s) and ${usage.usedInSavedQuilts} saved quilt(s).`);
        const proceed = window.confirm(
          `This fabric is used in ${usage.usedInBlockDesigns} block design(s) and ${usage.usedInSavedQuilts} saved quilt(s). Delete anyway?`
        );

        if (!proceed) return;
        await deleteFabric(fabricId, true);
        return;
      }

      await deleteFabric(fabricId);
    } finally {
      setDeletingId(null);
    }
  }, [checkUsage, deleteFabric]);

  const handleQuickUpdateYardage = useCallback(async (fabricId: string, yardageAvailable: number) => {
    await updateFabric(fabricId, { yardageAvailable });
  }, [updateFabric]);

  const handleEditFabric = useCallback(async (
    fabricId: string,
    updates: { name?: string; type?: string | null; notes?: string | null }
  ) => {
    await updateFabric(fabricId, updates);
  }, [updateFabric]);

  return {
    authLoading,
    fabrics,
    loading,
    usageStats,
    selectedFabricId,
    deletingId,
    usageWarning,
    totalCount,
    editingFabricId,
    setSelectedFabricId,
    setEditingFabricId,
    handleCreate,
    handleDelete,
    handleQuickUpdateYardage,
    handleEditFabric,
  };
}
