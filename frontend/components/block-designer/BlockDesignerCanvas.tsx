'use client';

import { useMemo } from 'react';

export interface FabricOption {
  id: string;
  name: string;
  color: string;
  imageUrl?: string;
  previewUrl?: string;
  libraryFabricId?: string;
}

export interface BlockRegion {
  id: string;
  name: string;
  shape: 'rect' | 'polygon';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: string;
  fabricIndex: number;
  rotation: 0 | 90 | 180 | 270;
}

interface BlockDesignerCanvasProps {
  patternName: string;
  fabrics: FabricOption[];
  regions: BlockRegion[];
  globalRotation: 0 | 90 | 180 | 270;
  onRegionFabricChange: (regionId: string, fabricIndex: number) => void;
  onRegionRotationChange: (regionId: string, rotation: 0 | 90 | 180 | 270) => void;
}

const ROTATIONS: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];

function normalizedRotation(rotation: number): 0 | 90 | 180 | 270 {
  const normalized = ((rotation % 360) + 360) % 360;
  if (normalized === 90 || normalized === 180 || normalized === 270) {
    return normalized;
  }
  return 0;
}

function buildPatternId(regionId: string): string {
  return `texture-${regionId}`;
}

export default function BlockDesignerCanvas({
  patternName,
  fabrics,
  regions,
  globalRotation,
  onRegionFabricChange,
  onRegionRotationChange,
}: BlockDesignerCanvasProps) {
  const safeRegions = useMemo(() => {
    return regions.map((region, index) => {
      const fabricIndex = Math.max(0, Math.min(region.fabricIndex, Math.max(0, fabrics.length - 1)));
      return {
        ...region,
        fabricIndex,
        id: region.id || `region-${index + 1}`,
      };
    });
  }, [regions, fabrics.length]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patternName} Block Preview</h2>
            <p className="text-sm text-gray-600">Rotate regions and swap fabrics to design your block.</p>
          </div>
          <div className="text-sm text-gray-600">{safeRegions.length} regions</div>
        </div>

        <div className="w-full max-w-2xl mx-auto aspect-square border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            role="img"
            aria-label={`${patternName} block preview`}
          >
            <defs>
              {safeRegions.map((region) => {
                const fabric = fabrics[region.fabricIndex] || fabrics[0];
                const patternRotation = normalizedRotation(globalRotation + region.rotation);
                const id = buildPatternId(region.id);
                const textureUrl = fabric?.previewUrl || fabric?.imageUrl;

                return (
                  <pattern
                    key={id}
                    id={id}
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                    patternTransform={`rotate(${patternRotation} 50 50)`}
                  >
                    {textureUrl ? (
                      <image
                        href={textureUrl}
                        x="0"
                        y="0"
                        width="8"
                        height="8"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    ) : (
                      <>
                        <rect width="8" height="8" fill={fabric?.color || '#d1d5db'} />
                        <path d="M0 0 L8 0 L8 1 L0 1 Z" fill="rgba(255,255,255,0.28)" />
                        <path d="M0 4 L8 4 L8 5 L0 5 Z" fill="rgba(0,0,0,0.14)" />
                      </>
                    )}
                  </pattern>
                );
              })}
            </defs>

            <g transform={`rotate(${globalRotation} 50 50)`}>
              {safeRegions.map((region) => {
                const fillUrl = `url(#${buildPatternId(region.id)})`;

                if (region.shape === 'polygon' && region.points) {
                  return (
                    <polygon
                      key={region.id}
                      points={region.points}
                      fill={fillUrl}
                      stroke="#1f2937"
                      strokeWidth="0.6"
                    />
                  );
                }

                return (
                  <rect
                    key={region.id}
                    x={region.x ?? 0}
                    y={region.y ?? 0}
                    width={region.width ?? 10}
                    height={region.height ?? 10}
                    fill={fillUrl}
                    stroke="#1f2937"
                    strokeWidth="0.6"
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Region Controls</h3>
        <div className="space-y-4 max-h-[560px] overflow-auto pr-1">
          {safeRegions.map((region) => {
            const fabric = fabrics[region.fabricIndex] || fabrics[0];

            return (
              <div key={region.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">{region.name}</p>
                  <span className="text-xs text-gray-500">{region.id}</span>
                </div>

                <label className="block text-sm text-gray-700 mb-1">Fabric</label>
                <select
                  value={region.fabricIndex}
                  onChange={(event) => onRegionFabricChange(region.id, Number(event.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
                >
                  {fabrics.map((option, idx) => (
                    <option key={option.id} value={idx}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Rotation</span>
                  <div className="flex gap-1">
                    {ROTATIONS.map((deg) => (
                      <button
                        key={`${region.id}-deg-${deg}`}
                        type="button"
                        onClick={() => onRegionRotationChange(region.id, deg)}
                        className={`px-2 py-1 rounded text-xs border ${
                          region.rotation === deg
                            ? 'bg-red-700 text-white border-red-700'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: fabric?.color || '#d1d5db' }} />
                  <span>{fabric?.name || 'Unassigned'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
