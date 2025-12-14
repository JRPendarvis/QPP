import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface QuiltPattern {
  id?: string;
  patternName: string;
  description: string;
  fabricLayout: string;
  difficulty: string;
  estimatedSize: string;
  instructions: string[];
  visualSvg: string;
}

export function usePatternGeneration() {
  const [fabrics, setFabrics] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [pattern, setPattern] = useState<QuiltPattern | null>(null);
  const [error, setError] = useState('');

  const MAX_FABRICS = 8;
  const MIN_FABRICS = 2;

  // Handle file addition
  const handleFilesAdded = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    const remainingSlots = MAX_FABRICS - fabrics.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);

    setFabrics(prev => [...prev, ...filesToAdd]);
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [fabrics.length]);

  // Remove a fabric
  const removeFabric = (index: number) => {
    setFabrics(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all
  const clearAll = () => {
    setFabrics([]);
    setPreviews([]);
    setPattern(null);
    setError('');
  };

  // Convert file to base64 with mime type
  const fileToBase64 = (file: File): Promise<{data: string, type: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve({
          data: base64Data,
          type: file.type
        });
      };
      reader.onerror = error => reject(error);
    });
  };

  // Generate pattern - accepts selectedPattern as third parameter
  const generatePattern = async (
    userSkillLevel: string, 
    challengeMe: boolean,
    selectedPattern?: string
  ) => {
    setGenerating(true);
    setError('');
    setPattern(null);

    try {
      const fabricsWithTypes = await Promise.all(fabrics.map(file => fileToBase64(file)));
      const response = await api.post('/api/patterns/generate', { 
        fabrics: fabricsWithTypes.map(f => f.data),
        fabricTypes: fabricsWithTypes.map(f => f.type),
        skillLevel: userSkillLevel,
        challengeMe: challengeMe,
        selectedPattern: selectedPattern || 'auto',
      });

      if (response.data.success) {
        setPattern(response.data.data.pattern);
        console.log('✅ Pattern received:', response.data.data.pattern.patternName);
        console.log('✅ Pattern ID:', response.data.data.pattern.id);
      } else {
        setError(response.data.message || 'Failed to generate pattern');
      }
    } catch (err: any) {
      console.error('Pattern generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate pattern. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return {
    fabrics,
    previews,
    generating,
    pattern,
    error,
    MAX_FABRICS,
    MIN_FABRICS,
    handleFilesAdded,
    removeFabric,
    clearAll,
    generatePattern,
  };
}