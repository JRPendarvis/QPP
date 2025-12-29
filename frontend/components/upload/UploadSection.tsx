import React from 'react';

export interface UploadSectionProps {
  patternChoice: 'auto' | 'manual';
  selectedPatternDetails: { name: string; minFabrics: number; maxFabrics: number } | null;
  MIN_FABRICS: number;
  MAX_FABRICS: number;
  fabricsLength: number;
  formatFabricRange: (min: number, max: number) => string;
  fabricCountValid: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  patternChoice,
  selectedPatternDetails,
  MIN_FABRICS,
  MAX_FABRICS,
  fabricsLength,
  formatFabricRange,
  fabricCountValid,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Step 2: Upload Your Fabric Images
    </h2>
    <p className="text-gray-600 mb-4">
      {patternChoice === 'manual' && selectedPatternDetails ? (
        <>
          <span className="font-medium">{selectedPatternDetails.name}</span> requires{' '}
          <span className="font-medium text-indigo-600">
            {formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)}
          </span>
        </>
      ) : (
        <>Upload {MIN_FABRICS}-{MAX_FABRICS} fabric images to generate your quilt pattern</>
      )}
    </p>
    <p className="text-sm text-gray-500 mb-6">
      Supported formats: JPG, PNG, WEBP (max 5MB per image)
    </p>
    {/* FabricDropzone must be passed as a child or replaced in parent */}
    {/* Fabric count indicator */}
    {fabricsLength > 0 && (
      <div className={`mt-4 text-sm ${fabricCountValid ? 'text-green-600' : 'text-amber-600'}`}>
        {fabricsLength} of {patternChoice === 'manual' && selectedPatternDetails
          ? formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)
          : `${MIN_FABRICS}-${MAX_FABRICS}`
        } fabrics uploaded
      </div>
    )}
  </div>
);

export default UploadSection;
