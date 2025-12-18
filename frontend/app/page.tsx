'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.REGISTER);
    }
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <Navigation />

      {/* Hero Section */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Match Your Fabrics to Traditional Quilt Patterns
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: '#1F2937'}}>
            Upload your fabric images and let our AI match them to traditional quilt patterns
            like Ohio Star, Log Cabin, and more. Get personalized instructions and realistic
            visualizations tailored to your skill level and fabric collection.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 text-white font-semibold rounded-lg shadow-lg text-lg"
            style={{backgroundColor: '#2C7A7B'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#236B6C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C7A7B'}
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-lg shadow-lg" style={{backgroundColor: '#FFF', borderLeft: '6px solid #B91C1C'}}>
            <h3 className="text-2xl font-bold mb-4" style={{color: '#B91C1C'}}>AI-Powered Design</h3>
            <p className="text-gray-700">
              Upload 2-8 fabric images and our AI creates custom patterns that complement your fabrics perfectly.
            </p>
          </div>
          <div className="p-8 rounded-lg shadow-lg" style={{backgroundColor: '#2C7A7B', color: '#FFF'}}>
            <h3 className="text-2xl font-bold mb-4">Skill Level Matching</h3>
            <p>
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