"use client";

import { createContext, useContext, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, error, isPending, refetch } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Session is automatically managed by better-auth
    }
  }, [session]);

  const user = session?.user || null;
  const loading = isPending;

  const handleLogout = async () => {
    try {
      // Clear JWT token first
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      // Then sign out from better-auth
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (updatedUser) => {
    // For optimistic updates - better-auth handles session updates
    // This is for local UI state updates only
  };

  const refreshUser = async () => {
    const result = await refetch();
    return result?.data?.user || null;
  };

  const value = {
    user,
    loading,
    login: null,
    logout: handleLogout,
    updateUser,
    refreshUser,
    checkAuth: refetch,
    isAuthenticated: !!user,
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
