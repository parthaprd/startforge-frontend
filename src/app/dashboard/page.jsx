'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardRoute } from '@/constants/routes';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) router.replace(getDashboardRoute(user.role));
      else router.replace('/login');
    }
  }, [user, loading, router]);

  return <FullPageSpinner label="Loading your dashboard..." />;
}
