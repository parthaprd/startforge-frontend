'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function DashboardLayout({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // While auth state is being resolved (e.g. on page refresh), show the
  // spinner and DO NOT redirect. Redirecting here while loading would boot
  // an authenticated user to /login because `user` is still null.
  if (loading) return <FullPageSpinner label="Loading dashboard..." />;

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return <FullPageSpinner label="Redirecting..." />;
  }

  return (
    <div className="flex min-h-screen bg-surface-soft">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-canvas px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-mute hover:bg-surface-card transition-colors" aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
