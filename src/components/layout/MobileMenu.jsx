'use client';

import Link from 'next/link';
import { X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardRoute } from '@/constants/routes';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Logo from './Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/startups', label: 'Startups' },
  { href: '/opportunities', label: 'Opportunities' },
];

export default function MobileMenu({ open, onClose, user, onLogout }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-canvas shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-hairline p-4">
              <Logo />
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-ink hover:bg-surface-card"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User section */}
            {user ? (
              <div className="border-b border-hairline p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={user.image} name={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-mute">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge variant="primary" size="sm" className="mt-2">
                  {user.role}
                </Badge>
              </div>
            ) : null}

            {/* Nav links */}
            <nav className="p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-card"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="border-t border-hairline p-4">
              {user ? (
                <div className="space-y-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-card"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href={getDashboardRoute(user.role)}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-card"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-error hover:bg-surface-card"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="tertiary" fullWidth href="/login" onClick={onClose}>
                    Log in
                  </Button>
                  <Button variant="primary" fullWidth href="/register" onClick={onClose} className="rounded-full">
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
