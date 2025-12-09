'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackItem {
  id: string;
  title: string;
  description?: string;
  votesCount: number;
  createdAt: string;
  voted?: boolean;
}

export default function FeedbackPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/feedback');
      if (res.data?.success) setItems(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch feedback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleVote = async (id: string) => {
    try {
      const res = await api.post(`/api/feedback/${id}/vote`);
      if (res.data?.success) {
        const { voted, votesCount } = res.data.data;
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, voted, votesCount } : p)));
      }
    } catch (err) {
      console.error('Vote failed', err);
      alert('You must be logged in to vote');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please provide a title');
    try {
      const res = await api.post('/api/feedback', { title, description });
      if (res.data?.success) {
        setTitle('');
        setDescription('');
        fetchList();
      }
    } catch (err) {
      console.error('Create failed', err);
      alert('Failed to create suggestion (login required)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Feature Requests & Roadmap</h1>

        <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Share an idea</h2>
          <input
            className="w-full border px-3 py-2 mb-2 rounded"
            placeholder="Short title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 mb-2 rounded"
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="submit">
              Submit
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <p>Loading...</p>
          ) : (
            items.map((it) => (
              <div key={it.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{it.title}</h3>
                  {it.description && <p className="text-sm text-gray-600 mt-1">{it.description}</p>}
                </div>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleVote(it.id)}
                    className={`px-3 py-1 rounded ${it.voted ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                  >
                    ▲
                  </button>
                  <span className="text-sm mt-1">{it.votesCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
