'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  // Use lazy initialization to check localStorage once on mount
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window === 'undefined') return false;
    const consent = localStorage.getItem('cookieConsent');
    return !consent;
  });

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              🍪 We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
              By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
              <Link href="/legal/privacy-policy" className="text-red-600 hover:underline font-medium">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
