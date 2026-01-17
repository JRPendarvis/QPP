/**
 * useBorderState Hook
 * Manages border configuration state and operations
 */
import { useState, useCallback } from 'react';
import { Border, BorderConfiguration, BORDER_CONSTRAINTS } from '@/types/Border';
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
      
      // Reorder remaining borders
      const reordered = filtered.map((border, index) => ({
        ...border,
        order: index + 1
      }));

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
    setBorderConfiguration(prev => {
      const sorted = [...prev.borders].sort((a, b) => a.order - b.order);
      const currentIndex = sorted.findIndex(b => b.id === borderId);
      
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= sorted.length) {
        return prev;
      }

      // Swap orders
      const reordered = [...sorted];
      [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];
      
      // Reassign order numbers
      const withNewOrders = reordered.map((border, index) => ({
        ...border,
        order: index + 1
      }));

      return {
        ...prev,
        borders: withNewOrders
      };
    });
  }, []);

  const resetBorders = useCallback(() => {
    setBorderConfiguration({
      enabled: false,
      borders: []
    });
  }, []);

  const validateBorderWidth = useCallback((width: number): { valid: boolean; error?: string } => {
    if (width < BORDER_CONSTRAINTS.MIN_WIDTH) {
      return { 
        valid: false, 
        error: `Border width must be at least ${BORDER_CONSTRAINTS.MIN_WIDTH}"` 
      };
    }
    
    if (width > BORDER_CONSTRAINTS.MAX_WIDTH) {
      return { 
        valid: false, 
        error: `Border width cannot exceed ${BORDER_CONSTRAINTS.MAX_WIDTH}"` 
      };
    }
    
    // Check if width is a valid increment
    const remainder = width % BORDER_CONSTRAINTS.STEP;
    if (Math.abs(remainder) > 0.01 && Math.abs(remainder - BORDER_CONSTRAINTS.STEP) > 0.01) {
      return { 
        valid: false, 
        error: `Border width must be in ${BORDER_CONSTRAINTS.STEP}" increments` 
      };
    }
    
    return { valid: true };
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
