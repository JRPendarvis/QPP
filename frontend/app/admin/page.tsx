'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

interface OverviewStats {
  totalUsers: number;
  activeSubscribers: number;
  totalPatterns: number;
  totalGenerationsThisMonth: number;
  totalDownloadsThisMonth: number;
  totalFeedback: number;
}

interface UserData {
  id: string;
  email: string;
  name: string | null;
  role: string;
  skillLevel: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  generationsThisMonth: number;
  downloadsThisMonth: number;
  badge: string | null;
  createdAt: string;
  lastLogIn: string | null;
}

interface PatternData {
  id: string;
  userId: string;
  downloaded: boolean;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
    subscriptionTier: string;
  };
  patternData: {
    patternName?: string;
    patternId?: string;
  };
}

interface FeedbackVote {
  id: string;
  userId: string;
  feedbackId: string;
  createdAt: string;
}

interface FeedbackData {
  id: string;
  title: string;
  description: string | null;
  votesCount: number;
  resolved: boolean;
  createdAt: string;
  author: {
    email: string;
    name: string | null;
  } | null;
  votes: FeedbackVote[];
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'patterns' | 'feedback'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [grantingUserId, setGrantingUserId] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/overview');
      if (res.data?.success) {
        setOverview(res.data.data);
      }
    } catch {
      setError('Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/users');
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load users';
      console.error('Load users error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPatterns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/patterns?limit=100');
      if (res.data?.success) {
        setPatterns(res.data.data);
      }
    } catch {
      setError('Failed to load patterns');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/feedback');
      if (res.data?.success) {
        setFeedback(res.data.data);
      }
    } catch {
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    let isMounted = true;

    // Check if user is staff
    const checkAccess = async () => {
      try {
        const profileRes = await api.get('/api/user/profile');
        if (!isMounted) return;
        
        if (profileRes.data?.data?.role !== 'staff') {
          router.push('/dashboard');
          return;
        }
        
        // Load initial data
        await loadOverview();
      } catch {
        if (!isMounted) return;
        setError('Access denied');
        router.push('/dashboard');
      }
    };

    checkAccess();
    
    return () => {
      isMounted = false;
    };
  }, [user, router, loadOverview]);

  const handleTabChange = async (tab: typeof activeTab) => {
    setActiveTab(tab);
    setError(null);
    setSuccessMessage(null);

    if (tab === 'users' && users.length === 0) await loadUsers();
    if (tab === 'patterns' && patterns.length === 0) await loadPatterns();
    if (tab === 'feedback' && feedback.length === 0) await loadFeedback();
  };

  const handleGrantProSubscription = async (userEmail: string, userId: string) => {
    if (!confirm(`Grant 6 months of Pro access to ${userEmail}?`)) {
      return;
    }

    setGrantingUserId(userId);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.post('/api/admin/grant-complimentary', {
        email: userEmail,
        tier: 'advanced',
        durationMonths: 6,
        reason: 'Admin granted 6-month Pro access'
      });

      if (response.data?.success) {
        setSuccessMessage(`Successfully granted 6 months of Pro access to ${userEmail}`);
        // Reload users to show updated subscription
        await loadUsers();
      } else {
        setError(response.data?.message || 'Failed to grant subscription');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to grant subscription';
      setError(errorMessage);
    } finally {
      setGrantingUserId(null);
    }
  };

  const canGrantProAccess = (user: UserData): { canGrant: boolean; reason: string } => {
    // Staff inherently have full Pro access
    if (user.role === 'staff') {
      return { canGrant: false, reason: 'Staff have full Pro access' };
    }

    // Check if user has paid subscription
    if (user.stripeSubscriptionId) {
      return { canGrant: false, reason: 'Has paid subscription' };
    }

    // Check if already has active Pro access
    if (user.subscriptionTier === 'advanced' && user.currentPeriodEnd) {
      const expiryDate = new Date(user.currentPeriodEnd);
      if (expiryDate > new Date()) {
        return { canGrant: false, reason: 'Already has Pro access' };
      }
    }

    return { canGrant: true, reason: '' };
  };

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Header Banner */}
      <div className="py-8 px-4" style={{backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-red-100">Platform analytics and management</p>
        </div>
      </div>

      <div className="grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'patterns', label: 'Patterns' },
              { id: 'feedback', label: 'Feedback' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof activeTab)}
                className={`${
                  activeTab === tab.id
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={overview.totalUsers} />
            <StatCard title="Active Subscribers" value={overview.activeSubscribers} />
            <StatCard title="Total Patterns" value={overview.totalPatterns} />
            <StatCard title="Generations This Month" value={overview.totalGenerationsThisMonth} />
            <StatCard title="Downloads This Month" value={overview.totalDownloadsThisMonth} />
            <StatCard title="Total Feedback" value={overview.totalFeedback} />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const { canGrant, reason } = canGrantProAccess(user);
                  return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'staff' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.subscriptionTier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.generationsThisMonth}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.downloadsThisMonth}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastLogIn ? new Date(user.lastLogIn).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {canGrant ? (
                        <button
                          onClick={() => handleGrantProSubscription(user.email, user.id)}
                          disabled={grantingUserId === user.id}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {grantingUserId === user.id ? 'Granting...' : 'Grant 6mo Pro'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500 italic">{reason}</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pattern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patterns.map((pattern) => (
                  <tr key={pattern.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pattern.patternData?.patternName || pattern.patternData?.patternId || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pattern.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pattern.user.subscriptionTier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pattern.downloaded ? '✓' : '✗'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pattern.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedback.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.author?.email || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.votesCount} ({item.votes.length} total)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{value.toLocaleString()}</dd>
      </div>
    </div>
  );
}
