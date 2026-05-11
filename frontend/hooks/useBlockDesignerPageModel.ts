import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { BlockRegion, FabricOption } from '@/components/block-designer/BlockDesignerCanvas';
import { useBlockDesignLibrary } from '@/hooks/useBlockDesignLibrary';
import blockDesignService from '@/services/blockDesignService';
import fabricService, { FabricRecord } from '@/services/fabricService';
import { useAuth } from '@/contexts/AuthContext';

type PatternMeta = {
  id: string;
  name: string;
  minFabrics: number;
  maxFabrics: number;
};

type UseBlockDesignerPageModelArgs = {
  patterns: PatternMeta[];
  defaultPatternId: string;
  defaultFabrics: FabricOption[];
  getBaseRegions: (patternId: string) => BlockRegion[];
  sanitizeLoadedFabrics: (input: FabricOption[]) => FabricOption[];
};

export function useBlockDesignerPageModel({
  patterns,
  defaultPatternId,
  defaultFabrics,
  getBaseRegions,
  sanitizeLoadedFabrics,
}: UseBlockDesignerPageModelArgs) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get('design');

  const { user, loading: authLoading } = useAuth();
  const { saveDesign, updateDesign } = useBlockDesignLibrary();

  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const [selectedPatternId, setSelectedPatternId] = useState<string>(defaultPatternId);
  const selectedPattern = patterns.find((pattern) => pattern.id === selectedPatternId) || patterns[0];

  const [fabrics, setFabrics] = useState<FabricOption[]>(defaultFabrics);
  const [fabricPreviews, setFabricPreviews] = useState<(string | null)[]>(Array(9).fill(null));
  const [libraryFabrics, setLibraryFabrics] = useState<FabricRecord[]>([]);
  const [globalRotation, setGlobalRotation] = useState<0 | 90 | 180 | 270>(0);
  const [regions, setRegions] = useState<BlockRegion[]>(() => getBaseRegions(defaultPatternId));
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;

    void fabricService
      .list()
      .then((result) => {
        if (!cancelled) setLibraryFabrics(result.fabrics);
      })
      .catch(() => {
        if (!cancelled) setLibraryFabrics([]);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading) return;

    if (designId && !user) {
      toast.error('Please log in to edit saved block designs');
      router.push('/login');
      return;
    }

    if (!designId) return;
    let cancelled = false;

    void blockDesignService
      .getById(designId)
      .then((saved) => {
        if (cancelled) return;

        const normalizeArray = <T,>(value: unknown): T[] => {
          if (Array.isArray(value)) return value as T[];
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed) ? (parsed as T[]) : [];
            } catch {
              return [];
            }
          }
          return [];
        };

        const loadedRegions = normalizeArray<BlockRegion>(saved.regions);
        const loadedFabrics = sanitizeLoadedFabrics(normalizeArray<FabricOption>(saved.fabrics));

        setCurrentDesignId(saved.id);
        setSelectedPatternId(saved.patternId);
        setRegions(loadedRegions.length > 0 ? loadedRegions : getBaseRegions(saved.patternId));
        setGlobalRotation((saved.globalRotation as 0 | 90 | 180 | 270) ?? 0);
        setFabricPreviews(Array(9).fill(null));
        setFabrics((prev) => {
          const next = [...prev];
          loadedFabrics.forEach((fabric, index) => {
            if (index < next.length) next[index] = { ...next[index], ...fabric };
          });
          return next;
        });
        toast.success(`Loaded "${saved.name}"`);
      })
      .catch(() => toast.error('Could not load design'));

    return () => {
      cancelled = true;
    };
  }, [authLoading, designId, user, router, getBaseRegions, sanitizeLoadedFabrics]);

  const maxFabrics = selectedPattern?.maxFabrics || 4;
  const activeFabrics = useMemo(() => fabrics.slice(0, maxFabrics), [fabrics, maxFabrics]);

  const handleSaveDesign = useCallback(async () => {
    if (!user) {
      toast.error('Please log in to save designs');
      return;
    }

    if (!selectedPattern) {
      toast.error('No pattern selected');
      return;
    }

    const designName = prompt('Design name:', `${selectedPattern.name} Design`);
    if (!designName) return;

    setIsSaving(true);
    try {
      const data = {
        name: designName.trim(),
        patternId: selectedPatternId,
        patternName: selectedPattern.name,
        globalRotation,
        fabrics: activeFabrics.map((fabric) => {
          if (typeof fabric.previewUrl === 'string' && (fabric.previewUrl.startsWith('data:') || fabric.previewUrl.startsWith('http://') || fabric.previewUrl.startsWith('https://'))) {
            return fabric;
          }
          const { previewUrl: _ignored, ...rest } = fabric;
          return rest;
        }),
        regions,
      };

      if (currentDesignId) {
        await updateDesign(currentDesignId, data);
      } else {
        const result = await saveDesign(data);
        setCurrentDesignId(result.id);
      }
    } finally {
      setIsSaving(false);
    }
  }, [user, selectedPattern, selectedPatternId, globalRotation, activeFabrics, regions, currentDesignId, updateDesign, saveDesign]);

  const handleLoadDesign = useCallback(() => {
    router.push('/my-block-designs');
  }, [router]);

  const handleDuplicateDesign = useCallback(() => {
    if (!currentDesignId) {
      toast.error('Save a design first');
      return;
    }
    toast('Duplicate feature coming soon');
  }, [currentDesignId]);

  const resetForPattern = useCallback((patternId: string) => {
    setSelectedPatternId(patternId);
    setRegions(getBaseRegions(patternId));
    setGlobalRotation(0);
  }, [getBaseRegions]);

  const handleFabricPhotoUpload = useCallback((fabricIndex: number, file: File) => {
    const url = URL.createObjectURL(file);

    setFabricPreviews((prev) => {
      const next = [...prev];
      if (next[fabricIndex]) URL.revokeObjectURL(next[fabricIndex]!);
      next[fabricIndex] = url;
      return next;
    });

    setFabrics((current) => {
      const next = [...current];
      const target = next[fabricIndex];
      if (!target) return current;

      next[fabricIndex] = {
        ...target,
        previewUrl: url,
        imageUrl: undefined,
        libraryFabricId: undefined,
      };
      return next;
    });
  }, []);

  const handleFabricPhotoClear = useCallback((fabricIndex: number) => {
    setFabricPreviews((prev) => {
      const next = [...prev];
      if (next[fabricIndex]) URL.revokeObjectURL(next[fabricIndex]!);
      next[fabricIndex] = null;
      return next;
    });

    setFabrics((current) => {
      const next = [...current];
      const target = next[fabricIndex];
      if (!target) return current;

      const { previewUrl: _removed, imageUrl: _removedImage, ...rest } = target;
      next[fabricIndex] = rest;
      return next;
    });
  }, []);

  const handleApplyLibraryFabric = useCallback((fabricIndex: number, selectedId: string) => {
    const source = libraryFabrics.find((item) => item.id === selectedId);
    if (!source) return;

    setFabricPreviews((prev) => {
      const next = [...prev];
      if (next[fabricIndex]) URL.revokeObjectURL(next[fabricIndex]!);
      next[fabricIndex] = null;
      return next;
    });

    setFabrics((current) => {
      const next = [...current];
      const target = next[fabricIndex];
      if (!target) return current;

      next[fabricIndex] = {
        ...target,
        name: source.name,
        color: source.color,
        imageUrl: source.imageUrl || undefined,
        previewUrl: undefined,
        libraryFabricId: source.id,
      };
      return next;
    });
  }, [libraryFabrics]);

  const handleFabricChange = useCallback((fabricIndex: number, field: 'name' | 'color', value: string) => {
    setFabrics((current) => {
      const next = [...current];
      const target = next[fabricIndex];
      if (!target) return current;

      next[fabricIndex] = {
        ...target,
        [field]: value,
      };
      return next;
    });
  }, []);

  const handleRegionFabricChange = useCallback((regionId: string, fabricIndex: number) => {
    setRegions((current) => current.map((region) => (
      region.id === regionId ? { ...region, fabricIndex } : region
    )));
  }, []);

  const handleRegionRotationChange = useCallback((regionId: string, rotation: 0 | 90 | 180 | 270) => {
    setRegions((current) => current.map((region) => (
      region.id === regionId ? { ...region, rotation } : region
    )));
  }, []);

  return {
    authLoading,
    currentDesignId,
    isSaving,
    isInstructionsOpen,
    selectedPatternId,
    selectedPattern,
    fabricPreviews,
    libraryFabrics,
    globalRotation,
    regions,
    fileInputRefs,
    activeFabrics,
    setGlobalRotation,
    setIsInstructionsOpen,
    handleSaveDesign,
    handleLoadDesign,
    handleDuplicateDesign,
    resetForPattern,
    handleFabricPhotoUpload,
    handleFabricPhotoClear,
    handleApplyLibraryFabric,
    handleFabricChange,
    handleRegionFabricChange,
    handleRegionRotationChange,
  };
}
