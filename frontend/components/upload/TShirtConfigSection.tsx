'use client';

import React from 'react';

export type TShirtQuiltStyle = 'basic' | 'traditional';

export interface TShirtConfig {
  style: TShirtQuiltStyle;
  useCustomGrid: boolean;
  columns: number;
  rows: number;
  blockSize: number;
  sashingColor: string;
  cornerstoneColor: string;
}

export const DEFAULT_TSHIRT_CONFIG: TShirtConfig = {
  style: 'basic',
  useCustomGrid: false,
  columns: 3,
  rows: 4,
  blockSize: 12,
  sashingColor: '#d6d3d1',
  cornerstoneColor: '#a8a29e',
};

const PRESET_GRIDS = [
  { columns: 3, rows: 4 },
  { columns: 4, rows: 5 },
  { columns: 5, rows: 6 },
  { columns: 6, rows: 7 },
];

interface TShirtConfigSectionProps {
  config: TShirtConfig;
  onChange: (config: TShirtConfig) => void;
}

const TShirtConfigSection: React.FC<TShirtConfigSectionProps> = ({ config, onChange }) => {
  const update = (partial: Partial<TShirtConfig>) => onChange({ ...config, ...partial });

  const quiltWidth = config.columns * config.blockSize;
  const quiltHeight = config.rows * config.blockSize;

  return (
    <div className="space-y-4">
      {/* Style */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['basic', 'traditional'] as TShirtQuiltStyle[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update({ style: option })}
              className={`rounded-md px-3 py-2 text-sm capitalize border transition-colors ${
                config.style === option
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Grid presets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Grid preset</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_GRIDS.map((preset) => {
            const selected =
              !config.useCustomGrid &&
              config.columns === preset.columns &&
              config.rows === preset.rows;
            return (
              <button
                key={`${preset.columns}x${preset.rows}`}
                type="button"
                onClick={() =>
                  update({ useCustomGrid: false, columns: preset.columns, rows: preset.rows })
                }
                className={`rounded-md px-3 py-2 text-sm border transition-colors ${
                  selected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500'
                }`}
              >
                {preset.columns}×{preset.rows}
              </button>
            );
          })}
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={config.useCustomGrid}
            onChange={(e) => update({ useCustomGrid: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          Custom grid
        </label>

        {config.useCustomGrid && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              Columns
              <input
                type="number"
                min={1}
                value={config.columns}
                onChange={(e) => update({ columns: Math.max(1, Number(e.target.value) || 1) })}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="text-xs text-gray-600">
              Rows
              <input
                type="number"
                min={1}
                value={config.rows}
                onChange={(e) => update({ rows: Math.max(1, Number(e.target.value) || 1) })}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </label>
          </div>
        )}
      </div>

      {/* Block size */}
      <div>
        <label className="text-xs text-gray-600">
          Finished block size (inches)
          <input
            type="number"
            min={6}
            max={24}
            value={config.blockSize}
            onChange={(e) =>
              update({ blockSize: Math.max(6, Number(e.target.value) || 12) })
            }
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
      </div>

      {/* Traditional sashing */}
      {config.style === 'traditional' && (
        <div className="space-y-2 rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-gray-700">Sashing colors</p>
          <label className="flex items-center justify-between text-xs text-gray-600">
            Sashing
            <input
              type="color"
              value={config.sashingColor}
              onChange={(e) => update({ sashingColor: e.target.value })}
              className="h-7 w-11 rounded border border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between text-xs text-gray-600">
            Cornerstone (2.5 in)
            <input
              type="color"
              value={config.cornerstoneColor}
              onChange={(e) => update({ cornerstoneColor: e.target.value })}
              className="h-7 w-11 rounded border border-gray-300"
            />
          </label>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
        <p>Blocks: <strong>{config.columns * config.rows}</strong></p>
        <p>Quilt size: <strong>{quiltWidth}&quot; × {quiltHeight}&quot;</strong></p>
        {quiltWidth > 96 && (
          <p className="mt-1 text-amber-700 text-xs">
            Width exceeds 96&quot;. Top stitching may require special handling.
          </p>
        )}
      </div>
    </div>
  );
};

export default TShirtConfigSection;
