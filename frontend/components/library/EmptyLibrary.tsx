import { useRouter } from 'next/navigation';

/**
 * Empty library state component
 * Single Responsibility: Display empty state UI
 */
export default function EmptyLibrary() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center">
      <div className="text-6xl mb-4">📚</div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Saved Patterns</h2>
      <p className="text-gray-600 mb-6">Download a pattern to save it to your library</p>
      <button
        onClick={() => router.push('/upload')}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
      >
        Create a Pattern
      </button>
    </div>
  );
}
