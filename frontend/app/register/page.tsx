'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate legal acceptance
    if (!acceptTerms) {
      setError('You must accept the Terms of Service to continue');
      return;
    }
    if (!acceptPrivacy) {
      setError('You must accept the Privacy Policy to continue');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name, acceptTerms, acceptPrivacy);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-2xl" style={{backgroundColor: '#FFF', borderTop: '8px solid #2C7A7B'}}>
        <div>
          <h2 className="text-center text-3xl font-extrabold" style={{color: '#B91C1C'}}>
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

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
                Password (min 8 characters)
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

          <div className="space-y-3 pt-2">
            <div className="flex items-start">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-2"
                style={{accentColor: '#2C7A7B'}}
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                I accept the{' '}
                <Link href="/legal/terms-of-service" target="_blank" className="font-medium hover:underline" style={{color: '#2C7A7B'}}>
                  Terms of Service
                </Link>
                {' '}*
              </label>
            </div>
            <div className="flex items-start">
              <input
                id="acceptPrivacy"
                name="acceptPrivacy"
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-2"
                style={{accentColor: '#2C7A7B'}}
              />
              <label htmlFor="acceptPrivacy" className="ml-2 block text-sm text-gray-700">
                I accept the{' '}
                <Link href="/legal/privacy-policy" target="_blank" className="font-medium hover:underline" style={{color: '#2C7A7B'}}>
                  Privacy Policy
                </Link>
                {' '}*
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !acceptTerms || !acceptPrivacy}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{backgroundColor: '#B91C1C'}}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#991B1B')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#B91C1C')}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="hover:underline" style={{color: '#2C7A7B'}}>
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}