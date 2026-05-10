'use client';

import { useState } from 'react';

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
  const [color, setColor] = useState('#b91c1c');
  const [yardage, setYardage] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState('cotton');
  const [notes, setNotes] = useState('');

  const handleCreate = async () => {
    await onCreate({
      name,
      color,
      yardageAvailable: Number(yardage || 0),
      imageUrl: imageUrl || undefined,
      type,
      notes: notes || undefined,
    });

    setName('');
    setColor('#b91c1c');
    setYardage('1');
    setImageUrl('');
    setType('cotton');
    setNotes('');
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
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          className="w-14 h-10 border border-gray-300 rounded"
        />
        <input
          value={yardage}
          onChange={(event) => setYardage(event.target.value)}
          type="number"
          min="0"
          step="0.25"
          placeholder="Yardage"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <input
        value={type}
        onChange={(event) => setType(event.target.value)}
        placeholder="Type (cotton, flannel...)"
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      />
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Notes"
        className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[90px]"
      />
      <input
        type="file"
        accept="image/*"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const dataUrl = await fileToDataUrl(file);
          setImageUrl(dataUrl);
        }}
        className="w-full text-sm"
      />
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Fabric preview" className="w-full h-32 object-cover rounded border border-gray-200" />
      )}
      <button
        onClick={() => void handleCreate()}
        disabled={!name || loading}
        className="w-full px-4 py-2 rounded-lg bg-red-700 text-white font-medium disabled:bg-gray-400"
      >
        Save Fabric
      </button>
    </div>
  );
}
