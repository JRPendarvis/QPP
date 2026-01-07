"use client";
import { useState, useCallback } from 'react';
import { filterImageFiles, createFilePreviews } from '@/lib/fileUtils';

export const MAX_FABRICS = 9;
export const MIN_FABRICS = 2;

/**
 * Fabric state management hook
 * Single Responsibility: Managing fabric files and previews
 */
export function useFabricState() {
  const [fabrics, setFabrics] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  /**
   * Handle file addition with validation
   */
  const handleFilesAdded = useCallback((acceptedFiles: File[]) => {
    const imageFiles = filterImageFiles(acceptedFiles);
    const remainingSlots = MAX_FABRICS - fabrics.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);

    setFabrics(prev => [...prev, ...filesToAdd]);
    const newPreviews = createFilePreviews(filesToAdd);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [fabrics.length]);

  /**
   * Remove a fabric by index
   */
  const removeFabric = useCallback((index: number) => {
    setFabrics(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Clear all fabrics and previews
   */
  const clearAll = useCallback(() => {
    setFabrics([]);
    setPreviews([]);
  }, []);

  return {
    fabrics,
    previews,
    handleFilesAdded,
    removeFabric,
    clearAll,
    setFabrics,
    setPreviews,
  };
}
