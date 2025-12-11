'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">QuiltPlannerPro</h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Pricing
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Custom Quilt Patterns with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your fabric images and let our AI generate personalized quilt patterns
            tailored to your skill level. From beginner to expert, create beautiful quilts
            that match your fabrics perfectly.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition text-lg"
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Design</h3>
            <p className="text-gray-600">
              Upload 2-8 fabric images and our AI creates custom patterns that complement your fabrics perfectly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Skill Level Matching</h3>
            <p className="text-gray-600">
              Patterns are generated based on your quilting experience, from beginner-friendly to expert-level designs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Multiple Formats</h3>
            <p className="text-gray-600">
              Download your patterns in PDF format with detailed instructions and cutting layouts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}