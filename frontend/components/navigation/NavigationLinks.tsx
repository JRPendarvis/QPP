import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
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
  const linkClass = isMobile
    ? "px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
    : "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900";

  const buttonClass = isMobile
    ? "px-4 py-3 text-base font-medium text-white rounded-md mx-4 my-2 text-center"
    : "px-4 py-2 text-sm font-medium text-white rounded-md";

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

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
            {...(!isMobile && {
              onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => 
                (e.currentTarget.style.backgroundColor = '#991B1B'),
              onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => 
                (e.currentTarget.style.backgroundColor = '#B91C1C')
            })}
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
            {...(!isMobile && {
              onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => 
                (e.currentTarget.style.backgroundColor = '#991B1B'),
              onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => 
                (e.currentTarget.style.backgroundColor = '#B91C1C')
            })}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
}
