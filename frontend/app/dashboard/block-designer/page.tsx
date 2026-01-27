'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BlockDesigner, { BlockData, FabricRole } from '@/components/BlockDesigner';
import api from '@/lib/api';

interface SavedBlock {
  id: string;
  name: string;
  description?: string;
  blockSize: number;
  gridData: FabricRole[][];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

interface LimitInfo {
  allowed: boolean;
  reason?: string;
  currentCount: number;
  limit: number;
}

export default function BlockDesignerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [savedBlocks, setSavedBlocks] = useState<SavedBlock[]>([]);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserBlocks();
      checkLimit();
    }
  }, [user]);

  const fetchUserBlocks = async () => {
    try {
      const response = await api.get('/api/blocks');
      if (response.data.success) {
        setSavedBlocks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    } finally {
      setLoadingBlocks(false);
    }
  };

  const checkLimit = async () => {
    try {
      const response = await api.get('/api/blocks/limit-check');
      if (response.data.success) {
        setLimitInfo(response.data.data);
      }
    } catch (error) {
      console.error('Failed to check limit:', error);
    }
  };

  const handleSaveBlock = async (blockData: BlockData) => {
    if (!limitInfo?.allowed) {
      alert(limitInfo?.reason || 'You have reached your block limit');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/api/blocks', blockData);
      if (response.data.success) {
        alert('Block saved successfully!');
        await fetchUserBlocks();
        await checkLimit();
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to save block';
      alert(errorMsg);
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/blocks/${blockId}`);
      if (response.data.success) {
        await fetchUserBlocks();
        await checkLimit();
      }
    } catch (error) {
      alert('Failed to delete block');
      console.error('Delete error:', error);
    }
  };

  const handleUseInQuilt = async (blockId: string) => {
    const width = prompt('How many blocks wide?', '3');
    const height = prompt('How many blocks tall?', '3');

    if (!width || !height) return;

    const quiltWidth = parseInt(width);
    const quiltHeight = parseInt(height);

    if (isNaN(quiltWidth) || isNaN(quiltHeight) || quiltWidth < 1 || quiltHeight < 1) {
      alert('Please enter valid numbers for quilt dimensions');
      return;
    }

    try {
      const response = await api.post(`/api/blocks/${blockId}/generate-pattern`, {
        quiltWidth,
        quiltHeight,
        fabricAssignments: {}, // Can be extended to pass actual fabrics
      });

      if (response.data.success) {
        alert('Pattern generated! View it in your Pattern Library.');
        router.push('/library');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to generate pattern';
      alert(errorMsg);
      console.error('Generate pattern error:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Block Designer</h1>
          <p className="mt-2 text-gray-600">
            Design your own quilt blocks and use them to generate custom quilts
          </p>Blocks
          {limitInfo && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Blocks:</strong> {limitInfo.currentCount} / {limitInfo.limit === Infinity ? '∞' : limitInfo.limit}
              </p>
            </div>
          )}
        </div>

        {/* Block Designer */}
        <BlockDesigner onSave={handleSaveBlock} />

        {/* Saved Blocks */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Saved Blocks</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading your blocks...</p>
          ) : savedBlocks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No saved blocks yet. Design your first block above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBlocks.map((block) => (
                <div key={block.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <h3 className="font-bold text-lg mb-2">{block.name}</h3>
                  {block.description && (
                    <p className="text-sm text-gray-600 mb-4">{block.description}</p>
                  )}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Grid: {Math.sqrt(block.blockSize)}x{Math.sqrt(block.blockSize)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(block.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleUseInQuilt(block.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Use in Quilt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
