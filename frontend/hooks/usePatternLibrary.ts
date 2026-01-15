import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface PatternLibraryItem {
  id: string;
  patternType: string | null;
  patternName: string | null;
  fabricColors: Record<string, unknown> | null;
  downloadedAt: string;
  createdAt: string;
}

/**
 * Custom hook for pattern library operations
 * Single Responsibility: Pattern library state management
 */
export function usePatternLibrary() {
  const [patterns, setPatterns] = useState<PatternLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatterns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/patterns/library');
      if (response.data.success) {
        setPatterns(response.data.data.patterns);
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
      }
      setPatterns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPattern = useCallback(async (patternId: string, patternName: string) => {
    try {
      const response = await api.get(`/api/patterns/library/${patternId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${patternName || 'pattern'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download pattern error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to download pattern');
    }
  }, []);

  const deletePattern = useCallback(async (patternId: string) => {
    try {
      await api.delete(`/api/patterns/library/${patternId}`);
      setPatterns((prev) => prev.filter((p) => p.id !== patternId));
    } catch (err) {
      console.error('Delete pattern error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete pattern');
    }
  }, []);

  const renamePattern = useCallback(async (patternId: string, newName: string) => {
    try {
      const response = await api.patch(`/api/patterns/library/${patternId}/rename`, {
        newName: newName.trim(),
      });

      if (response.data.success) {
        setPatterns((prev) =>
          prev.map((p) => (p.id === patternId ? { ...p, patternName: newName.trim() } : p))
        );
      }
    } catch (err) {
      console.error('Rename pattern error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to rename pattern');
    }
  }, []);

  return {
    patterns,
    loading,
    error,
    fetchPatterns,
    downloadPattern,
    deletePattern,
    renamePattern,
  };
}
