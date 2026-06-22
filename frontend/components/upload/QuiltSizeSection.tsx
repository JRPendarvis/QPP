import { Border, BorderConfiguration } from '@/types/Border';
import { getBorderName } from '@/utils/borderNaming';

interface QuiltSizeSectionProps {
  quiltSize: string;
  setQuiltSize: (value: string) => void;
  borderConfiguration: BorderConfiguration;
  toggleBorders: (enabled: boolean) => void;
  addBorder: (fabricIndex?: number) => void;
  removeBorder: (borderId: string) => void;
  updateBorder: (borderId: string, updates: Partial<Border>) => void;
  reorderBorder: (borderId: string, direction: 'up' | 'down') => void;
}

export default function QuiltSizeSection({
  quiltSize,
  setQuiltSize,
  borderConfiguration,
  toggleBorders,
  addBorder,
  removeBorder,
  updateBorder,
  reorderBorder,
}: QuiltSizeSectionProps) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Step 2: Choose Quilt Size</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Choose your desired quilt size (optional)
          </label>
          <select
            value={quiltSize}
            onChange={(e) => setQuiltSize(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-700 transition-colors"
          >
            <option value="">Default (60×72 inches)</option>
            <option value="baby">Baby (36×52 inches)</option>
            <option value="lap">Lap/Throw (50×65 inches)</option>
            <option value="twin">Twin (66×90 inches)</option>
            <option value="full">Full/Double (80×90 inches)</option>
            <option value="queen">Queen (90×95 inches)</option>
            <option value="king">King (105×95 inches)</option>
          </select>
          {quiltSize && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {quiltSize.charAt(0).toUpperCase() + quiltSize.slice(1)} size
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Would you like to add borders?
            </label>
            <button
              type="button"
              onClick={() => toggleBorders(!borderConfiguration.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                borderConfiguration.enabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              aria-label="Toggle borders"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  borderConfiguration.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {borderConfiguration.enabled && (
            <div className="space-y-3 mt-3">
              {[...borderConfiguration.borders]
                .sort((a, b) => a.order - b.order)
                .map((border, index) => {
                  const borderName = getBorderName(border.order, borderConfiguration.borders.length);

                  return (
                    <div key={border.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{borderName}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => reorderBorder(border.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                            aria-label="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderBorder(border.id, 'down')}
                            disabled={index === borderConfiguration.borders.length - 1}
                            className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                            aria-label="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBorder(border.id)}
                            className="p-1 text-red-500 hover:text-red-700 text-xs"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Width (inches)</label>
                        <input
                          type="number"
                          min={0.5}
                          max={12}
                          step={0.5}
                          value={border.width}
                          onChange={(e) => updateBorder(border.id, { width: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}

              {borderConfiguration.borders.length < 3 && (
                <button
                  type="button"
                  onClick={() => addBorder(0)}
                  className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  + Add Border ({borderConfiguration.borders.length}/3)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
