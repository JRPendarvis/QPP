'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
  setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-2xl" style={{backgroundColor: '#FFF', borderTop: '8px solid #B91C1C'}}>
        <div>
          <div className="text-center mb-6 py-4 px-6 rounded-lg" style={{backgroundColor: '#2C7A7B'}}>
            <h2 className="text-3xl font-extrabold text-white">
              Sign in to Quilt Planner Pro
            </h2>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 rounded" style={{backgroundColor: '#FEE2E2', borderColor: '#E76F51', borderWidth: '1px', color: '#DC2626'}}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm hover:underline" style={{color: '#F59E0B'}}>
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{backgroundColor: '#B91C1C'}}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#991B1B')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#B91C1C')}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/register" className="hover:underline" style={{color: '#2C7A7B'}}>
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}