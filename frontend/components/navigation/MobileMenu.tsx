import NavigationLinks from './NavigationLinks';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  logout: () => void;
  onClose: () => void;
}

/**
 * Mobile navigation menu component
 * Single Responsibility: Mobile menu rendering
 */
export default function MobileMenu({ isOpen, user, logout, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 py-2">
      <div className="flex flex-col space-y-1">
        <NavigationLinks user={user} logout={logout} isMobile={true} onLinkClick={onClose} />
      </div>
    </div>
  );
}
