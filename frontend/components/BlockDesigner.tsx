'use client';

import { useState, useCallback } from 'react';

export type FabricRole = 'background' | 'primary' | 'secondary' | 'accent' | null;
type NonNullFabricRole = Exclude<FabricRole, null>;

interface BlockDesignerProps {
  gridSize?: number;
  onSave?: (blockData: BlockData) => void;
  fabricImages?: Record<NonNullFabricRole, string | null>;
}

export interface BlockData {
  name: string;
  description?: string;
  blockSize: number;
  gridData: FabricRole[][];
}

export default function BlockDesigner({ 
  gridSize = 3, 
  onSave,
  fabricImages = {
    background: null,
    primary: null,
    secondary: null,
    accent: null
  }
}: BlockDesignerProps) {
  const [selectedRole, setSelectedRole] = useState<FabricRole>('primary');
  const [blockName, setBlockName] = useState('');
  const [description, setDescription] = useState('');
  const [grid, setGrid] = useState<FabricRole[][]>(
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(null))
  );

  const handleCellClick = useCallback((row: number, col: number) => {
    const newGrid = grid.map((r, i) => 
      i === row 
        ? r.map((cell, j) => j === col ? selectedRole : cell)
        : r
    );
    setGrid(newGrid);
  }, [grid, selectedRole]);

  const handleClear = () => {
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)));
  };

  const handleSave = () => {
    if (!blockName.trim()) {
      alert('Please enter a block name');
      return;
    }

    const blockData: BlockData = {
      name: blockName.trim(),
      description: description.trim() || undefined,
      blockSize: gridSize * gridSize,
      gridData: grid
    };

    onSave?.(blockData);
  };

  const getRoleColor = (role: FabricRole): string => {
    if (!role) return '#e5e7eb';
    
    // If we have actual fabric images, we'll use them
    // For now, return solid colors as placeholders
    const colors = {
      background: '#f3f4f6',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b'
    };
    return colors[role];
  };

  const getRoleStyle = (role: FabricRole): React.CSSProperties => {
    if (!role) {
      return { backgroundColor: '#e5e7eb' };
    }

    const imageUrl = fabricImages[role as NonNullFabricRole];
    if (imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }

    return { backgroundColor: getRoleColor(role) };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Block Designer</h2>

        {/* Block Info */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Name *
            </label>
            <input
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="e.g., My Nine Patch"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your block design..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Fabric Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Fabric Role to Paint
          </label>
          <div className="flex gap-3 flex-wrap">
            {(['background', 'primary', 'secondary', 'accent'] as NonNullFabricRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  selectedRole === role
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                style={getRoleStyle(role)}
              >
                <span className={role === 'background' ? 'text-gray-700' : 'text-white'}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Canvas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Design Your Block ({gridSize}x{gridSize} Grid)
          </label>
          <div 
            className="inline-block border-4 border-gray-800 bg-gray-100 p-2"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 60px)`,
              gap: '2px'
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className="w-[60px] h-[60px] border border-gray-400 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                  style={getRoleStyle(cell)}
                  title={cell || 'Empty'}
                />
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            Clear Grid
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Save Block Design
          </button>
        </div>
      </div>
    </div>
  );
}
