'use client';

import { useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  feedback: string[];
  color: string;
  bgColor: string;
}

function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  else if (password.length < 8) feedback.push('At least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Special characters (!@#$%^&*)');

  let strength: PasswordStrength;
  let color: string;
  let bgColor: string;

  if (score <= 2) {
    strength = 'weak';
    color = '#DC2626';
    bgColor = '#FEE2E2';
  } else if (score <= 4) {
    strength = 'fair';
    color = '#F59E0B';
    bgColor = '#FEF3C7';
  } else if (score <= 6) {
    strength = 'good';
    color = '#10B981';
    bgColor = '#D1FAE5';
  } else {
    strength = 'strong';
    color = '#059669';
    bgColor = '#A7F3D0';
  }

  return { strength, score, feedback, color, bgColor };
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(() => 
    password ? calculatePasswordStrength(password) : null,
    [password]
  );

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-600 text-5xl mb-4">✕</div>
          <h2 className="text-2xl font-bold text-gray-900">Invalid reset link</h2>
          <p className="text-gray-600 mt-2">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="inline-block mt-6 text-indigo-600 hover:text-indigo-500">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900">Password reset!</h2>
          <p className="text-gray-600 mt-2">
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            {/* Password Strength Indicator */}
            {password && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                  <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                    {passwordStrength.strength.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength.score / 7) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="mt-2 p-2 rounded text-xs" style={{ backgroundColor: passwordStrength.bgColor }}>
                    <p className="font-medium mb-1" style={{ color: passwordStrength.color }}>
                      Add these to strengthen:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                      {passwordStrength.feedback.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}