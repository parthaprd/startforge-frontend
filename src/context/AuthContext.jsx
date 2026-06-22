'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { getToken, setToken, removeToken } from '@/lib/auth';

const AuthContext = createContext(null);

/**
 * The axios response interceptor (src/lib/api.js) already unwraps one layer
 * (it returns `response.data`). Different endpoints return the user at
 * different nesting levels, so this helper normalises all known shapes:
 *   { user }            | { data: { user } } | { data: { data: { user } } }
 * into a single user object (or null).
 */
function extractUser(response) {
  if (!response) return null;
  // After interceptor unwrap, `response` is the JSON body itself.
  const body = response.data && typeof response.data === 'object' ? response.data : response;
  // Check the common nesting shapes, deepest first.
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
        // No usable user object — treat as unauthenticated so callers redirect
        // to /login rather than falling through to the home route.
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
      // Even if the API call fails, clear local state
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
