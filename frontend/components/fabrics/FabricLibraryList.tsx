'use client';

import { FabricRecord } from '@/services/fabricService';
import { formatYardage } from './formatters';

type FabricLibraryListProps = {
  fabrics: FabricRecord[];
  authLoading: boolean;
  loading: boolean;
  deletingId: string | null;
  selectedFabricId: string | null;
  onSelectFabric: (fabricId: string) => void;
  onDeleteFabric: (fabricId: string) => Promise<void>;
  onQuickUpdateYardage: (fabricId: string, yardageAvailable: number) => Promise<void>;
};

export default function FabricLibraryList({
  fabrics,
  authLoading,
  loading,
  deletingId,
  selectedFabricId,
  onSelectFabric,
  onDeleteFabric,
  onQuickUpdateYardage,
}: FabricLibraryListProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Fabrics</h2>
      {authLoading || loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : fabrics.length === 0 ? (
        <p className="text-gray-600">No fabrics saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fabrics.map((fabric) => (
            <div
              key={fabric.id}
              className={`border rounded-lg p-3 ${selectedFabricId === fabric.id ? 'border-red-400 bg-red-50/40' : 'border-gray-200'}`}
              onClick={() => onSelectFabric(fabric.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 items-start">
                  {fabric.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fabric.imageUrl} alt={fabric.name} className="w-14 h-10 rounded border border-gray-300 object-cover" />
                  ) : (
                    <div className="w-14 h-10 rounded border border-gray-300" style={{ backgroundColor: fabric.color }} />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{fabric.name}</p>
                    <p className="text-xs text-gray-600">{fabric.type || 'Unspecified type'}</p>
                    <p className="text-xs text-gray-600">Available: {formatYardage(fabric.yardageAvailable)}</p>
                    <p className="text-xs text-gray-500">Reserved: {formatYardage(fabric.yardageReserved)}</p>
                  </div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    void onDeleteFabric(fabric.id);
                  }}
                  disabled={deletingId === fabric.id}
                  className="text-xs px-2 py-1 rounded bg-red-600 text-white disabled:bg-gray-400"
                >
                  {deletingId === fabric.id ? '...' : 'Delete'}
                </button>
              </div>
              {selectedFabricId === fabric.id && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Quick Update Yardage</label>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    defaultValue={fabric.yardageAvailable}
                    onBlur={(event) => {
                      const value = Number(event.target.value);
                      if (Number.isFinite(value) && value >= 0) {
                        void onQuickUpdateYardage(fabric.id, value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
