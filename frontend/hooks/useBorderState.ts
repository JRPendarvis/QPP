/**
 * useBorderState Hook
 * Manages border configuration state and operations
 */
import { useState, useCallback } from 'react';
import { Border, BorderConfiguration, BORDER_CONSTRAINTS } from '@/types/Border';
import { BorderValidator } from '@/utils/BorderValidator';
import { BorderReorderService } from '@/utils/BorderReorderService';
import { v4 as uuidv4 } from 'uuid';

export interface UseBorderStateReturn {
  borderConfiguration: BorderConfiguration;
  toggleBorders: (enabled: boolean) => void;
  addBorder: (fabricIndex?: number) => void;
  removeBorder: (borderId: string) => void;
  updateBorder: (borderId: string, updates: Partial<Border>) => void;
  reorderBorder: (borderId: string, direction: 'up' | 'down') => void;
  resetBorders: () => void;
  validateBorderWidth: (width: number) => { valid: boolean; error?: string };
}

export function useBorderState(initialFabricIndex: number = 0): UseBorderStateReturn {
  const [borderConfiguration, setBorderConfiguration] = useState<BorderConfiguration>({
    enabled: false,
    borders: []
  });

  const toggleBorders = useCallback((enabled: boolean) => {
    setBorderConfiguration(prev => ({
      ...prev,
      enabled,
      borders: enabled && prev.borders.length === 0 
        ? [{
            id: uuidv4(),
            width: 2.5,
            fabricIndex: initialFabricIndex,
            order: 1
          }]
        : prev.borders
    }));
  }, [initialFabricIndex]);

  const addBorder = useCallback((fabricIndex: number = initialFabricIndex) => {
    setBorderConfiguration(prev => {
      if (prev.borders.length >= BORDER_CONSTRAINTS.MAX_BORDERS) {
        return prev;
      }

      const newOrder = prev.borders.length + 1;
      const newBorder: Border = {
        id: uuidv4(),
        width: 2.5,
        fabricIndex,
        order: newOrder
      };

      return {
        ...prev,
        borders: [...prev.borders, newBorder]
      };
    });
  }, [initialFabricIndex]);

  const removeBorder = useCallback((borderId: string) => {
    setBorderConfiguration(prev => {
      const filtered = prev.borders.filter(b => b.id !== borderId);
      const reordered = BorderReorderService.resequence(filtered);

      return {
        ...prev,
        borders: reordered
      };
    });
  }, []);

  const updateBorder = useCallback((borderId: string, updates: Partial<Border>) => {
    setBorderConfiguration(prev => ({
      ...prev,
      borders: prev.borders.map(border =>
        border.id === borderId ? { ...border, ...updates } : border
      )
    }));
  }, []);

  const reorderBorder = useCallback((borderId: string, direction: 'up' | 'down') => {
    setBorderConfiguration(prev => ({
      ...prev,
      borders: BorderReorderService.reorder(prev.borders, borderId, direction)
    }));
  }, []);

  const resetBorders = useCallback(() => {
    setBorderConfiguration({
      enabled: false,
      borders: []
    });
  }, []);

  const validateBorderWidth = useCallback((width: number): { valid: boolean; error?: string } => {
    return BorderValidator.validateBorderWidth(width);
  }, []);

  return {
    borderConfiguration,
    toggleBorders,
    addBorder,
    removeBorder,
    updateBorder,
    reorderBorder,
    resetBorders,
    validateBorderWidth
  };
}
