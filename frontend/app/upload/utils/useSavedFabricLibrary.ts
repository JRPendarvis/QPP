import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import toast from 'react-hot-toast';
import fabricService, { FabricRecord } from '@/services/fabricService';
import { processImageFiles } from '@/utils/imageCompression';
import { FabricYardageRef } from './types';

interface UseSavedFabricLibraryParams {
  user: unknown;
  fabricsLength: number;
  effectiveMaxFabrics: number;
  currentFabricLabels: string[];
  setFabrics: Dispatch<SetStateAction<File[]>>;
  setPreviews: Dispatch<SetStateAction<string[]>>;
  setFabricYardageRefs: Dispatch<SetStateAction<Array<FabricYardageRef | null>>>;
}

export function useSavedFabricLibrary({
  user,
  fabricsLength,
  effectiveMaxFabrics,
  currentFabricLabels,
  setFabrics,
  setPreviews,
  setFabricYardageRefs,
}: UseSavedFabricLibraryParams) {
  const [savedFabrics, setSavedFabrics] = useState<FabricRecord[]>([]);
  const [loadingSavedFabrics, setLoadingSavedFabrics] = useState(true);
  const [addingSavedFabricId, setAddingSavedFabricId] = useState<string | null>(null);
  const [savedFabricSearch, setSavedFabricSearch] = useState('');

  const filteredSavedFabrics = useMemo(() => {
    if (!savedFabricSearch.trim()) return savedFabrics;

    const query = savedFabricSearch.toLowerCase();
    return savedFabrics.filter((fabric) =>
      fabric.name.toLowerCase().includes(query) ||
      (fabric.type?.toLowerCase() || '').includes(query) ||
      (fabric.notes?.toLowerCase() || '').includes(query)
    );
  }, [savedFabrics, savedFabricSearch]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    void fabricService
      .list()
      .then((result) => {
        if (!cancelled) setSavedFabrics(result.fabrics.filter((item) => Boolean(item.imageUrl)));
      })
      .catch(() => {
        if (!cancelled) setSavedFabrics([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSavedFabrics(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const buildFileFromSavedFabric = async (fabric: FabricRecord): Promise<File> => {
    if (!fabric.imageUrl) {
      throw new Error('This saved fabric does not have a photo.');
    }

    const response = await fetch(fabric.imageUrl);
    if (!response.ok) {
      throw new Error('Unable to read saved fabric image');
    }

    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const safeName = fabric.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const rawFile = new File([blob], `${safeName || 'saved-fabric'}.${ext}`, { type: mimeType });

    const { validFiles } = await processImageFiles([rawFile]);
    if (validFiles.length === 0) {
      throw new Error('Saved fabric image is too large to use (must be 5MB or less after compression).');
    }

    return validFiles[0];
  };

  const handleAddSavedFabricToQuilt = async (fabric: FabricRecord) => {
    if (fabricsLength >= effectiveMaxFabrics) {
      toast.error(`Maximum ${effectiveMaxFabrics} fabrics reached for this quilt setup.`);
      return;
    }

    setAddingSavedFabricId(fabric.id);
    try {
      const file = await buildFileFromSavedFabric(fabric);

      setFabrics((prev) => [...prev, file]);
      setPreviews((prev) => [...prev, fabric.imageUrl as string]);
      setFabricYardageRefs((prev) => [
        ...prev,
        {
          fabricId: fabric.id,
          name: fabric.name,
          yardageAvailable: fabric.yardageAvailable,
          isLibrary: true,
        },
      ]);
      toast.success(`${fabric.name} added to quilt fabrics.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not add this saved fabric photo. Please upload it manually.');
    } finally {
      setAddingSavedFabricId(null);
    }
  };

  const handleReplaceFabricWithSaved = async (index: number, savedFabricId: string, fabrics: File[]) => {
    const selectedSavedFabric = savedFabrics.find((fabric) => fabric.id === savedFabricId);
    if (!selectedSavedFabric) {
      toast.error('Saved fabric not found.');
      return;
    }

    setAddingSavedFabricId(selectedSavedFabric.id);
    try {
      const file = await buildFileFromSavedFabric(selectedSavedFabric);

      if (index < 0 || index >= fabrics.length) {
        return;
      }

      setFabrics((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });

      setPreviews((prev) => {
        const updated = [...prev];
        updated[index] = selectedSavedFabric.imageUrl || updated[index];
        return updated;
      });

      setFabricYardageRefs((prev) => {
        const updated = [...prev];
        updated[index] = {
          fabricId: selectedSavedFabric.id,
          name: selectedSavedFabric.name,
          yardageAvailable: selectedSavedFabric.yardageAvailable,
          isLibrary: true,
        };
        return updated;
      });

      toast.success(`${selectedSavedFabric.name} applied to ${currentFabricLabels[index] || `Fabric ${index + 1}`}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not replace with saved fabric.');
    } finally {
      setAddingSavedFabricId(null);
    }
  };

  return {
    savedFabrics,
    loadingSavedFabrics,
    addingSavedFabricId,
    savedFabricSearch,
    filteredSavedFabrics,
    setSavedFabricSearch,
    handleAddSavedFabricToQuilt,
    handleReplaceFabricWithSaved,
  };
}
