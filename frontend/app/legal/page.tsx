'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

const legalDocuments = [
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Our terms and conditions for using QuiltPlannerPro',
    icon: '📋',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your information',
    icon: '🔒',
  },
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    description: 'Our policy on refunds and subscription changes',
    icon: '💰',
  },
  {
    slug: 'pricing-structure',
    title: 'Pricing Structure',
    description: 'Detailed information about our pricing tiers',
    icon: '💵',
  },
];

export default function LegalIndex() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#F9FAFB'}}>
      <Navigation />
      
      {/* Header Banner */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Legal Documents</h1>
          <p className="text-lg text-white mb-4">
            Everything you need to know about using Quilt Planner Pro
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {legalDocuments.map((doc) => (
            <Link
              key={doc.slug}
              href={`/legal/${doc.slug}`}
              className="rounded-lg shadow-lg p-8 hover:shadow-xl transition-all border-l-8"
              style={{backgroundColor: '#FFF', borderLeftColor: '#2C7A7B'}}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{doc.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2" style={{color: '#B91C1C'}}>
                    {doc.title}
                  </h2>
                  <p className="text-gray-700">{doc.description}</p>
                  <div className="mt-4 font-bold hover:underline" style={{color: '#2C7A7B'}}>
                    Read document →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-lg shadow-lg p-10" style={{backgroundColor: '#FFF', borderTop: '6px solid #F59E0B'}}>
            <h2 className="text-3xl font-bold mb-4" style={{color: '#B91C1C'}}>
              Questions?
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              If you have any questions about our legal documents or policies,
              we're here to help.
            </p>
            <a
              href="mailto:quiltplannerpro@gmail.com"
              className="inline-block px-8 py-4 text-white font-bold rounded-lg shadow-lg transition text-lg"
              style={{backgroundColor: '#2C7A7B'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#236B6C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C7A7B'}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
