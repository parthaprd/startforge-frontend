'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, LayoutDashboard, ChevronDown, Menu, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getDashboardRoute } from '@/constants/routes';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/startups', label: 'Startups' },
  { href: '/opportunities', label: 'Opportunities' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      const target = pathname.startsWith('/opportunities') ? 'opportunities' : 'startups';
      router.push(`/${target}?search=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-canvas/95 backdrop-blur-md transition-all duration-200",
      pathname === '/' ? "border-b border-transparent" : "border-b border-hairline"
    )}>
      <nav className="container-custom flex h-16 items-center justify-between gap-4">
        {/* Left: Logo + desktop nav */}
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden items-center gap-1.5 md:flex font-semibold text-sm">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-full px-4 py-2 transition-colors',
                    isActive
                      ? 'text-white bg-ink'
                      : 'text-ink hover:bg-surface-card'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Centered Search Bar */}
        <form onSubmit={handleNavSearchSubmit} className="hidden flex-1 max-w-lg mx-4 md:block relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-mute" />
          </span>
          <input
            type="text"
            placeholder="Search for startups, roles..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 text-sm text-ink placeholder-ash bg-surface-card hover:bg-hairline-soft focus:bg-canvas border border-transparent focus:border-ash rounded-full outline-none transition-all duration-150 focus:ring-2 focus:ring-focus-outer focus:ring-offset-2"
          />
        </form>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="h-9 w-16 animate-pulse rounded-full bg-hairline" />
              <div className="h-9 w-20 animate-pulse rounded-full bg-hairline" />
            </div>
          ) : user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-hairline py-1.5 pl-1.5 pr-3 transition-colors hover:bg-surface-card"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <Avatar
                  src={user.image}
                  name={user.name}
                  size="sm"
                />
                <span className="text-sm font-semibold text-ink max-w-[120px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-mute" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-hairline bg-canvas shadow-lg"
                  >
                    <div className="border-b border-hairline p-4">
                      <p className="text-sm font-semibold text-ink truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-mute truncate">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <Badge variant="primary" size="sm">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-1">
                      <DropdownLink
                        href="/dashboard/profile"
                        icon={User}
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </DropdownLink>
                      <DropdownLink
                        href={getDashboardRoute(user.role)}
                        icon={LayoutDashboard}
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </DropdownLink>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-error hover:bg-surface-card transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="tertiary" size="sm" href="/login">
                Log in
              </Button>
              <Button variant="primary" size="sm" href="/register" className="rounded-full px-4">
                Sign up
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink hover:bg-surface-card md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
}

function DropdownLink({ href, icon: Icon, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-card transition-colors"
    >
      <Icon className="h-4 w-4 text-ash" />
      {children}
    </Link>
  );
}
