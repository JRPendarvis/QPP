import Link from 'next/link';
import { APP_CONFIG, ROUTES } from '@/lib/constants';
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
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }

      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isCreateMenuOpen || isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateMenuOpen, isAccountMenuOpen]);

  const linkClass = isMobile
    ? "px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
    : "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900";

  const buttonClass = isMobile
    ? "px-4 py-3 text-base font-medium text-white rounded-md mx-4 my-2 text-center"
    : "px-4 py-2 text-sm font-medium text-white rounded-md";

  const dropdownLinkClass = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
  const mobileSectionLabelClass = "px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400";
  const designMenuLabel = 'Quilt Studio';
  const patternGeneratorLabel = 'Design a Quilt';
  const blockDesignerLabel = 'Design a Block';
  const fabricLibraryLabel = 'Fabric Stash';
  const myPatternsLabel = 'Saved Patterns';
  const myBlockDesignsLabel = 'Saved Blocks';
  const profileLabel = 'Quilter Profile';
  const userRole = String(user?.role || '').toLowerCase();
  const userEmail = String(user?.email || '').toLowerCase().trim();
  const adminEmail = APP_CONFIG.ADMIN_EMAIL.toLowerCase().trim();
  const canAccessAdmin = userRole === 'staff' || userRole === 'admin' || (!!adminEmail && userEmail === adminEmail);

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
    setIsCreateMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <p className={mobileSectionLabelClass}>Explore</p>
        <Link href="/about" onClick={handleClick} className={linkClass}>
          About
        </Link>
        <Link href="/faq" onClick={handleClick} className={linkClass}>
          FAQ
        </Link>

        <p className={mobileSectionLabelClass}>{designMenuLabel}</p>
        <Link href={ROUTES.UPLOAD} onClick={handleClick} className={linkClass}>
          {patternGeneratorLabel}
        </Link>
        <Link href={ROUTES.BLOCK_DESIGNER} onClick={handleClick} className={linkClass}>
          {blockDesignerLabel}
        </Link>
        <Link href={ROUTES.FABRICS} onClick={handleClick} className={linkClass}>
          {fabricLibraryLabel}
        </Link>
        {user && (
          <>
            <Link href="/library" onClick={handleClick} className={linkClass}>
              {myPatternsLabel}
            </Link>
            <Link href={ROUTES.MY_BLOCK_DESIGNS} onClick={handleClick} className={linkClass}>
              {myBlockDesignsLabel}
            </Link>
          </>
        )}
        {user ? (
          <>
            <p className={mobileSectionLabelClass}>Account</p>
            <Link href={ROUTES.DASHBOARD} onClick={handleClick} className={linkClass}>
              Dashboard
            </Link>
            <Link href={ROUTES.PRICING} onClick={handleClick} className={linkClass}>
              Subscription
            </Link>
            <Link href="/feedback" onClick={handleClick} className={linkClass}>
              Feedback
            </Link>
            {canAccessAdmin && (
              <Link href="/admin" onClick={handleClick} className={linkClass}>
                Admin
              </Link>
            )}
            <Link href="/profile" onClick={handleClick} className={linkClass}>
              {profileLabel}
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

  return (
    <>
      <Link href="/about" onClick={handleClick} className={linkClass}>
        About
      </Link>
      <Link href="/faq" onClick={handleClick} className={linkClass}>
        FAQ
      </Link>

      <div className="relative" ref={createMenuRef}>
        <button
          onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50"
        >
          <span>{designMenuLabel}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isCreateMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isCreateMenuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <Link href={ROUTES.UPLOAD} onClick={handleClick} className={dropdownLinkClass}>
              {patternGeneratorLabel}
            </Link>
            <Link href={ROUTES.BLOCK_DESIGNER} onClick={handleClick} className={dropdownLinkClass}>
              {blockDesignerLabel}
            </Link>
            <Link href={ROUTES.FABRICS} onClick={handleClick} className={dropdownLinkClass}>
              {fabricLibraryLabel}
            </Link>
            {user && (
              <>
                <Link href="/library" onClick={handleClick} className={dropdownLinkClass}>
                  {myPatternsLabel}
                </Link>
                <Link href={ROUTES.MY_BLOCK_DESIGNS} onClick={handleClick} className={dropdownLinkClass}>
                  {myBlockDesignsLabel}
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {user ? (
        <>
          <Link href={ROUTES.DASHBOARD} onClick={handleClick} className={linkClass}>
            Dashboard
          </Link>
          <Link href="/feedback" onClick={handleClick} className={linkClass}>
            Feedback
          </Link>

          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{user.name || 'Quilter'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {canAccessAdmin && (
                  <>
                    <Link 
                      href="/admin" 
                      onClick={handleClick} 
                      className="block px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                    >
                      Admin
                    </Link>
                    <hr className="my-1 border-gray-200" />
                  </>
                )}
                <Link href={ROUTES.PRICING} onClick={handleClick} className={dropdownLinkClass}>
                  Subscription
                </Link>
                <Link href="/profile" onClick={handleClick} className={dropdownLinkClass}>
                  {profileLabel}
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
