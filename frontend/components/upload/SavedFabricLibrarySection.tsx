import Link from 'next/link';
import FabricSearchBar from '@/components/fabrics/FabricSearchBar';
import { FabricRecord } from '@/services/fabricService';

interface SavedFabricLibrarySectionProps {
  loadingSavedFabrics: boolean;
  savedFabrics: FabricRecord[];
  filteredSavedFabrics: FabricRecord[];
  addingSavedFabricId: string | null;
  currentFabricCount: number;
  effectiveMaxFabrics: number;
  onSearchChange: (value: string) => void;
  onAddSavedFabricToQuilt: (fabric: FabricRecord) => void;
}

export default function SavedFabricLibrarySection({
  loadingSavedFabrics,
  savedFabrics,
  filteredSavedFabrics,
  addingSavedFabricId,
  currentFabricCount,
  effectiveMaxFabrics,
  onSearchChange,
  onAddSavedFabricToQuilt,
}: SavedFabricLibrarySectionProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Or use saved fabrics from your library</h3>
          <p className="text-sm text-gray-600">Choose previously uploaded fabric photos to include in this quilt.</p>
        </div>
        <Link href="/fabrics" className="text-sm text-indigo-700 hover:text-indigo-800 font-medium">
          Manage Fabric Library
        </Link>
      </div>

      {loadingSavedFabrics ? (
        <p className="text-sm text-gray-600">Loading saved fabrics...</p>
      ) : savedFabrics.length === 0 ? (
        <p className="text-sm text-gray-600">No saved fabric photos yet. Add them in Fabric Library first.</p>
      ) : (
        <>
          <div className="mb-4">
            <FabricSearchBar
              onSearchChange={onSearchChange}
              placeholder="Search your fabric library..."
            />
          </div>
          {filteredSavedFabrics.length === 0 ? (
            <p className="text-sm text-gray-600">No fabrics match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSavedFabrics.map((fabric) => {
                const disabled = addingSavedFabricId === fabric.id || currentFabricCount >= effectiveMaxFabrics;
                return (
                  <div key={fabric.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fabric.imageUrl || ''}
                      alt={fabric.name}
                      className="w-full h-24 object-cover rounded-md border border-gray-200"
                    />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 truncate" title={fabric.name}>{fabric.name}</p>
                      <button
                        type="button"
                        onClick={() => onAddSavedFabricToQuilt(fabric)}
                        disabled={disabled}
                        className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium disabled:bg-gray-400"
                      >
                        {addingSavedFabricId === fabric.id ? 'Adding...' : 'Use'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
