'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const FABRIC_TYPES = [
  'Cotton',
  'Flannel',
  'Linen',
  'Wool',
  'Silk',
  'Batik',
  'Minky',
  'Canvas',
  'Other',
];

type FabricCreateData = {
  name: string;
  color: string;
  yardageAvailable: number;
  imageUrl?: string;
  type?: string;
  notes?: string;
};

type FabricCreateFormProps = {
  loading: boolean;
  onCreate: (data: FabricCreateData) => Promise<void>;
};

type BatchFabricDraft = {
  file: File;
  name: string;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
}

export default function FabricCreateForm({ loading, onCreate }: FabricCreateFormProps) {
  const [name, setName] = useState('');
  const [yardage, setYardage] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const defaultColor = '#9ca3af';
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [batchDrafts, setBatchDrafts] = useState<BatchFabricDraft[]>([]);
  const [isBatchReviewOpen, setIsBatchReviewOpen] = useState(false);
  const [canUseCameraCapture, setCanUseCameraCapture] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const batchInputRef = useRef<HTMLInputElement | null>(null);

  const isBusy = loading || isBatchUploading;

  const getFabricNameFromFile = (filename: string) => {
    const withoutExtension = filename.replace(/\.[^.]+$/, '');
    const normalized = withoutExtension.replace(/[_-]+/g, ' ').trim();
    return normalized || 'Fabric';
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileOrTabletUA = /android|iphone|ipad|ipod|mobile|tablet/.test(userAgent);
    const hasTouch = navigator.maxTouchPoints > 0;
    const isTabletOrMobileViewport =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 1024px)').matches
        : false;
    const canCapture = isMobileOrTabletUA || (hasTouch && isTabletOrMobileViewport);
    setCanUseCameraCapture(canCapture);
  }, []);

  const handleImageSelect = async (file?: File) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setImageUrl(dataUrl);
  };

  const handleCreate = async () => {
    await onCreate({
      name,
      color: defaultColor,
      yardageAvailable: Number(yardage || 0),
      imageUrl: imageUrl || undefined,
      type,
      notes: notes || undefined,
    });

    setName('');
    setYardage('1');
    setImageUrl('');
    setType('');
    setNotes('');
  };

  const handleOpenBatchReview = (files?: FileList | null) => {
    if (!files || files.length === 0) return;

    const drafts = Array.from(files).map((file) => ({
      file,
      name: getFabricNameFromFile(file.name),
    }));

    setBatchDrafts(drafts);
    setIsBatchReviewOpen(true);
  };

  const handleBatchNameChange = (index: number, value: string) => {
    setBatchDrafts((current) => current.map((draft, idx) => (
      idx === index ? { ...draft, name: value } : draft
    )));
  };

  const handleCloseBatchReview = () => {
    setIsBatchReviewOpen(false);
    setBatchDrafts([]);
  };

  const handleConfirmBatchUpload = async () => {
    if (batchDrafts.length === 0) return;

    setIsBatchUploading(true);
    let successCount = 0;
    let failureCount = 0;

    for (const draft of batchDrafts) {
      try {
        const dataUrl = await fileToDataUrl(draft.file);
        await onCreate({
          name: draft.name.trim() || getFabricNameFromFile(draft.file.name),
          color: defaultColor,
          yardageAvailable: Number(yardage || 0),
          imageUrl: dataUrl,
          type,
          notes: notes || undefined,
        });
        successCount += 1;
      } catch {
        failureCount += 1;
      }
    }

    if (successCount > 0) {
      toast.success(`Added ${successCount} fabric${successCount === 1 ? '' : 's'} from batch upload.`);
    }
    if (failureCount > 0) {
      toast.error(`${failureCount} fabric${failureCount === 1 ? '' : 's'} could not be uploaded.`);
    }

    setIsBatchUploading(false);
    handleCloseBatchReview();
  };

  return (
    <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Add Fabric</h2>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Fabric name"
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      />
      <div>
        <label htmlFor="fabric-yardage-available" className="block text-sm font-medium text-gray-700 mb-1">Yardage Available</label>
        <input
          id="fabric-yardage-available"
          value={yardage}
          onChange={(event) => setYardage(event.target.value)}
          type="number"
          min="0"
          step="0.25"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="fabric-type" className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
        <select
          id="fabric-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Select type...</option>
          {FABRIC_TYPES.map((fabricType) => (
            <option key={fabricType} value={fabricType.toLowerCase()}>
              {fabricType}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Notes"
        className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[90px]"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Fabric photo</p>
        <p className="text-xs text-gray-600">Take a new photo with your camera or upload one you already took.</p>

        <div className={`grid gap-2 ${canUseCameraCapture ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {canUseCameraCapture && (
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Take Photo
            </button>
          )}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Upload Existing Photo
          </button>
        </div>

        {canUseCameraCapture && (
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={async (event) => {
              await handleImageSelect(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
            className="hidden"
          />
        )}

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={async (event) => {
            await handleImageSelect(event.target.files?.[0]);
            event.currentTarget.value = '';
          }}
          className="hidden"
        />
      </div>

      {imageUrl && (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Fabric preview" className="w-full h-32 object-cover rounded border border-gray-200" />
          <button
            type="button"
            onClick={() => setImageUrl('')}
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
          >
            Remove Photo
          </button>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-800">Quick add multiple fabrics</p>
        <p className="text-xs text-gray-600">Select several photos at once. Each photo will be saved as its own fabric.</p>
        <button
          type="button"
          onClick={() => batchInputRef.current?.click()}
          disabled={isBusy}
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
        >
          {isBatchUploading ? 'Uploading...' : 'Upload Multiple Fabric Photos'}
        </button>
        <input
          ref={batchInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={async (event) => {
            handleOpenBatchReview(event.target.files);
            event.currentTarget.value = '';
          }}
          className="hidden"
        />
      </div>

      {isBatchReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseBatchReview} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl border border-gray-200 shadow-xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900">Review Fabric Names Before Upload</h3>
            <p className="text-sm text-gray-600 mt-1">Update names if needed, then confirm to upload all selected fabric photos.</p>

            <div className="mt-4 space-y-3">
              {batchDrafts.map((draft, index) => (
                <div key={`${draft.file.name}-${index}`} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 truncate sm:col-span-1" title={draft.file.name}>{draft.file.name}</p>
                  <input
                    value={draft.name}
                    onChange={(event) => handleBatchNameChange(index, event.target.value)}
                    className="sm:col-span-3 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Fabric name"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={handleCloseBatchReview}
                disabled={isBatchUploading}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmBatchUpload()}
                disabled={isBatchUploading || batchDrafts.length === 0}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium disabled:bg-gray-400"
              >
                {isBatchUploading ? 'Uploading...' : `Upload ${batchDrafts.length} Fabric${batchDrafts.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => void handleCreate()}
        disabled={!name || isBusy}
        className="w-full px-4 py-2 rounded-lg bg-red-700 text-white font-medium disabled:bg-gray-400"
      >
        Save Fabric
      </button>
    </div>
  );
}
