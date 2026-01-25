import { useState, useEffect } from 'react';
import { AUTH_CONSTANTS } from '@/lib/constants';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
}

interface UserProfile {
  badge?: string;
}

/**
 * Hook for fetching user profile data
 * Single Responsibility: Profile data fetching logic
 */
export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) setProfile(null);
        return;
      }
      
      const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (isMounted && result.success && result.data) {
            setProfile({ badge: result.data.badge });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return profile;
}
