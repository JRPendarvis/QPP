'use client';

import { FabricRecord } from '@/services/fabricService';
import { formatYardage, RequirementInputRow } from './formatters';

type AvailabilityResult = {
  statement: string;
  hasShortage: boolean;
  summary: { totalRequired: number; totalAvailable: number; totalShortage: number };
  breakdown: Array<{
    fabricId: string;
    name: string;
    requiredYardage: number;
    availableYardage: number;
    shortageYardage: number;
  }>;
};

type QuiltFabricCheckPanelProps = {
  fabrics: FabricRecord[];
  selectedFabricId: string | null;
  quiltName: string;
  requirements: RequirementInputRow[];
  availabilityResult: AvailabilityResult | null;
  onQuiltNameChange: (value: string) => void;
  onRequirementsChange: (rows: RequirementInputRow[]) => void;
  onRunAvailabilityCheck: () => Promise<void>;
  onStartQuilt: () => Promise<void>;
};

export default function QuiltFabricCheckPanel({
  fabrics,
  selectedFabricId,
  quiltName,
  requirements,
  availabilityResult,
  onQuiltNameChange,
  onRequirementsChange,
  onRunAvailabilityCheck,
  onStartQuilt,
}: QuiltFabricCheckPanelProps) {
  const addRequirementRow = () => {
    if (fabrics.length === 0) return;
    const fallbackId = selectedFabricId || fabrics[0].id;
    onRequirementsChange([...requirements, { fabricId: fallbackId, requiredYardage: '1' }]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Start Quilt: Fabric Check</h2>
        <p className="text-sm text-gray-600">Check if there is enough fabric before committing to make a quilt.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={quiltName}
          onChange={(event) => onQuiltNameChange(event.target.value)}
          placeholder="Quilt name (optional)"
          className="md:col-span-2 border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          onClick={addRequirementRow}
          className="px-3 py-2 bg-gray-800 text-white rounded-md"
        >
          Add Fabric Requirement
        </button>
      </div>

      {requirements.length > 0 && (
        <div className="space-y-2">
          {requirements.map((row, index) => (
            <div key={`${row.fabricId}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <select
                value={row.fabricId}
                onChange={(event) => {
                  const value = event.target.value;
                  onRequirementsChange(
                    requirements.map((item, i) => (i === index ? { ...item, fabricId: value } : item))
                  );
                }}
                className="md:col-span-2 border border-gray-300 rounded-md px-3 py-2"
              >
                {fabrics.map((fabric) => (
                  <option key={fabric.id} value={fabric.id}>
                    {fabric.name} ({formatYardage(fabric.yardageAvailable - fabric.yardageReserved)} free)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.25"
                value={row.requiredYardage}
                onChange={(event) => {
                  const value = event.target.value;
                  onRequirementsChange(
                    requirements.map((item, i) => (i === index ? { ...item, requiredYardage: value } : item))
                  );
                }}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <button
                onClick={() => onRequirementsChange(requirements.filter((_, i) => i !== index))}
                className="px-3 py-2 bg-red-600 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => void onRunAvailabilityCheck()}
          disabled={requirements.length === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400"
        >
          Check Availability
        </button>
        <button
          onClick={() => void onStartQuilt()}
          disabled={requirements.length === 0 || (availabilityResult?.hasShortage ?? true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md disabled:bg-gray-400"
        >
          Start Quilt (Reserve Fabric)
        </button>
      </div>

      {availabilityResult && (
        <div className={`rounded-lg border px-4 py-3 ${availabilityResult.hasShortage ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <p className="font-semibold">{availabilityResult.statement}</p>
          <p className="text-sm mt-1">
            Needed: {formatYardage(availabilityResult.summary.totalRequired)} | Available: {formatYardage(availabilityResult.summary.totalAvailable)}
            {availabilityResult.hasShortage ? ` | Short by: ${formatYardage(availabilityResult.summary.totalShortage)}` : ''}
          </p>
          <ul className="mt-2 text-sm space-y-1">
            {availabilityResult.breakdown.map((item) => (
              <li key={item.fabricId}>
                {item.name}: need {formatYardage(item.requiredYardage)}, have {formatYardage(item.availableYardage)}
                {item.shortageYardage > 0 ? `, short ${formatYardage(item.shortageYardage)}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
