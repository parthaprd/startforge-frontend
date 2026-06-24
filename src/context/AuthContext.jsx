"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Better Auth uses session cookies - no token needed
      const response = await authService.getSession();
      console.log("[AuthContext] getSession response:", response);

      // Handle different response formats from Better Auth
      if (response && response.user) {
        setUser(response.user);
      } else if (response && response.session && response.session.user) {
        setUser(response.session.user);
      } else {
        console.log("[AuthContext] No valid user found in response");
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthContext] Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getSession();
      if (response.session && response.user) {
        setUser(response.user);
        return response.user;
      }
      return null;
    } catch (error) {
      console.error("Refresh user failed:", error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login: null,
    logout: handleLogout,
    updateUser,
    refreshUser,
    checkAuth,
    isAuthenticated: !!user,
    setUser, // Export setUser so login page can manually set user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
