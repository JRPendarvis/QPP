import React from 'react';

export interface UploadSectionProps {
  patternChoice: 'auto' | 'manual';
  selectedPatternDetails: { name: string; minFabrics: number; maxFabrics: number } | null;
  MIN_FABRICS: number;
  MAX_FABRICS: number;
  fabricsLength: number;
  formatFabricRange: (min: number, max: number) => string;
  fabricCountValid: boolean;
  borderFabricsNeeded: number;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  patternChoice,
  selectedPatternDetails,
  MIN_FABRICS,
  MAX_FABRICS,
  fabricsLength,
  formatFabricRange,
  fabricCountValid,
  borderFabricsNeeded,
}) => (
  <>
    <p className="text-gray-600 mb-4">
      {patternChoice === 'manual' && selectedPatternDetails ? (
        <>
          <span className="font-medium">{selectedPatternDetails.name}</span> requires{' '}
          <span className="font-medium text-indigo-600">
            {formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)}
          </span>
          {borderFabricsNeeded > 0 && (
            <>
              {' + '}
              <span className="font-medium text-purple-600">
                {borderFabricsNeeded} for borders
              </span>
            </>
          )}
        </>
      ) : (
        <>
          Upload {MIN_FABRICS}-{MAX_FABRICS} fabric images to generate your quilt pattern
          {borderFabricsNeeded > 0 && (
            <>
              {' + '}
              <span className="font-medium text-purple-600">
                {borderFabricsNeeded} for borders
              </span>
            </>
          )}
        </>
      )}
    </p>
    <p className="text-sm text-gray-500 mb-6">
      Supported formats: JPG, PNG, WEBP (max 5MB per image)
    </p>
    {/* FabricDropzone must be passed as a child or replaced in parent */}
  </>
);

export default UploadSection;
