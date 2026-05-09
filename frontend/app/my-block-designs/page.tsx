'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useBlockDesignLibrary } from '@/hooks/useBlockDesignLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function MyBlockDesignsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { designs, loading, fetchDesigns, deleteDesign, duplicateDesign } = useBlockDesignLibrary();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please log in to view your block designs');
      router.push(ROUTES.LOGIN);
      return;
    }

    fetchDesigns();
  }, [authLoading, user, fetchDesigns, router]);

  const handleEdit = (designId: string) => {
    router.push(`/block-designer?design=${encodeURIComponent(designId)}`);
  };

  const handleDelete = async (designId: string) => {
    if (!window.confirm('Delete this design?')) return;
    try {
      setDeletingId(designId);
      await deleteDesign(designId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (designId: string) => {
    try {
      await duplicateDesign(designId);
    } catch (err) {
      console.error('Duplicate failed:', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 45%, #FFFBEB 100%)' }}>
      <Navigation />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Block Designs</h1>
            <p className="text-gray-600">View and manage your saved block designs</p>
          </div>

          {authLoading || loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">Loading designs...</p>
            </div>
          ) : designs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No block designs saved yet</p>
              <button
                onClick={() => router.push('/block-designer')}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Create Your First Design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <div key={design.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{design.name}</h3>
                    <p className="text-sm text-gray-600">{design.patternName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEdit(design.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(design.id)}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(design.id)}
                      disabled={deletingId === design.id}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deletingId === design.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
