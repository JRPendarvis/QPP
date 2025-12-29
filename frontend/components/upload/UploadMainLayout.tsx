import React from 'react';
import PatternSelectionSection from './PatternSelectionSection';
import UploadSection from './UploadSection';
import FabricDropzone from './FabricDropzone';
import FabricPreviewGrid from './FabricPreviewGrid';
import ValidationMessage from './ValidationMessage';
import GenerateButton from './GenerateButton';


import type { FC } from 'react';
import type { PatternSelectionSectionProps } from './PatternSelectionSection';
import type { UploadSectionProps } from './UploadSection';
import type { FabricDropzoneProps } from './FabricDropzone';
import type { FabricPreviewGridProps } from './FabricPreviewGrid';
import type { GenerateButtonProps } from './GenerateButton';

interface UploadMainLayoutProps {
  patternSelectionProps: PatternSelectionSectionProps;
  uploadSectionProps: UploadSectionProps;
  dropzoneProps: FabricDropzoneProps;
  previewGridProps: FabricPreviewGridProps;
  validationMessage: string | null;
  generateButtonProps: GenerateButtonProps;
}

const UploadMainLayout: FC<UploadMainLayoutProps> = ({
  patternSelectionProps,
  uploadSectionProps,
  dropzoneProps,
  previewGridProps,
  validationMessage,
  generateButtonProps,
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <PatternSelectionSection {...patternSelectionProps} />
      <UploadSection {...uploadSectionProps} />
      <FabricDropzone {...dropzoneProps} />
    </div>
    <FabricPreviewGrid {...previewGridProps} />
    <ValidationMessage message={validationMessage} />
    <GenerateButton {...generateButtonProps} />
  </>
);

export default UploadMainLayout;
