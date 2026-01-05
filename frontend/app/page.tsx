'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <Navigation />

      {/* Hero Section */}
      <div className="py-20 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI-Powered Quilt Pattern Generator
          </h1>
          <p className="text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
            Upload your fabrics and let our AI create custom quilt patterns matched to your skill level
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-red-700 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-red-800 text-white font-bold text-lg rounded-lg hover:bg-red-900 transition-colors shadow-lg"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Stop Staring at Your Fabric Stash</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            You love collecting fabric, but choosing the right pattern and colors is overwhelming
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-3">😫</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Pattern Paralysis</h3>
              <p className="text-gray-600">
                Hundreds of patterns to choose from, but which one works with your specific fabrics and skill level?
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Color Confusion</h3>
              <p className="text-gray-600">
                You bought fabrics you love, but can&apos;t visualize how they&apos;ll look together in a finished quilt.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-3">📏</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wasted Time & Money</h3>
              <p className="text-gray-600">
                Hours spent planning, only to realize the pattern doesn&apos;t suit your fabrics or abilities.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-4">QuiltPlannerPro solves this.</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simply upload photos of your fabrics, select your skill level, and our AI instantly generates 
              a custom pattern designed specifically for YOUR fabrics and abilities.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Fabrics</h3>
            <p className="text-gray-600">
              Upload 2-9 photos of your fabric collection
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Skill Level</h3>
            <p className="text-gray-600">
              Select your experience or let our AI match you
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Pattern</h3>
            <p className="text-gray-600">
              AI creates a custom quilt pattern just for you
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Instructions</h3>
            <p className="text-gray-600">
              Download detailed cutting and assembly guides
            </p>
          </div>
        </div>

        {/* Pattern Examples */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">25+ Traditional Quilt Patterns</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            From beginner-friendly Simple Squares to expert-level Double Wedding Ring, our AI selects the perfect pattern for your skill level and fabric count.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-red-50 to-red-100 p-6 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2">Beginner</h4>
              <p className="text-gray-700 text-sm">Simple Squares, Strip Quilts, Rail Fence</p>
            </div>
            <div className="bg-linear-to-br from-teal-50 to-teal-100 p-6 rounded-lg">
              <h4 className="font-bold text-teal-900 mb-2">Intermediate</h4>
              <p className="text-gray-700 text-sm">Log Cabin, Flying Geese, Ohio Star</p>
            </div>
            <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
              <h4 className="font-bold text-yellow-900 mb-2">Expert</h4>
              <p className="text-gray-700 text-sm">Lone Star, New York Beauty, Kaleidoscope Star</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Create Your Perfect Quilt?</h2>
          <p className="text-xl text-gray-600 mb-8">Join quilters who are using AI to bring their fabric visions to life</p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-red-700 text-white font-bold text-xl rounded-lg hover:bg-red-800 transition-colors shadow-lg"
          >
            Get Started Free
          </Link>
          <p className="mt-4 text-gray-500">No credit card required</p>
        </div>
      </div>
    </div>
  );
}
