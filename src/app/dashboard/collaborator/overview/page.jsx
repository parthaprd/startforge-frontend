'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, Search } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Table';
import { applicationService } from '@/services/applicationService';
import { formatDate } from '@/lib/utils';

function Overview() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await applicationService.getMyApplications();
        setApps(res.data || []);
      } catch {   }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="py-20 text-center text-mute">Loading...</div>;

  const pending = apps.filter((a) => a.status === 'pending').length;
  const accepted = apps.filter((a) => a.status === 'accepted').length;
  const rejected = apps.filter((a) => a.status === 'rejected').length;

  return (
    <div>
      <PageHeader title="Overview" description="Track your applications and find new opportunities.">
        <Button href="/dashboard/collaborator/browse" leftIcon={Search}>Browse Opportunities</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard index={0} icon={FileText} label="Total Applications" value={apps.length} color="primary" />
        <StatsCard index={1} icon={Clock} label="Pending" value={pending} color="warning" />
        <StatsCard index={2} icon={CheckCircle2} label="Accepted" value={accepted} color="success" />
        <StatsCard index={3} icon={XCircle} label="Rejected" value={rejected} color="danger" />
      </div>

      <div className="mt-6 card-base p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-ink">Recent Applications</h3>
          <Link href="/dashboard/collaborator/applications" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        {apps.length === 0 ? (
          <EmptyState icon={FileText} title="No applications yet" description="Browse opportunities and apply to start your journey." action={<Button href="/dashboard/collaborator/browse" rightIcon={ArrowRight}>Browse Opportunities</Button>} />
        ) : (
          <ul className="divide-y divide-hairline-soft">
            {apps.slice(0, 5).map((app) => {
              const opp = app.opportunity_id;
              return (
                <li key={app._id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{typeof opp === 'object' ? opp?.role_title : 'Opportunity'}</p>
                    <p className="text-xs text-mute">Applied {formatDate(app.applied_at || app.createdAt)}</p>
                  </div>
                  <Badge variant={app.status} size="sm">{app.status}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function CollaboratorOverviewPage() {
  return <ProtectedRoute allowedRoles={['collaborator']}><Overview /></ProtectedRoute>;
}
