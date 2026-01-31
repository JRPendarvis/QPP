'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  else if (password.length < 8) feedback.push('At least 8 characters');

  // Complexity checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Special characters (!@#$%^&*)');

  // Determine strength
  let strength: PasswordStrength;
  let color: string;
  let bgColor: string;

  if (score <= 2) {
    strength = 'weak';
    color = '#DC2626'; // red
    bgColor = '#FEE2E2';
  } else if (score <= 4) {
    strength = 'fair';
    color = '#F59E0B'; // orange
    bgColor = '#FEF3C7';
  } else if (score <= 6) {
    strength = 'good';
    color = '#10B981'; // green
    bgColor = '#D1FAE5';
  } else {
    strength = 'strong';
    color = '#059669'; // dark green
    bgColor = '#A7F3D0';
  }

  return { strength, score, feedback, color, bgColor };
}

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const passwordStrength = useMemo(() => 
    password ? calculatePasswordStrength(password) : null,
    [password]
  );

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