"use client";
import { useState, useEffect } from 'react';
import { FabricRecord } from '@/services/fabricService';

interface FabricEditModalProps {
  fabric: FabricRecord;
  onSave: (fabricId: string, updates: {
    name?: string;
    type?: string | null;
    notes?: string | null;
  }) => Promise<void>;
  onClose: () => void;
  saving?: boolean;
}

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

export default function FabricEditModal({
  fabric,
  onSave,
  onClose,
  saving = false,
}: FabricEditModalProps) {
  const [name, setName] = useState(fabric.name);
  const [type, setType] = useState(fabric.type || '');
  const [notes, setNotes] = useState(fabric.notes || '');

  // Reset form when fabric changes
  useEffect(() => {
    setName(fabric.name);
    setType(fabric.type || '');
    setNotes(fabric.notes || '');
  }, [fabric]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    const updates: {
      name?: string;
      type?: string | null;
      notes?: string | null;
    } = {};

    if (name.trim() !== fabric.name) {
      updates.name = name.trim();
    }

    if (type !== (fabric.type || '')) {
      updates.type = type || null;
    }

    if (notes !== (fabric.notes || '')) {
      updates.notes = notes || null;
    }

    await onSave(fabric.id, updates);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Fabric</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Fabric Preview */}
          {fabric.imageUrl ? (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fabric.imageUrl}
                alt={fabric.name}
                className="w-32 h-24 rounded border border-gray-300 object-cover"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="w-32 h-24 rounded border border-gray-300"
                style={{ backgroundColor: fabric.color }}
              />
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="fabric-name" className="block text-sm font-medium text-gray-700 mb-1">
              Fabric Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fabric-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={saving}
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="fabric-type" className="block text-sm font-medium text-gray-700 mb-1">
              Fabric Type
            </label>
            <select
              id="fabric-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={saving}
            >
              <option value="">Select type...</option>
              {FABRIC_TYPES.map((fabricType) => (
                <option key={fabricType} value={fabricType.toLowerCase()}>
                  {fabricType}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="fabric-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes / Tags
            </label>
            <textarea
              id="fabric-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Add notes, tags, or details about this fabric..."
              disabled={saving}
            />
          </div>

          {/* Yardage Info (read-only) */}
          <div className="bg-gray-50 rounded-md p-3 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Available:</span> {fabric.yardageAvailable.toFixed(2)} yd
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Reserved:</span> {fabric.yardageReserved.toFixed(2)} yd
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Use the inline yardage editor to update quantities
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
