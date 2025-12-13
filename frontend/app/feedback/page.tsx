'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

export default function FeedbackPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fbTitle, setFbTitle] = useState('');
  const [fbDesc, setFbDesc] = useState('');
  const [fbSaving, setFbSaving] = useState(false);
  const [fbMessage, setFbMessage] = useState('');
  const [fbError, setFbError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleFeedbackCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFbMessage('');
    setFbError('');

    if (!fbTitle.trim()) {
      setFbError('Please provide a short title');
      return;
    }
    setFbSaving(true);
    try {
      const res = await api.post('/api/feedback', { title: fbTitle.trim(), description: fbDesc.trim() || undefined });
      if (res.data?.success) {
        setFbTitle('');
        setFbDesc('');
        setFbMessage('Thanks! Your suggestion has been submitted.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setFbError(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setFbSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-2">Share Your Feedback & Ideas</h1>
          <p className="text-gray-600 mb-8">
            We&apos;d love to hear from you! Tell us what features you&apos;d like to see or how we can improve your quilting experience.
          </p>

          {fbMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {fbMessage}
            </div>
          )}
          {fbError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {fbError}
            </div>
          )}

          <form onSubmit={handleFeedbackCreate} className="space-y-6">
            <div>
              <label htmlFor="fbTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Short Title *
              </label>
              <input
                id="fbTitle"
                type="text"
                value={fbTitle}
                onChange={(e) => setFbTitle(e.target.value)}
                placeholder="E.g., Add pinwheel template editor"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="fbDesc" className="block text-sm font-medium text-gray-700 mb-2">
                Details (optional)
              </label>
              <textarea
                id="fbDesc"
                value={fbDesc}
                onChange={(e) => setFbDesc(e.target.value)}
                rows={6}
                placeholder="Explain how this would help your workflow or why you&apos;d like this feature"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-700 border border-gray-300 font-semibold rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={fbSaving}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                {fbSaving ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
