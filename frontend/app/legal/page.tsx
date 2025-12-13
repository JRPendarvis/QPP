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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Documents</h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about using QuiltPlannerPro
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {legalDocuments.map((doc) => (
            <Link
              key={doc.slug}
              href={`/legal/${doc.slug}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{doc.icon}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {doc.title}
                  </h2>
                  <p className="text-gray-600">{doc.description}</p>
                  <div className="mt-4 text-red-600 font-medium hover:underline">
                    Read document →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about our legal documents or policies,
              we're here to help.
            </p>
            <a
              href="mailto:quiltplannerpro@gmail.com"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
