'use client';

import Navigation from '@/components/Navigation';
import FabricCreateForm from '@/components/fabrics/FabricCreateForm';
import FabricLibraryList from '@/components/fabrics/FabricLibraryList';
import { useFabricsPageModel } from '@/hooks/useFabricsPageModel';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function FabricsPage() {
  const {
    authLoading,
    fabrics,
    loading,
    usageStats,
    selectedFabricId,
    deletingId,
    usageWarning,
    setSelectedFabricId,
    handleCreate,
    handleDelete,
    handleQuickUpdateYardage,
  } = useFabricsPageModel();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 45%, #FFFBEB 100%)' }}>
      <Navigation />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h1 className="text-2xl font-bold text-gray-900">Fabric Library</h1>
            <p className="text-sm text-gray-600 mt-1">
              Save, organize, and reuse your fabrics across blocks and quilts. Add fabrics by taking a photo or uploading one you already have.
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
            {usageStats.limit === 0 ? (
              <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Fabric Library</h2>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Save and organize your fabric collection to use across multiple projects.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                    <li>Take photos or upload existing images</li>
                    <li>Track yardage and fabric details</li>
                    <li>Reuse fabrics in blocks and quilts</li>
                    <li>Never lose track of your stash</li>
                  </ul>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Unlock Fabric Library with any paid plan
                    </p>
                    <Link
                      href={ROUTES.PRICING}
                      className="block w-full px-4 py-3 rounded-lg text-white font-medium text-center"
                      style={{backgroundColor: '#B91C1C'}}
                    >
                      View Plans & Upgrade
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <FabricCreateForm loading={loading} onCreate={handleCreate} />
            )}

            <FabricLibraryList
              fabrics={fabrics}
              authLoading={authLoading}
              loading={loading}
              deletingId={deletingId}
              selectedFabricId={selectedFabricId}
              onSelectFabric={setSelectedFabricId}
              onDeleteFabric={handleDelete}
              onQuickUpdateYardage={handleQuickUpdateYardage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
