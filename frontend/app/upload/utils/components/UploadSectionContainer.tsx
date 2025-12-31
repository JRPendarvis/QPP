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
}: UploadSectionContainerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <UploadSection
        patternChoice={patternChoice}
        selectedPatternDetails={selectedPatternDetails}
        MIN_FABRICS={MIN_FABRICS}
        MAX_FABRICS={MAX_FABRICS}
        fabricsLength={fabricsLength}
        formatFabricRange={formatFabricRange}
        fabricCountValid={fabricCountValid}
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