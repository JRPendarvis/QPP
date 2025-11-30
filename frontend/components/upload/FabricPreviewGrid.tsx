'use client';

interface FabricPreviewGridProps {
  previews: string[];
  fabrics: File[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
}

export default function FabricPreviewGrid({
  previews,
  fabrics,
  onRemove,
  onClearAll,
}: FabricPreviewGridProps) {
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
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img
                src={preview}
                alt={`Fabric ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <p className="mt-1 text-xs text-gray-500 truncate">
              {fabrics[index].name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}