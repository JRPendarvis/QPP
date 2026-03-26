'use client';

import { useEffect, useMemo, useState } from 'react';
import { TShirtConfig } from './TShirtConfigSection';

interface TShirtLayoutPrototypeProps {
  previews: string[];
  config: TShirtConfig;
}

export default function TShirtLayoutPrototype({ previews, config }: TShirtLayoutPrototypeProps) {
  const { style, columns, rows, blockSize, sashingColor, cornerstoneColor } = config;
  const [boardAssignments, setBoardAssignments] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const blockCount = columns * rows;
  const quiltWidth = columns * blockSize;
  const quiltHeight = rows * blockSize;
  const isTraditional = style === 'traditional';
  const sashSizePx = 10;
  const isFilled = boardAssignments.filter((index) => index >= 0).length === blockCount;

  useEffect(() => {
    setBoardAssignments((current) => {
      const next = Array.from({ length: blockCount }, (_, idx) => current[idx] ?? -1);
      const used = new Set<number>();

      for (let i = 0; i < next.length; i += 1) {
        const value = next[i];
        if (value < 0 || value >= previews.length || used.has(value)) {
          next[i] = -1;
        } else {
          used.add(value);
        }
      }

      return next;
    });
  }, [blockCount, previews.length]);

  const missingImages = Math.max(0, blockCount - previews.length);

  const recommendedAssignments = useMemo(() => {
    const available = Array.from({ length: Math.min(previews.length, blockCount) }, (_, idx) => idx);

    if (available.length <= 2) {
      return available;
    }

    // Simple balanced weave: place alternating indices so adjacent blocks vary.
    const evens = available.filter((_, idx) => idx % 2 === 0);
    const odds = available.filter((_, idx) => idx % 2 === 1);
    return [...evens, ...odds];
  }, [previews.length, blockCount]);

  const applyRecommendedLayout = () => {
    setBoardAssignments(
      Array.from({ length: blockCount }, (_, idx) => recommendedAssignments[idx] ?? -1)
    );
  };

  const reshuffleLayout = () => {
    setBoardAssignments((current) => {
      const filled = current.filter((idx) => idx >= 0);
      for (let i = filled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [filled[i], filled[j]] = [filled[j], filled[i]];
      }

      const next = Array.from({ length: blockCount }, (_, idx) => filled[idx] ?? -1);
      return next;
    });
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;

    setBoardAssignments((current) => {
      const next = [...current];
      const from = next[dragIndex];
      next[dragIndex] = next[targetIndex];
      next[targetIndex] = from;
      return next;
    });

    setDragIndex(null);
  };

  const traditionalTemplateColumns = useMemo(
    () =>
      Array.from({ length: columns * 2 + 1 }, (_, idx) =>
        idx % 2 === 0 ? `${sashSizePx}px` : 'minmax(0, 1fr)'
      ).join(' '),
    [columns]
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Info bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
        <span>
          <strong>{previews.length}</strong> photo{previews.length !== 1 ? 's' : ''} uploaded &middot;{' '}
          <strong>{blockCount}</strong> blocks &middot;{' '}
          <strong>{quiltWidth}" × {quiltHeight}"</strong>
        </span>
        {missingImages > 0 && (
          <span className="text-rose-600 font-medium">
            Add {missingImages} more photo{missingImages === 1 ? '' : 's'} to fill the board
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={applyRecommendedLayout}
          className="rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          Auto arrange
        </button>
        <button
          type="button"
          onClick={reshuffleLayout}
          className="rounded-md border border-indigo-300 text-indigo-700 px-3 py-2 text-sm font-medium hover:bg-indigo-50"
        >
          Re-shuffle
        </button>
      </div>

      {isTraditional && (
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm border border-gray-300" style={{ backgroundColor: sashingColor }} />
            Sashing
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm border border-gray-300" style={{ backgroundColor: cornerstoneColor }} />
            Cornerstone
          </span>
        </div>
      )}

      {/* Board grid */}
      <div className="overflow-x-auto">
        {isTraditional ? (
          <div
            className="grid min-w-[340px]"
            style={{ gridTemplateColumns: traditionalTemplateColumns }}
          >
            {Array.from({ length: (rows * 2 + 1) * (columns * 2 + 1) }, (_, cellIndex) => {
              const totalCols = columns * 2 + 1;
              const rowIndex = Math.floor(cellIndex / totalCols);
              const colIndex = cellIndex % totalCols;
              const isBlockCell = rowIndex % 2 === 1 && colIndex % 2 === 1;
              const isCornerstoneCell = rowIndex % 2 === 0 && colIndex % 2 === 0;

              if (isBlockCell) {
                const blockRow = (rowIndex - 1) / 2;
                const blockCol = (colIndex - 1) / 2;
                const blockIndex = blockRow * columns + blockCol;
                const previewIndex = boardAssignments[blockIndex] ?? -1;
                const imageSrc = previewIndex >= 0 ? previews[previewIndex] : null;

                return (
                  <div
                    key={`block-${blockIndex}`}
                    draggable={previewIndex >= 0}
                    onDragStart={() => setDragIndex(blockIndex)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(blockIndex)}
                    className="relative aspect-square rounded-md border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden"
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`Shirt block ${blockIndex + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-500 text-center px-2">
                        Block {blockIndex + 1}
                      </div>
                    )}
                  </div>
                );
              }

              if (isCornerstoneCell) {
                return (
                  <div
                    key={`cornerstone-${rowIndex}-${colIndex}`}
                    className="h-full w-full"
                    style={{ backgroundColor: cornerstoneColor }}
                    title="Cornerstone"
                  />
                );
              }

              return (
                <div
                  key={`sashing-${rowIndex}-${colIndex}`}
                  className="h-full w-full"
                  style={{ backgroundColor: sashingColor, minHeight: `${sashSizePx}px` }}
                  title="Sashing"
                />
              );
            })}
          </div>
        ) : (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {boardAssignments.map((previewIndex, idx) => {
              const imageSrc = previewIndex >= 0 ? previews[previewIndex] : null;

              return (
                <div
                  key={`slot-${idx}`}
                  draggable={previewIndex >= 0}
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className="relative aspect-square rounded-md border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden"
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`Shirt block ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-500 text-center px-2">
                      Block {idx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
