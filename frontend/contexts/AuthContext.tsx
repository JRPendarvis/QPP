'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { AUTH_CONSTANTS, ROUTES } from '@/lib/constants';

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
  register: (email: string, password: string, name?: string, acceptTerms?: boolean, acceptPrivacy?: boolean) => Promise<void>;
  logout: () => void;
}

interface ApiErrorResponse {
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/user/profile');
        if (isMounted && res.data?.success) {
          setUser(res.data.data);
        }
      } catch {
        localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
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
      if (response.data?.success && response.data?.data?.token) {
        localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, response.data.data.token);
        const userData = response.data.data.user;
        setUser(userData);
        router.push(ROUTES.DASHBOARD);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name?: string, acceptTerms?: boolean, acceptPrivacy?: boolean) => {
    try {
      const response = await api.post('/api/auth/register', { 
        email, 
        password, 
        name,
        acceptTerms,
        acceptPrivacy
      });
      if (response.data?.success && response.data?.data?.token) {
        localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, response.data.data.token);
        const userData = response.data.data.user;
        setUser(userData);
        router.push(ROUTES.PROFILE);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    setUser(null);
    router.push(ROUTES.LOGIN);
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