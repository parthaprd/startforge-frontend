'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { getToken, setToken, removeToken } from '@/lib/auth';

const AuthContext = createContext(null);

function extractUser(response) {
  if (!response) return null;

  const body = response.data && typeof response.data === 'object' ? response.data : response;

  return (
    body?.data?.user ||
    body?.data?.data?.user ||
    body?.user ||
    body?.data?.user ||
    null
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await authService.getMe();
      const userData = extractUser(response);
      if (userData) {
        setUser(userData);
      } else {

        setUser(null);
        removeToken();
      }
    } catch (error) {
      setUser(null);
      removeToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const body = response.data && typeof response.data === 'object' ? response.data : response;
    const token = body?.token || body?.data?.token;
    const userData = extractUser(response);
    if (token) setToken(token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {

    } finally {
      setUser(null);
      removeToken();
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => (typeof updatedUser === 'function' ? updatedUser(prev) : updatedUser));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      const userData = extractUser(response);
      if (userData) setUser(userData);
      return userData;
    } catch (error) {
      return null;
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
