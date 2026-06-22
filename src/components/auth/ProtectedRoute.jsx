'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardRoute } from '@/constants/routes';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.replace(getDashboardRoute(user.role));
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return <FullPageSpinner label="Authenticating..." />;
  }

  if (!user) {
    return <FullPageSpinner label="Redirecting to login..." />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50">
          <ShieldAlert className="h-8 w-8 text-danger-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="max-w-sm text-sm text-gray-500">
          You do not have permission to view this page.
        </p>
        <Button href={getDashboardRoute(user.role)}>Go to your dashboard</Button>
      </div>
    );
  }

  return children;
}
