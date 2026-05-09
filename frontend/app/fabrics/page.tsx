'use client';

import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useFabricLibrary } from '@/hooks/useFabricLibrary';

function formatYardage(value: number): string {
  return `${value.toFixed(2)} yd`;
}

export default function FabricsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    fabrics,
    loading,
    usageStats,
    fetchFabrics,
    createFabric,
    updateFabric,
    checkUsage,
    deleteFabric,
    checkAvailability,
    commitQuilt,
  } = useFabricLibrary();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#b91c1c');
  const [yardage, setYardage] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState('cotton');
  const [notes, setNotes] = useState('');
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [usageWarning, setUsageWarning] = useState<string | null>(null);
  const [quiltName, setQuiltName] = useState('');
  const [requirements, setRequirements] = useState<Array<{ fabricId: string; requiredYardage: string }>>([]);
  const [availabilityResult, setAvailabilityResult] = useState<{
    statement: string;
    hasShortage: boolean;
    summary: { totalRequired: number; totalAvailable: number; totalShortage: number };
    breakdown: Array<{ fabricId: string; name: string; requiredYardage: number; availableYardage: number; shortageYardage: number }>;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }
    fetchFabrics();
  }, [authLoading, user, router, fetchFabrics]);

  const selectedFabric = useMemo(
    () => fabrics.find((fabric) => fabric.id === selectedFabricId) || null,
    [fabrics, selectedFabricId]
  );

  const handleCreate = async () => {
    await createFabric({
      name,
      color,
      yardageAvailable: Number(yardage || 0),
      imageUrl: imageUrl || undefined,
      type,
      notes: notes || undefined,
    });
    setName('');
    setColor('#b91c1c');
    setYardage('1');
    setImageUrl('');
    setType('cotton');
    setNotes('');
  };

  const handleImageUpload = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
    setImageUrl(dataUrl);
  };

  const handleDelete = async (fabricId: string) => {
    setDeletingId(fabricId);
    try {
      const usage = await checkUsage(fabricId);
      const totalUsage = usage.usedInBlockDesigns + usage.usedInSavedQuilts;
      if (totalUsage > 0) {
        setUsageWarning(`This fabric is used in ${usage.usedInBlockDesigns} block design(s) and ${usage.usedInSavedQuilts} saved quilt(s).`);
        const proceed = window.confirm(
          `This fabric is used in ${usage.usedInBlockDesigns} block design(s) and ${usage.usedInSavedQuilts} saved quilt(s). Delete anyway?`
        );
        if (!proceed) return;
        await deleteFabric(fabricId, true);
      } else {
        await deleteFabric(fabricId);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const addRequirementRow = () => {
    if (fabrics.length === 0) return;
    const fallbackId = selectedFabricId || fabrics[0].id;
    setRequirements((prev) => [...prev, { fabricId: fallbackId, requiredYardage: '1' }]);
  };

  const runAvailabilityCheck = async () => {
    const payload = requirements
      .map((row) => ({
        fabricId: row.fabricId,
        requiredYardage: Number(row.requiredYardage),
      }))
      .filter((row) => row.fabricId && Number.isFinite(row.requiredYardage) && row.requiredYardage > 0);

    if (payload.length === 0) return;
    const result = await checkAvailability(payload);
    setAvailabilityResult(result);
  };

  const handleStartQuilt = async () => {
    const payload = requirements
      .map((row) => ({
        fabricId: row.fabricId,
        requiredYardage: Number(row.requiredYardage),
      }))
      .filter((row) => row.fabricId && Number.isFinite(row.requiredYardage) && row.requiredYardage > 0);

    if (payload.length === 0) return;

    await commitQuilt(payload, 'reserve', quiltName || undefined);
    await runAvailabilityCheck();
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 45%, #FFFBEB 100%)' }}>
      <Navigation />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h1 className="text-2xl font-bold text-gray-900">Fabric Library</h1>
            <p className="text-sm text-gray-600 mt-1">
              Save, organize, and reuse your fabrics across blocks and quilts.
            </p>
            <p className="text-sm font-medium text-gray-800 mt-3">
              Saved fabrics: {usageStats.used}{usageStats.limit ? ` / ${usageStats.limit}` : ''}
            </p>
            {usageWarning && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm px-3 py-2">
                {usageWarning}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Add Fabric</h2>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Fabric name"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="w-14 h-10 border border-gray-300 rounded"
                />
                <input
                  value={yardage}
                  onChange={(event) => setYardage(event.target.value)}
                  type="number"
                  min="0"
                  step="0.25"
                  placeholder="Yardage"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <input
                value={type}
                onChange={(event) => setType(event.target.value)}
                placeholder="Type (cotton, flannel...)"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes"
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[90px]"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
                className="w-full text-sm"
              />
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Fabric preview" className="w-full h-32 object-cover rounded border border-gray-200" />
              )}
              <button
                onClick={() => void handleCreate()}
                disabled={!name || loading}
                className="w-full px-4 py-2 rounded-lg bg-red-700 text-white font-medium disabled:bg-gray-400"
              >
                Save Fabric
              </button>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Fabrics</h2>
              {authLoading || loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : fabrics.length === 0 ? (
                <p className="text-gray-600">No fabrics saved yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fabrics.map((fabric) => (
                    <div
                      key={fabric.id}
                      className={`border rounded-lg p-3 ${selectedFabricId === fabric.id ? 'border-red-400 bg-red-50/40' : 'border-gray-200'}`}
                      onClick={() => setSelectedFabricId(fabric.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 items-start">
                          {fabric.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fabric.imageUrl} alt={fabric.name} className="w-14 h-10 rounded border border-gray-300 object-cover" />
                          ) : (
                            <div className="w-14 h-10 rounded border border-gray-300" style={{ backgroundColor: fabric.color }} />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{fabric.name}</p>
                            <p className="text-xs text-gray-600">{fabric.type || 'Unspecified type'}</p>
                            <p className="text-xs text-gray-600">Available: {formatYardage(fabric.yardageAvailable)}</p>
                            <p className="text-xs text-gray-500">Reserved: {formatYardage(fabric.yardageReserved)}</p>
                          </div>
                        </div>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDelete(fabric.id);
                          }}
                          disabled={deletingId === fabric.id}
                          className="text-xs px-2 py-1 rounded bg-red-600 text-white disabled:bg-gray-400"
                        >
                          {deletingId === fabric.id ? '...' : 'Delete'}
                        </button>
                      </div>
                      {selectedFabricId === fabric.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          <label className="block text-xs font-medium text-gray-700">Quick Update Yardage</label>
                          <input
                            type="number"
                            min="0"
                            step="0.25"
                            defaultValue={fabric.yardageAvailable}
                            onBlur={(event) => {
                              const value = Number(event.target.value);
                              if (Number.isFinite(value) && value >= 0) {
                                void updateFabric(fabric.id, { yardageAvailable: value });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Start Quilt: Fabric Check</h2>
              <p className="text-sm text-gray-600">Check if there is enough fabric before committing to make a quilt.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={quiltName}
                onChange={(event) => setQuiltName(event.target.value)}
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
                        setRequirements((prev) => prev.map((item, i) => (i === index ? { ...item, fabricId: value } : item)));
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
                        setRequirements((prev) => prev.map((item, i) => (i === index ? { ...item, requiredYardage: value } : item)));
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    />
                    <button
                      onClick={() => setRequirements((prev) => prev.filter((_, i) => i !== index))}
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
                onClick={() => void runAvailabilityCheck()}
                disabled={requirements.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400"
              >
                Check Availability
              </button>
              <button
                onClick={() => void handleStartQuilt()}
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
        </div>
      </section>
    </div>
  );
}
