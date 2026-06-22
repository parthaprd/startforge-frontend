'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook that exposes the current authenticated user and helpers
 * built on top of the AuthContext.
 */
export function useUser() {
  const { user, loading, updateUser, refreshUser, logout } = useAuth();

  const isLoggedIn = !!user;
  const isFounder = user?.role === 'founder';
  const isCollaborator = user?.role === 'collaborator';
  const isAdmin = user?.role === 'admin';
  const isPremium = !!user?.isPremium;

  return {
    user,
    loading,
    isLoggedIn,
    isFounder,
    isCollaborator,
    isAdmin,
    isPremium,
    updateUser,
    refreshUser,
    logout,
  };
}

export default useUser;
