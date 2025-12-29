
'use client';

// Extend Window interface for drag-and-drop fabric reordering
declare global {
  interface Window {
    __setFabrics?: (fabrics: File[]) => void;
    __setPreviews?: (previews: string[]) => void;
  }
}


import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePatternGeneration } from '@/hooks/usePatternGeneration';
import Navigation from '@/components/Navigation';
import UploadHeader from '@/components/upload/UploadHeader';
import FabricUploader from '../components/FabricUploader';
import PatternDisplay from '@/components/upload/PatternDisplay';
import api from '@/lib/api';
import { NEXT_LEVEL } from './helpers/patternHelpers';
import PatternSelector from '../components/PatternSelector';
import { UserProfile } from './types/user';



export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [patternChoice, setPatternChoice] = useState<'auto' | 'manual'>('auto');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [challengeMe, setChallengeMe] = useState(false);
  

  // (Removed duplicate 'use client' and 'declare global')
  const {
    fabrics,
    previews,
    pattern,
    error,
    MAX_FABRICS,
    MIN_FABRICS,
    handleFilesAdded,
    removeFabric,
    clearAll,
    resetPattern,
    // generatePattern,
    setFabrics,
    setPreviews,
  } = usePatternGeneration();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        if (isMounted && response.data.success) {
          setProfile(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (user) {
      fetchProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);



  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentSkill = profile.skillLevel || 'beginner';
  const targetSkill = challengeMe ? NEXT_LEVEL[currentSkill] : currentSkill;

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <Navigation />

      {/* Hero Section */}
      <div className="py-8 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <UploadHeader />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!pattern && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <PatternSelector
                patternChoice={patternChoice}
                setPatternChoice={setPatternChoice}
                selectedPattern={selectedPattern}
                setSelectedPattern={setSelectedPattern}
                challengeMe={challengeMe}
                setChallengeMe={setChallengeMe}
                currentSkill={currentSkill}
                targetSkill={targetSkill}
              />
              <FabricUploader
                fabrics={fabrics}
                previews={previews}
                maxFabrics={MAX_FABRICS}
                minFabrics={MIN_FABRICS}
                handleFilesAdded={handleFilesAdded}
                removeFabric={removeFabric}
                clearAll={clearAll}
                onReorder={(fromIdx, toIdx) => {
                  // Reorder fabrics and previews in sync
                  const newFabrics = [...fabrics];
                  const newPreviews = [...previews];
                  const [movedFabric] = newFabrics.splice(fromIdx, 1);
                  const [movedPreview] = newPreviews.splice(fromIdx, 1);
                  newFabrics.splice(toIdx, 0, movedFabric);
                  newPreviews.splice(toIdx, 0, movedPreview);
                  setFabrics(newFabrics);
                  setPreviews(newPreviews);
                }}
                totalSize={fabrics.reduce((sum, f) => sum + f.size, 0)}
              />
            </div>
          )}
          {pattern && (
            <PatternDisplay
              pattern={pattern}
              userTier={profile.subscriptionTier}
              usage={profile.usage}
              onStartOver={resetPattern}
            />
          )}
        </div>
      </main>
    </div>
  );
}
