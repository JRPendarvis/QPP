/**
 * Loading state component
 * Single Responsibility: Display loading UI
 */
export default function LoadingState() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your pattern library...</p>
        </div>
      </div>
    </div>
  );
}
