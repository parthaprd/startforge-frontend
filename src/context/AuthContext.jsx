"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService, clearToken } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from stored JWT
  const checkAuth = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response && response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSetUser = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  const refreshUser = async () => {
    const response = await authService.getMe();
    if (response?.data) {
      setUser(response.data);
      return response.data;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser: handleSetUser,
        logout: handleLogout,
        updateUser,
        refreshUser,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export default AuthContext;
