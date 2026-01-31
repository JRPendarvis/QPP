import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <Navigation />

      {/* Hero Section */}
      <div className="py-12 px-4" style={{backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Quilt Planner Pro
          </h1>
          <p className="text-xl text-red-100">
            AI-powered quilt pattern generation for quilters of all skill levels
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">

          {/* Our Story */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Quilt Planner Pro was born from a passion for quilting and a vision to make pattern design 
              accessible to everyone. We understand that choosing the right pattern and colors can be 
              overwhelming, especially when you have beautiful fabrics but aren&apos;t sure how to combine them.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Using cutting-edge AI technology, we&apos;ve created a tool that analyzes your fabric choices 
              and generates custom quilt patterns tailored to your skill level. Whether you&apos;re a beginner 
              making your first quilt or an expert looking for inspiration, Quilt Planner Pro is here to help.
            </p>
          </section>

          {/* What We Do */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-2">🎨 Fabric Analysis</h3>
                <p className="text-gray-700">
                  Upload photos of your fabrics and our AI analyzes colors, patterns, and textures 
                  to create the perfect quilt design.
                </p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-900 mb-2">📐 Pattern Generation</h3>
                <p className="text-gray-700">
                  Get custom quilt patterns matched to your skill level, from simple squares to 
                  complex medallions.
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">📋 Detailed Instructions</h3>
                <p className="text-gray-700">
                  Receive step-by-step instructions and visual guides to bring your quilt to life.
                </p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">💾 Save & Download</h3>
                <p className="text-gray-700">
                  Save your favorite patterns and download them as PDFs to use anytime.
                </p>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe that everyone should be able to create beautiful quilts, regardless of their 
              experience level. Our mission is to democratize quilt design by combining traditional 
              quilting knowledge with modern AI technology, making it easier than ever to turn your 
              fabric collection into stunning quilts.
            </p>
          </section>

          {/* Contact CTA */}
          <section className="bg-linear-to-r from-red-100 to-teal-100 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Start Quilting?</h2>
            <p className="text-gray-700 mb-6">
              Join thousands of quilters who are already using Quilt Planner Pro to create amazing quilts.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/faq"
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
              >
                Learn More
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
