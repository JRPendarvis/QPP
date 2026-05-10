import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { useFabricLibrary } from '@/hooks/useFabricLibrary';
import { buildRequirementPayload, RequirementInputRow } from '@/components/fabrics/formatters';

export type FabricAvailabilityResult = {
  statement: string;
  hasShortage: boolean;
  summary: {
    totalRequired: number;
    totalAvailable: number;
    totalShortage: number;
  };
  breakdown: Array<{
    fabricId: string;
    name: string;
    requiredYardage: number;
    availableYardage: number;
    shortageYardage: number;
  }>;
};

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
    checkAvailability,
    commitQuilt,
  } = useFabricLibrary();

  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [usageWarning, setUsageWarning] = useState<string | null>(null);
  const [quiltName, setQuiltName] = useState('');
  const [requirements, setRequirements] = useState<RequirementInputRow[]>([]);
  const [availabilityResult, setAvailabilityResult] = useState<FabricAvailabilityResult | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    void fetchFabrics();
  }, [authLoading, user, router, fetchFabrics]);

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

  const runAvailabilityCheck = useCallback(async () => {
    const payload = buildRequirementPayload(requirements);
    if (payload.length === 0) return;

    const result = await checkAvailability(payload);
    setAvailabilityResult(result);
  }, [checkAvailability, requirements]);

  const handleStartQuilt = useCallback(async () => {
    const payload = buildRequirementPayload(requirements);
    if (payload.length === 0) return;

    await commitQuilt(payload, 'reserve', quiltName || undefined);
    await runAvailabilityCheck();
  }, [commitQuilt, quiltName, requirements, runAvailabilityCheck]);

  const handleQuickUpdateYardage = useCallback(async (fabricId: string, yardageAvailable: number) => {
    await updateFabric(fabricId, { yardageAvailable });
  }, [updateFabric]);

  return {
    authLoading,
    fabrics,
    loading,
    usageStats,
    selectedFabricId,
    deletingId,
    usageWarning,
    quiltName,
    requirements,
    availabilityResult,
    setSelectedFabricId,
    setQuiltName,
    setRequirements,
    handleCreate,
    handleDelete,
    handleQuickUpdateYardage,
    runAvailabilityCheck,
    handleStartQuilt,
  };
}
