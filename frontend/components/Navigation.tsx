'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ROUTES, UI_CONSTANTS, AUTH_CONSTANTS } from '@/lib/constants';
import { useState, useEffect } from 'react';

interface UserProfile {
  badge?: string;
}

export default function Navigation() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
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
          if (result.success && result.data) {
            setProfile({ badge: result.data.badge });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Link href={ROUTES.HOME} className="flex items-center gap-3">
              {/* Logo SVG */}
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#DC2626', stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:'#B91C1C', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#7C2D12', stopOpacity:1}} />
                  </linearGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <rect width="100" height="100" rx="16" fill="url(#bgGradient)"/>
                <rect x="40" y="40" width="20" height="20" fill="#FEE2E2"/>
                <path d="M40 40 L30 30 L40 30 Z" fill="#FCA5A5"/>
                <path d="M60 40 L70 30 L60 30 Z" fill="#FCA5A5"/>
                <path d="M40 60 L30 70 L40 70 Z" fill="#FCA5A5"/>
                <path d="M60 60 L70 70 L60 70 Z" fill="#FCA5A5"/>
                <path d="M40 40 L30 40 L30 30 Z" fill="#EF4444"/>
                <path d="M60 40 L70 40 L70 30 Z" fill="#EF4444"/>
                <path d="M40 60 L30 60 L30 70 Z" fill="#EF4444"/>
                <path d="M60 60 L70 60 L70 70 Z" fill="#EF4444"/>
                <rect x="30" y="40" width="10" height="20" fill="#B91C1C"/>
                <rect x="60" y="40" width="10" height="20" fill="#B91C1C"/>
                <rect x="40" y="30" width="20" height="10" fill="#B91C1C"/>
                <rect x="40" y="60" width="20" height="10" fill="#B91C1C"/>
                <circle cx="50" cy="50" r="13" fill="#FBBF24" filter="url(#shadow)"/>
                <text x="50" y="54" fontSize="10" fill="#7C2D12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">QPP</text>
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">{UI_CONSTANTS.BRAND_NAME}</h1>
            </Link>
            {profile?.badge && (
              <img 
                src={profile.badge === 'tester' ? '/QPPTester.png' : '/QPPFounder.png'}
                alt={profile.badge === 'tester' ? 'QPP Tester' : 'QPP Founder'}
                className="h-10 w-auto ml-2"
              />
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              FAQ
            </Link>
            <Link
              href={ROUTES.PRICING}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/feedback"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Feedback
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{backgroundColor: '#B91C1C'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#991B1B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{backgroundColor: '#B91C1C'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#991B1B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}