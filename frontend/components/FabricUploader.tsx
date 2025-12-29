import React from 'react';
import FabricDropzone from './upload/FabricDropzone';
import FabricPreviewGrid from './upload/FabricPreviewGrid';

interface FabricUploaderProps {
  fabrics: File[];
  previews: string[];
  maxFabrics: number;
  minFabrics: number;
  handleFilesAdded: (files: File[]) => void;
  removeFabric: (index: number) => void;
  clearAll: () => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  totalSize: number;
}

const FabricUploader: React.FC<FabricUploaderProps> = ({
  fabrics,
  previews,
  maxFabrics,
  minFabrics,
  handleFilesAdded,
  removeFabric,
  clearAll,
  onReorder,
  totalSize,
}) => {
  return (
    <div>
      <FabricDropzone
        onFilesAdded={handleFilesAdded}
        currentCount={fabrics.length}
        maxFiles={maxFabrics}
        totalSize={totalSize}
      />
      {previews.length > 0 && (
        <FabricPreviewGrid
          previews={previews}
          fabrics={fabrics}
          onRemove={removeFabric}
          onClearAll={clearAll}
          onReorder={onReorder}
        />
      )}
    </div>
  );
};

export default FabricUploader;
