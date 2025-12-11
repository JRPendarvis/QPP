'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">QuiltPlannerPro</h3>
            <p className="text-gray-300 text-sm">
              AI-powered quilt pattern generator for quilters of all skill levels.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-gray-300 hover:text-white transition">
                  Start New Design
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms-of-service" className="text-gray-300 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refund-policy" className="text-gray-300 hover:text-white transition">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/pricing-structure" className="text-gray-300 hover:text-white transition">
                  Pricing Structure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 QuiltPlannerPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}