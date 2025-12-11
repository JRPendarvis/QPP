'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/user/profile');
        if (isMounted && res.data?.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => { isMounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data?.success && response.data?.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);
        
        // Fetch user profile with the new token
        const profileRes = await api.get('/api/user/profile');
        if (profileRes.data?.success) {
          const userData = profileRes.data.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          router.push('/dashboard');
        }
      } else {
        throw new Error('Login failed - no token received');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await api.post('/api/auth/register', { email, password, name });
      if (response.data?.success && response.data?.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);
        
        // Fetch user profile with the new token
        const profileRes = await api.get('/api/user/profile');
        if (profileRes.data?.success) {
          const userData = profileRes.data.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          router.push('/dashboard');
        }
      } else {
        throw new Error('Registration failed - no token received');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}