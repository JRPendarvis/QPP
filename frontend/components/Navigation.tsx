'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ROUTES, UI_CONSTANTS } from '@/lib/constants';
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import LogoIcon from './navigation/LogoIcon';
import NavigationLinks from './navigation/NavigationLinks';
import MobileMenu from './navigation/MobileMenu';

/**
 * Main navigation component
 * Single Responsibility: Orchestrate navigation UI
 * Delegates profile fetching, logo, and menu rendering to specialized components
 */
export default function Navigation() {
  const { user, logout } = useAuth();
  const profile = useUserProfile(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Link href={ROUTES.HOME} className="flex items-center gap-3">
              <LogoIcon />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{UI_CONSTANTS.BRAND_NAME}</h1>
            </Link>
            {profile?.badge && (
              <img 
                src={profile.badge === 'tester' ? '/QPPTester.png' : '/QPPFounder.png'}
                alt={profile.badge === 'tester' ? 'QPP Tester' : 'QPP Founder'}
                className="h-8 sm:h-10 w-auto ml-2"
              />
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <NavigationLinks user={user} logout={logout} />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} user={user} logout={logout} onClose={closeMobileMenu} />
      </div>
    </nav>
  );
}