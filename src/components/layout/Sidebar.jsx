'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  FileText,
  Crown,
  User,
  Search,
  Users,
  Receipt,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const navByRole = {
  founder: [
    { href: '/dashboard/founder/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/founder/my-startup', label: 'My Startup', icon: Building2 },
    { href: '/dashboard/founder/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/dashboard/founder/applications', label: 'Applications', icon: FileText },
    { href: '/dashboard/founder/upgrade', label: 'Upgrade', icon: Crown },
  ],
  collaborator: [
    { href: '/dashboard/collaborator/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/collaborator/browse', label: 'Browse', icon: Search },
    { href: '/dashboard/collaborator/applications', label: 'My Applications', icon: FileText },
  ],
  admin: [
    { href: '/dashboard/admin/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/startups', label: 'Startups', icon: Building2 },
    { href: '/dashboard/admin/transactions', label: 'Transactions', icon: Receipt },
  ],
};

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const navItems = loading ? [] : navByRole[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-canvas">

      <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
        <button
          onClick={onCloseMobile}
          className="rounded-md p-1.5 text-mute hover:bg-surface-card hover:text-ink lg:hidden transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-hairline p-5">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-hairline" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-28 animate-pulse rounded bg-hairline" />
              <div className="h-4 w-16 animate-pulse rounded-full bg-hairline" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar src={user?.image} name={user?.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.name}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <Badge variant="primary" size="sm">
                  <ShieldCheck className="h-3 w-3" />
                  {user?.role}
                </Badge>
                {user?.isPremium && (
                  <Badge variant="premium" size="sm">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-ash">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-all border-l-2',
                isActive
                  ? 'bg-surface-card text-ink border-primary'
                  : 'text-mute hover:bg-surface-soft hover:text-ink border-transparent'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 transition-colors flex-shrink-0',
                  isActive ? 'text-primary' : 'text-ash group-hover:text-mute'
                )}
              />
              {item.label}
              {item.label === 'Upgrade' && !user?.isPremium && (
                <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                  NEW
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-hairline" />

        <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-ash">
          Account
        </p>
        <Link
          href="/dashboard/profile"
          onClick={onCloseMobile}
          className={cn(
            'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-all border-l-2',
            pathname === '/dashboard/profile'
              ? 'bg-surface-card text-ink border-primary'
              : 'text-mute hover:bg-surface-soft hover:text-ink border-transparent'
          )}
        >
          <User
            className={cn(
              'h-4 w-4 flex-shrink-0',
              pathname === '/dashboard/profile' ? 'text-primary' : 'text-ash group-hover:text-mute'
            )}
          />
          Profile
        </Link>
      </nav>

      <div className="border-t border-hairline p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-surface-card"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>

      <aside className="hidden w-64 flex-shrink-0 border-r border-hairline bg-canvas lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute left-0 top-0 h-full w-72 bg-canvas shadow-modal"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
