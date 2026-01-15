'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import api from '@/lib/api';

interface PatternLibraryItem {
  id: string;
  patternType: string | null;
  patternName: string | null;
  fabricColors: Record<string, unknown> | null;
  downloadedAt: string;
  createdAt: string;
}

export default function PatternLibraryPage() {
  const router = useRouter();
  const [patterns, setPatterns] = useState<PatternLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/patterns/library');
      if (response.data.success) {
        setPatterns(response.data.data.patterns);
      }
    } catch (err) {
      // Don't show error if it's just an empty library (404 or no patterns)
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
      }
      setPatterns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRedownload = async (patternId: string, patternName: string) => {
    try {
      const response = await api.get(`/api/patterns/library/${patternId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${patternName || 'pattern'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download pattern');
    }
  };

  const handleDelete = async (patternId: string) => {
    if (!confirm('Are you sure you want to delete this pattern from your library?')) {
      return;
    }

    try {
      await api.delete(`/api/patterns/library/${patternId}`);
      setPatterns(patterns.filter((p) => p.id !== patternId));
    } catch {
      alert('Failed to delete pattern');
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your pattern library...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      {/* Header Banner */}
      <div className="py-8 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Pattern Library</h1>
          <p className="text-white opacity-90">
            Your downloaded quilt patterns are saved here for easy re-download
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {patterns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Saved Patterns
            </h2>
            <p className="text-gray-600 mb-6">
              Download a pattern to save it to your library
            </p>
            <button
              onClick={() => router.push('/upload')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Create a Pattern
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Pattern preview placeholder */}
                <div className="h-48 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-6xl">🧵</div>
                </div>

                {/* Pattern info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {pattern.patternName || 'Unnamed Pattern'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {pattern.patternType || 'Custom Pattern'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Downloaded {new Date(pattern.downloadedAt).toLocaleDateString()}
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleRedownload(pattern.id, pattern.patternName || 'pattern')
                      }
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(pattern.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
