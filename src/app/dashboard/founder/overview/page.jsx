'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { LineChartCard } from '@/components/dashboard/AnalyticsChart';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Table';
import { opportunityService } from '@/services/opportunityService';
import { applicationService } from '@/services/applicationService';
import { formatDate, getErrorMessage } from '@/lib/utils';

function Overview() {
  const [stats, setStats] = useState({ opportunities: 0, applications: 0, accepted: 0, pending: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [opps, apps] = await Promise.all([
          opportunityService.getMyOpportunities(),
          applicationService.getMyApplications(),
        ]);
        const oppList = opps.data || [];
        const appList = apps.data || [];
        setStats({
          opportunities: oppList.length,
          applications: appList.length,
          accepted: appList.filter((a) => a.status === 'accepted').length,
          pending: appList.filter((a) => a.status === 'pending').length,
        });
        setRecent(appList.slice(0, 5));
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const chartData = [
    { name: 'Mon', applications: 4 },
    { name: 'Tue', applications: 7 },
    { name: 'Wed', applications: 5 },
    { name: 'Thu', applications: 9 },
    { name: 'Fri', applications: 11 },
    { name: 'Sat', applications: 6 },
    { name: 'Sun', applications: 3 },
  ];

  return (
    <div>
      <PageHeader title="Overview" description="Welcome back! Here's what's happening with your startup.">
        <Button href="/dashboard/founder/opportunities/create" leftIcon={Plus}>New Opportunity</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard index={0} icon={Briefcase} label="Opportunities Posted" value={stats.opportunities} color="primary" />
        <StatsCard index={1} icon={FileText} label="Applications Received" value={stats.applications} color="secondary" />
        <StatsCard index={2} icon={CheckCircle2} label="Accepted Members" value={stats.accepted} color="success" />
        <StatsCard index={3} icon={Clock} label="Pending Reviews" value={stats.pending} color="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="card-base p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-ink">Applications Over Time</h3>
          <LineChartCard data={chartData} xKey="name" yKey="applications" />
        </div>

        <div className="card-base p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Recent Applications</h3>
            <Link href="/dashboard/founder/applications" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={FileText} title="No applications yet" description="Applications will appear here." />
          ) : (
            <ul className="space-y-3">
              {recent.map((app) => (
                <li key={app._id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{app.applicant_email}</p>
                    <p className="text-xs text-mute">{formatDate(app.applied_at || app.createdAt)}</p>
                  </div>
                  <Badge variant={app.status} size="sm">{app.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FounderOverviewPage() {
  return <ProtectedRoute allowedRoles={['founder']}><Overview /></ProtectedRoute>;
}
