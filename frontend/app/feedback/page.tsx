'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

interface FeedbackItem {
  id: string;
  title: string;
  description: string | null;
  votesCount: number;
  createdAt: string;
  voted: boolean;
}

export default function FeedbackPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fbTitle, setFbTitle] = useState('');
  const [fbDesc, setFbDesc] = useState('');
  const [fbSaving, setFbSaving] = useState(false);
  const [fbMessage, setFbMessage] = useState('');
  const [fbError, setFbError] = useState('');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoadingList(true);
      const res = await api.get('/api/feedback');
      if (res.data?.success) {
        setFeedbackList(res.data.data.feedback);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoadingList(false);
    }
  };

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
        setShowForm(false);
        loadFeedback(); // Reload the list
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setFbError(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setFbSaving(false);
    }
  };

  const handleVote = async (feedbackId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.post(`/api/feedback/${feedbackId}/vote`);
      if (res.data?.success) {
        // Update the local state
        setFeedbackList(prev => prev.map(item => 
          item.id === feedbackId 
            ? { ...item, voted: res.data.data.voted, votesCount: res.data.data.votesCount }
            : item
        ));
      }
    } catch (err) {
      console.error('Failed to toggle vote:', err);
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

      {/* Header Banner */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Feature Requests & Ideas
          </h1>
          <p className="text-red-100">
            Vote on features you&apos;d like to see or submit your own suggestions
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fbMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {fbMessage}
          </div>
        )}

        {/* Submit New Feedback Button */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-6 py-4 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-shadow"
              style={{backgroundColor: '#B91C1C'}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#991B1B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
            >
              + Submit New Feature Request
            </button>
          </div>
        )}

        {/* Feedback Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Your Idea</h2>
            
            {fbError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {fbError}
              </div>
            )}

            <form onSubmit={handleFeedbackCreate} className="space-y-6">
              <div>
                <label htmlFor="fbTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Title *
                </label>
                <input
                  id="fbTitle"
                  type="text"
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  placeholder="E.g., Add pinwheel pattern template"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="fbDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="fbDesc"
                  value={fbDesc}
                  onChange={(e) => setFbDesc(e.target.value)}
                  rows={4}
                  placeholder="Explain how this feature would help your quilting workflow"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFbTitle('');
                    setFbDesc('');
                    setFbError('');
                  }}
                  className="px-6 py-2 text-gray-700 border border-gray-300 font-semibold rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fbSaving}
                  className="px-6 py-2 text-white font-semibold rounded-md shadow disabled:opacity-50"
                  style={{backgroundColor: '#B91C1C'}}
                  onMouseEnter={(e) => !fbSaving && (e.currentTarget.style.backgroundColor = '#991B1B')}
                  onMouseLeave={(e) => !fbSaving && (e.currentTarget.style.backgroundColor = '#B91C1C')}
                >
                  {fbSaving ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Feedback List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Community Requests</h2>
          <p className="text-sm text-gray-600 mb-6">
            Vote for the features you&apos;d like to see implemented. The most popular requests will be prioritized.
          </p>

          {loadingList ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : feedbackList.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No feature requests yet. Be the first to submit one!
            </p>
          ) : (
            <div className="space-y-4">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Vote Button */}
                    <button
                      onClick={() => handleVote(item.id)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all ${
                        item.voted
                          ? 'bg-red-700 border-red-700 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-red-700 hover:bg-red-50'
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="text-xs font-bold mt-1">{item.votesCount}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Submitted {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
  );
}
