'use client';

import { AuthProvider } from '@/context/AuthContext';
import ToastProvider from '@/context/ToastContext';

// Combines all client-side context providers needed app-wide.
export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
