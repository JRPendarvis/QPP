import Link from 'next/link';

const docs = [
  { slug: 'terms-of-service', title: 'Terms of Service' },
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'refund-policy', title: 'Refund Policy' },
  { slug: 'pricing-structure', title: 'Pricing Structure' },
];

export default function LegalIndex() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Legal & Policies</h1>
        <p className="mb-6 text-gray-700">View our terms, privacy policy, refund policy, and pricing structure.</p>

        <ul className="space-y-3">
          {docs.map((d) => (
            <li key={d.slug}>
              <Link href={`/legal/${d.slug}`} className="text-indigo-600 hover:underline">
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
