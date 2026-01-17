import { UploadSection, FabricDropzone } from '@/components/upload';
import { PatternChoice, PatternDetails } from '../types';
import { formatFabricRange } from '../../uploadUtils';

interface UploadSectionContainerProps {
  patternChoice: PatternChoice;
  selectedPatternDetails: PatternDetails | null;
  MIN_FABRICS: number;
  MAX_FABRICS: number;
  fabricsLength: number;
  fabricCountValid: boolean;
  onFilesAdded: (files: FileList | File[]) => void;
  effectiveMaxFabrics: number;
  totalImageSize: number;
  borderFabricsNeeded: number;
}

export function UploadSectionContainer({
  patternChoice,
  selectedPatternDetails,
  MIN_FABRICS,
  MAX_FABRICS,
  fabricsLength,
  fabricCountValid,
  onFilesAdded,
  effectiveMaxFabrics,
  totalImageSize,
  borderFabricsNeeded,
}: UploadSectionContainerProps) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Step 3: Upload Your Fabric Images
      </h2>
      <UploadSection
        patternChoice={patternChoice}
        selectedPatternDetails={selectedPatternDetails}
        MIN_FABRICS={MIN_FABRICS}
        MAX_FABRICS={MAX_FABRICS}
        fabricsLength={fabricsLength}
        formatFabricRange={formatFabricRange}
        fabricCountValid={fabricCountValid}
        borderFabricsNeeded={borderFabricsNeeded}
      />

      <FabricDropzone
        onFilesAdded={onFilesAdded}
        currentCount={fabricsLength}
        maxFiles={effectiveMaxFabrics}
        totalSize={totalImageSize}
      />
    </div>
  );
}