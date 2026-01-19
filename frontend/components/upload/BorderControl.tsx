/**
 * BorderControl Component
 * UI for managing quilt borders (add, remove, reorder, configure)
 */
'use client';

import React from 'react';
import { Border, BORDER_CONSTRAINTS } from '@/types/Border';

interface BorderControlProps {
  enabled: boolean;
  borders: Border[];
  fabricNames: string[];
  onToggle: (enabled: boolean) => void;
  onAdd: () => void;
  onRemove: (borderId: string) => void;
  onUpdate: (borderId: string, updates: Partial<Border>) => void;
  onReorder: (borderId: string, direction: 'up' | 'down') => void;
}

export default function BorderControl({
  enabled,
  borders,
  fabricNames,
  onToggle,
  onAdd,
  onRemove,
  onUpdate,
  onReorder
}: BorderControlProps) {
  const sortedBorders = [...borders].sort((a, b) => a.order - b.order);
  const canAddMore = borders.length < BORDER_CONSTRAINTS.MAX_BORDERS;

  return (
    <div className="space-y-4">
      {/* Border Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-900">Add Borders</h3>
          <p className="text-sm text-gray-600">Add decorative borders around your quilt</p>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
          aria-label="Toggle borders"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Border Configuration */}
      {enabled && (
        <div className="space-y-3">
          {/* Existing Borders */}
          {sortedBorders.map((border, index) => (
            <div
              key={border.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Border {border.order}</span>
                  <span className="text-xs text-gray-500">(closest to quilt = 1)</span>
                </div>
                
                {/* Reorder and Remove Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReorder(border.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move border up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => onReorder(border.id, 'down')}
                    disabled={index === sortedBorders.length - 1}
                    className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move border down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => onRemove(border.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    aria-label="Remove border"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Width Input */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (inches)
                </label>
                <input
                  type="number"
                  min={BORDER_CONSTRAINTS.MIN_WIDTH}
                  max={BORDER_CONSTRAINTS.MAX_WIDTH}
                  step={BORDER_CONSTRAINTS.STEP}
                  value={border.width || 0}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onUpdate(border.id, { width: value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {BORDER_CONSTRAINTS.MIN_WIDTH}&quot; - {BORDER_CONSTRAINTS.MAX_WIDTH}&quot; 
                  (in {BORDER_CONSTRAINTS.STEP}&quot; increments)
                </p>
              </div>

              {/* Fabric Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric
                </label>
                <select
                  value={border.fabricIndex}
                  onChange={(e) => onUpdate(border.id, { fabricIndex: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {fabricNames.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name || `Fabric ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* Add Border Button */}
          {canAddMore && (
            <button
              onClick={onAdd}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              + Add Border ({borders.length}/{BORDER_CONSTRAINTS.MAX_BORDERS})
            </button>
          )}

          {!canAddMore && (
            <p className="text-sm text-gray-500 text-center">
              Maximum of {BORDER_CONSTRAINTS.MAX_BORDERS} borders reached
            </p>
          )}
        </div>
      )}
    </div>
  );
}
