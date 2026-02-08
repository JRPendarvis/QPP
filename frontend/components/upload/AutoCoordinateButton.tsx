import React, { useState } from 'react';
import { convertFilesToBase64 } from '@/lib/fileUtils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AutoCoordinateButtonProps {
  fabrics: File[];
  onRearrange?: (assignments: FabricCoordination) => void;
}

export interface FabricCoordination {
  background?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
}

/**
 * Sparkles SVG Icon
 */
const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

/**
 * Auto-Coordinate Fabrics Button
 * Uses AI to analyze fabrics and suggest optimal color coordination
 */
const AutoCoordinateButton: React.FC<AutoCoordinateButtonProps> = ({
  fabrics,
  onRearrange,
}) => {
  const [isCoordinating, setIsCoordinating] = useState(false);

  const handleAutoCoordinate = async () => {
    if (fabrics.length < 2) {
      toast.error('Upload at least 2 fabrics for auto-coordination');
      return;
    }

    if (fabrics.length > 10) {
      toast.error('Maximum 10 fabrics allowed for auto-coordination');
      return;
    }

    const loadingToast = toast.loading('AI is analyzing your fabrics...');
    setIsCoordinating(true);

    try {
      // Convert fabrics to base64
      const fabricsWithTypes = await convertFilesToBase64(fabrics);
      
      const fabricData = fabricsWithTypes.map((fabric, index) => ({
        imageData: fabric.data, // Already base64 without prefix (handled by convertFilesToBase64)
        fileName: fabrics[index].name,
      }));

      const response = await api.post('/api/patterns/auto-assign-roles', {
        fabrics: fabricData,
      });

      toast.dismiss(loadingToast);

      if (response.data.success) {
        const assignments = response.data.data;
        
        // Rearrange fabrics if handler provided
        if (onRearrange) {
          onRearrange(assignments);
          toast.success('✨ Fabrics automatically coordinated and rearranged!', { duration: 4000 });
        } else {
          // Fallback: just show coordination results
          const coordinationMessage = formatCoordinationMessage(assignments, fabrics);
          toast.success(coordinationMessage, { duration: 6000 });
        }
      } else {
        toast.error(response.data.message || 'Failed to coordinate fabrics');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Auto-coordinate error:', error);
      toast.error('Failed to auto-coordinate fabrics. Please try again.');
    } finally {
      setIsCoordinating(false);
    }
  };

  const isDisabled = fabrics.length < 2 || fabrics.length > 10 || isCoordinating;

  return (
    <button
      onClick={handleAutoCoordinate}
      disabled={isDisabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
        ${isDisabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg'
        }
      `}
      title={
        fabrics.length < 2
          ? 'Upload at least 2 fabrics'
          : fabrics.length > 10
          ? 'Maximum 10 fabrics allowed'
          : 'AI will analyze your fabrics and suggest optimal color coordination'
      }
    >
      <SparklesIcon />
      {isCoordinating ? 'Coordinating...' : 'AI Coordinate Colors'}
    </button>
  );
};

/**
 * Format coordination message for display
 */
function formatCoordinationMessage(
  assignments: FabricCoordination,
  fabrics: File[]
): string {
  const parts: string[] = [];

  if (assignments.background) {
    parts.push(`Background: ${assignments.background}`);
  }
  if (assignments.primary) {
    parts.push(`Primary: ${assignments.primary}`);
  }
  if (assignments.secondary) {
    parts.push(`Secondary: ${assignments.secondary}`);
  }
  if (assignments.accent) {
    parts.push(`Accent: ${assignments.accent}`);
  }

  return `✨ Fabric Coordination: ${parts.join(' | ')}`;
}

export default AutoCoordinateButton;
