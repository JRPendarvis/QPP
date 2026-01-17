interface PatternMetadataProps {
  difficulty?: string;
  estimatedSize?: string;
  description?: string;
  fabricLayout?: string;
}

export default function PatternMetadata({
  difficulty,
  estimatedSize,
  description,
  fabricLayout,
}: PatternMetadataProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {difficulty && (
          <div>
            <h3 className="font-semibold text-gray-700">Difficulty</h3>
            <p className="text-gray-900">{difficulty}</p>
          </div>
        )}
        {estimatedSize && (
          <div>
            <h3 className="font-semibold text-gray-700">Estimated Size</h3>
            <p className="text-gray-900">{estimatedSize}</p>
          </div>
        )}
      </div>

      {description && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Pattern Description</h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
      )}

      {fabricLayout && (
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>📐</span> Fabric Layout
          </h3>
          <p className="text-gray-800 leading-relaxed">{fabricLayout}</p>
        </div>
      )}
    </div>
  );
}
