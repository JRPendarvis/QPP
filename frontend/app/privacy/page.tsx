export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Last updated: January 2, 2026</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
      <p className="text-gray-700 mb-4">
        • Email address and name (for account creation)<br/>
        • Payment information (processed securely by Stripe)<br/>
        • Fabric images (processed temporarily, not stored permanently)
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
      <p className="text-gray-700 mb-4">
        • To provide the pattern generation service<br/>
        • To process payments<br/>
        • To send important account notifications
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Data Storage</h2>
      <p className="text-gray-700 mb-4">
        Uploaded fabric images are processed in memory and not permanently stored. 
        Generated patterns are saved to your account until you delete them.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Third Parties</h2>
      <p className="text-gray-700 mb-4">
        • Stripe (payment processing)<br/>
        • Anthropic Claude (AI pattern generation - images sent securely)
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
      <p className="text-gray-700">
        Privacy questions? Email privacy@quiltplannerpro.com
      </p>
    </div>
  );
}