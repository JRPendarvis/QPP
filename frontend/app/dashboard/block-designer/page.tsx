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

interface PatternTemplate {
  id: string;
  name: string;
  blockSize: number;
  skillLevel: string;
  minFabrics: number;
  maxFabrics: number;
}

interface TemplateBlockData {
  patternId: string;
  patternName: string;
  blockSize: number;
  gridSize: number;
  gridData: FabricRole[][];
  description: string;
}

export default function BlockDesignerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [savedBlocks, setSavedBlocks] = useState<SavedBlock[]>([]);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patternTemplates, setPatternTemplates] = useState<PatternTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateBlockData | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserBlocks();
      checkLimit();
      fetchPatternTemplates();
    }
  }, [user]);

  const fetchPatternTemplates = async () => {
    try {
      const response = await api.get('/api/pattern-templates');
      if (response.data.success) {
        setPatternTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pattern templates:', error);
    }
  };

  const loadTemplate = async (patternId: string) => {
    setLoadingTemplate(true);
    try {
      const response = await api.get(`/api/pattern-templates/${patternId}`);
      if (response.data.success) {
        setSelectedTemplate(response.data.data);
      }
    } catch (error) {
      alert('Failed to load pattern template');
      console.error('Load template error:', error);
    } finally {
      setLoadingTemplate(false);
    }
  };

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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save block';
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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate pattern';
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
      
      {/* Header Banner */}
      <div className="py-8 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Block Designer</h1>
          <p className="text-white text-opacity-90">
            Design your own quilt blocks and use them to generate custom quilts
          </p>
        </div>
      </div>

      <div className="min-h-screen py-8" style={{backgroundColor: '#F9FAFB'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Limit Info */}
        {limitInfo && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Blocks:</strong> {limitInfo.currentCount} / {limitInfo.limit === Infinity ? '∞' : limitInfo.limit}
            </p>
          </div>
        )}

        {/* Block Designer */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Design a New Block</h2>
          
          {/* Template Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start from a Pattern Template (Optional)
            </label>
            <div className="flex gap-2">
              <select
                onChange={(e) => e.target.value && loadTemplate(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loadingTemplate}
              >
                <option value="">-- Start from scratch or select a template --</option>
                {patternTemplates
                  .filter(t => [4, 9, 16, 25].includes(t.blockSize)) // Only square grids
                  .map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({Math.sqrt(template.blockSize)}×{Math.sqrt(template.blockSize)})
                    </option>
                  ))}
              </select>
              {selectedTemplate && (
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Clear Template
                </button>
              )}
            </div>
            {selectedTemplate && (
              <p className="text-sm text-gray-600 mt-2">
                📐 Loaded: {selectedTemplate.patternName} - {selectedTemplate.description}
              </p>
            )}
          </div>

          <BlockDesigner 
            onSave={handleSaveBlock}
            gridSize={selectedTemplate?.gridSize}
            initialGrid={selectedTemplate?.gridData}
          />
        </div>

        {/* Block Designer */}
        <BlockDesigner onSave={handleSaveBlock} />

        {/* Saved Blocks */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Saved Blocks</h2>
          
          {loadingBlocks ? (
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
