import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { UserProfile, PatternDetails } from './types';
import {
  NEXT_LEVEL,
  getPatternsForSkillLevel,
  fetchAllPatterns,
  PatternOption,
} from '@/app/helpers/patternHelpers';

export function useUserProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

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

  return { user, loading, profile };
}

export function usePatternSelection(profile: UserProfile | null, challengeMe: boolean) {
  const currentSkill = profile?.skillLevel || 'beginner';
  const targetSkill = challengeMe ? NEXT_LEVEL[currentSkill] : currentSkill;
  const [allPatterns, setAllPatterns] = useState<PatternOption[]>([]);

  useEffect(() => {
    fetchAllPatterns().then((patterns) => {
      setAllPatterns(patterns);
    });
  }, []);

  const availablePatterns = useMemo<PatternDetails[]>(() => {
    return getPatternsForSkillLevel(targetSkill, allPatterns)
      .map((pattern) => ({
        id: pattern.id,
        name: pattern.name,
        minFabrics: pattern.minFabrics ?? pattern.minColors,
        maxFabrics: pattern.maxFabrics,
      }))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [targetSkill, allPatterns]);

  return { currentSkill, targetSkill, availablePatterns };
}