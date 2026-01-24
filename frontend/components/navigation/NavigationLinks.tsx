import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useState, useRef, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
  role?: string;
}

interface NavigationLinksProps {
  user: User | null;
  logout: () => void;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

/**
 * Shared navigation links component
 * Single Responsibility: Render navigation link structure
 */
export default function NavigationLinks({ user, logout, isMobile = false, onLinkClick }: NavigationLinksProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const linkClass = isMobile
    ? "px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
    : "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900";

  const buttonClass = isMobile
    ? "px-4 py-3 text-base font-medium text-white rounded-md mx-4 my-2 text-center"
    : "px-4 py-2 text-sm font-medium text-white rounded-md";

  const dropdownLinkClass = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
    setIsDropdownOpen(false);
  };

  // Mobile view - keep original flat structure
  if (isMobile) {
    return (
      <>
        <Link href="/about" onClick={handleClick} className={linkClass}>
          About
        </Link>
        <Link href="/faq" onClick={handleClick} className={linkClass}>
          FAQ
        </Link>
        <Link href={ROUTES.PRICING} onClick={handleClick} className={linkClass}>
          Pricing
        </Link>
        {user ? (
          <>
            <Link href={ROUTES.DASHBOARD} onClick={handleClick} className={linkClass}>
              Dashboard
            </Link>
            <Link href="/library" onClick={handleClick} className={linkClass}>
              My Patterns
            </Link>
            <Link href="/feedback" onClick={handleClick} className={linkClass}>
              Feedback
            </Link>
            {user.role === 'staff' && (
              <Link href="/admin" onClick={handleClick} className={linkClass}>
                Admin
              </Link>
            )}
            <Link href="/profile" onClick={handleClick} className={linkClass}>
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                handleClick();
              }}
              className={buttonClass}
              style={{backgroundColor: '#B91C1C'}}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href={ROUTES.LOGIN} onClick={handleClick} className={linkClass}>
              Login
            </Link>
            <Link
              href={ROUTES.REGISTER}
              onClick={handleClick}
              className={buttonClass}
              style={{backgroundColor: '#B91C1C'}}
            >
              Sign Up
            </Link>
          </>
        )}
      </>
    );
  }

  // Desktop view - with dropdown
  return (
    <>
      <Link href="/about" onClick={handleClick} className={linkClass}>
        About
      </Link>
      <Link href="/faq" onClick={handleClick} className={linkClass}>
        FAQ
      </Link>
      <Link href={ROUTES.PRICING} onClick={handleClick} className={linkClass}>
        Pricing
      </Link>
      {user ? (
        <>
          <Link href="/feedback" onClick={handleClick} className={linkClass}>
            Feedback
          </Link>
          {user.role === 'staff' && (
            <Link 
              href="/admin" 
              onClick={handleClick} 
              className="px-3 py-1.5 text-sm font-semibold text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 border border-purple-200"
            >
              Admin
            </Link>
          )}
          
          {/* Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{user.name || 'Account'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Link href={ROUTES.DASHBOARD} onClick={handleClick} className={dropdownLinkClass}>
                  Dashboard
                </Link>
                <Link href="/library" onClick={handleClick} className={dropdownLinkClass}>
                  My Patterns
                </Link>
                <Link href="/profile" onClick={handleClick} className={dropdownLinkClass}>
                  Profile
                </Link>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => {
                    logout();
                    handleClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link href={ROUTES.LOGIN} onClick={handleClick} className={linkClass}>
            Login
          </Link>
          <Link
            href={ROUTES.REGISTER}
            onClick={handleClick}
            className={buttonClass}
            style={{backgroundColor: '#B91C1C'}}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => 
              (e.currentTarget.style.backgroundColor = '#991B1B')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => 
              (e.currentTarget.style.backgroundColor = '#B91C1C')}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
}
          </Link>
        </>
      )}
    </>
  );
}
