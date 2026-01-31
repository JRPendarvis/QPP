import { useState } from 'react';
import { PatternLibraryItem } from '@/hooks/usePatternLibrary';

interface PatternCardProps {
  pattern: PatternLibraryItem;
  onDownload: (patternId: string, patternName: string) => Promise<void>;
  onDelete: (patternId: string) => Promise<void>;
  onRename: (patternId: string, newName: string) => Promise<void>;
}

/**
 * Pattern card component
 * Single Responsibility: Display and manage single pattern item
 */
export default function PatternCard({ pattern, onDownload, onDelete, onRename }: PatternCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(pattern.patternName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditName(pattern.patternName || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(pattern.patternName || '');
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      alert('Pattern name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await onRename(pattern.id, editName);
      setIsEditing(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to rename pattern');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await onDownload(pattern.id, pattern.patternName || 'pattern');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to download pattern');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pattern from your library?')) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(pattern.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete pattern');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Pattern preview */}
      <div className="h-80 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-6xl">🧵</div>
      </div>

      {/* Pattern info */}
      <div className="p-6">
        {isEditing ? (
          <div className="mb-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-2"
              placeholder="Enter pattern name"
              autoFocus
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="flex-1 bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {pattern.patternName || 'Unnamed Pattern'}
              </h3>
              <button
                onClick={handleStartEdit}
                disabled={isLoading}
                className="text-gray-400 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Rename pattern"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">{pattern.patternType || 'Custom Pattern'}</p>
        <p className="text-xs text-gray-500 mb-4">
          Downloaded {new Date(pattern.downloadedAt).toLocaleDateString()}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Download'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
