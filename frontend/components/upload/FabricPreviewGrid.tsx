'use client';

import { useState } from 'react';
import Image from 'next/image';
export interface FabricPreviewGridProps {
  previews: string[];
  fabrics: File[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  fabricRoles?: string[]; // Optional pattern-specific fabric roles
}


import { FABRIC_ROLES } from '../../app/helpers/fabricRoles';

interface FabricCardProps {
  preview: string;
  fabric: File | undefined;
  label: string;
  index: number;
  draggedIdx: number | null;
  setDraggedIdx: (idx: number | null) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
}

const FabricCard: React.FC<FabricCardProps> = ({
  preview,
  fabric,
  label,
  index,
  draggedIdx,
  setDraggedIdx,
  onRemove,
  onReorder,
}) => (
  <div
    className={`relative group ${draggedIdx === index ? 'opacity-60' : ''}`}
    draggable
    onDragStart={e => {
      setDraggedIdx(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('fabricIdx', String(index));
    }}
    onDragEnd={() => setDraggedIdx(null)}
    onDragOver={e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }}
    onDrop={e => {
      e.preventDefault();
      const fromIdx = draggedIdx;
      const toIdx = index;
      if (fromIdx !== null && fromIdx !== toIdx) {
        onReorder(fromIdx, toIdx);
      }
      setDraggedIdx(null);
    }}
    title="Drag to reorder or assign role"
    style={{ cursor: 'grab' }}
  >
    {/* Fabric Role Label */}
    <div className="text-xs font-semibold text-indigo-700 text-center mb-1">
      {label}
    </div>
    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
      <Image
        src={preview}
        alt={fabric?.name || `Fabric ${index + 1}`}
        className="w-full h-full object-cover"
        width={400}
        height={400}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        unoptimized
      />
    </div>
    <button
      onClick={() => onRemove(index)}
      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <p className="mt-1 text-xs text-gray-700 truncate text-center">
      <span className="font-medium">{fabric?.name || `Fabric ${index + 1}`}</span>
    </p>
  </div>
);

export default function FabricPreviewGrid({
  previews,
  fabrics,
  onRemove,
  onClearAll,
  onReorder,
  fabricRoles,
}: FabricPreviewGridProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  // Use pattern-specific roles if provided, otherwise fall back to generic roles
  const roles = fabricRoles || FABRIC_ROLES;
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Uploaded Fabrics ({fabrics.length})
        </h3>
        <button
          onClick={onClearAll}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <FabricCard
            key={index}
            preview={preview}
            fabric={fabrics[index]}
            label={roles[index] || `Fabric ${index + 1}`}
            index={index}
            draggedIdx={draggedIdx}
            setDraggedIdx={setDraggedIdx}
            onRemove={onRemove}
            onReorder={onReorder}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">Drag and drop to reorder fabrics. The order affects pattern generation and role assignment.</p>
    </div>
  );
}