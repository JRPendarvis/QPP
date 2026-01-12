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
    <>
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
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-900">{description}</p>
        </div>
      )}

      {fabricLayout && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Fabric Layout</h3>
          <p className="text-gray-900">{fabricLayout}</p>
        </div>
      )}
    </>
  );
}
