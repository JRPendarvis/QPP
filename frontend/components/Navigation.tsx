'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ROUTES, UI_CONSTANTS } from '@/lib/constants';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href={ROUTES.HOME}>
              <h1 className="text-2xl font-bold text-gray-900">{UI_CONSTANTS.BRAND_NAME}</h1>
            </Link>
          </div>
          <div className="flex gap-4">
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
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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