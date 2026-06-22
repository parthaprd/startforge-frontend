'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#262622',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '16px',
            padding: '12px 16px',
            fontFamily: '-apple-system, system-ui, Segoe UI, Roboto, sans-serif',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}
