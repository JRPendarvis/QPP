import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-6xl font-bold text-gray-900">
          QuiltPlannerPro
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          AI-powered quilt pattern generator. Upload your fabric images and let AI create beautiful quilt designs with step-by-step instructions.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md border border-indigo-600 hover:bg-indigo-50 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Upload Fabrics</h3>
            <p className="text-gray-600">Upload images of your fabric collection</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">AI Generation</h3>
            <p className="text-gray-600">Let AI create unique quilt patterns</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Get Instructions</h3>
            <p className="text-gray-600">Download PDF with step-by-step guide</p>
          </div>
        </div>
      </div>
    </div>
  );
}