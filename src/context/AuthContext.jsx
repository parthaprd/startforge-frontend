"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track whether the user has been explicitly set (e.g. right after login)
  // to prevent the initial getSession from overwriting it.
  const userJustSet = useRef(false);

  // Attempt to restore the session from the cookie on mount / page navigation.
  const checkAuth = useCallback(async () => {
    try {
      const response = await authService.getSession();
      // Better Auth returns { user, session } on success
      if (response && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthContext] Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If the user was just set from login, skip the getSession call
    // that would race and potentially clear the user.
    if (userJustSet.current) {
      userJustSet.current = false;
      return;
    }
    checkAuth();
  }, [checkAuth]);

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

  // Called from login page after successful signIn.
  // Sets the user immediately and prevents the initial getSession race.
  const setUserWithFlag = (userData) => {
    setUser(userData);
    userJustSet.current = true;
    setLoading(false);
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getSession();
      if (response && response.user) {
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
    setUser: setUserWithFlag,
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
