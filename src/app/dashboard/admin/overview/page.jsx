'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Briefcase, DollarSign } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { LineChartCard, BarChartCard, PieChartCard } from '@/components/dashboard/AnalyticsChart';
import { adminService } from '@/services/adminService';
import { formatCurrency, formatNumber } from '@/lib/utils';

const EMPTY_STATS = { users: 0, startups: 0, opportunities: 0, revenue: 0 };
const EMPTY_TRENDS = { users: undefined, startups: undefined, opportunities: undefined, revenue: undefined };

function Overview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await adminService.getAnalytics();
        if (active) setAnalytics(res);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="py-20 text-center text-mute">Loading...</div>;

  const a = analytics?.data ?? analytics ?? {};

  const stats = {
    users: a.users ?? a.totalUsers ?? a.userCount ?? EMPTY_STATS.users,
    startups: a.startups ?? a.totalStartups ?? a.startupCount ?? EMPTY_STATS.startups,
    opportunities: a.opportunities ?? a.totalOpportunities ?? a.opportunityCount ?? EMPTY_STATS.opportunities,
    revenue: a.revenue ?? a.totalRevenue ?? a.revenueTotal ?? EMPTY_STATS.revenue,
  };

  const trends = {
    users: a.trends?.users ?? a.userGrowthRate,
    startups: a.trends?.startups ?? a.startupGrowthRate,
    opportunities: a.trends?.opportunities ?? a.opportunityGrowthRate,
    revenue: a.trends?.revenue ?? a.revenueGrowthRate,
  };

  const userGrowth = Array.isArray(a.userGrowth) ? a.userGrowth : a.usersOverTime;
  const revenueData = Array.isArray(a.revenueData) ? a.revenueData : a.revenueOverTime;
  const industryData = Array.isArray(a.industryData) ? a.industryData : a.startupsByIndustry;

  return (
    <div>
      <PageHeader title="Admin Overview" description="Platform-wide analytics and insights." />

      {error && (
        <div className="mb-6 rounded-md border border-[#ffe5e0] bg-[#fff5f5] px-4 py-3 text-sm text-error">
          Couldn’t load analytics right now. Showing the latest available data.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          index={0}
          icon={Users}
          label="Total Users"
          value={formatNumber(stats.users)}
          color="primary"
          trend={trends.users}
        />
        <StatsCard
          index={1}
          icon={Building2}
          label="Total Startups"
          value={formatNumber(stats.startups)}
          color="secondary"
          trend={trends.startups}
        />
        <StatsCard
          index={2}
          icon={Briefcase}
          label="Opportunities"
          value={formatNumber(stats.opportunities)}
          color="success"
          trend={trends.opportunities}
        />
        <StatsCard
          index={3}
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats.revenue)}
          color="warning"
          trend={trends.revenue}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-base p-6">
          <h3 className="mb-4 font-semibold text-ink">User Growth</h3>
          {userGrowth?.length ? (
            <LineChartCard data={userGrowth} xKey={pickNameKey(userGrowth)} yKey={pickValueKey(userGrowth, 'users')} />
          ) : (
            <ChartEmptyState />
          )}
        </div>
        <div className="card-base p-6">
          <h3 className="mb-4 font-semibold text-ink">Revenue</h3>
          {revenueData?.length ? (
            <BarChartCard data={revenueData} xKey={pickNameKey(revenueData)} yKey={pickValueKey(revenueData, 'revenue')} />
          ) : (
            <ChartEmptyState />
          )}
        </div>
      </div>

      <div className="mt-6 card-base p-6">
        <h3 className="mb-4 font-semibold text-ink">Startups by Industry</h3>
        {industryData?.length ? (
          <PieChartCard data={industryData} nameKey={pickNameKey(industryData)} valueKey={pickValueKey(industryData, 'value')} />
        ) : (
          <ChartEmptyState />
        )}
      </div>
    </div>
  );
}

function pickNameKey(data) {
  if (!data?.length) return 'name';
  const first = data[0];
  for (const k of ['name', 'label', 'month', 'industry', 'category', 'date', '_id']) {
    if (first[k] !== undefined) return k;
  }
  return 'name';
}

function pickValueKey(data, hint) {
  if (!data?.length) return hint;
  const first = data[0];
  if (first[hint] !== undefined) return hint;

  const nameKey = pickNameKey(data);
  const numeric = Object.keys(first).find((k) => k !== nameKey && typeof first[k] === 'number');
  return numeric || hint;
}

function ChartEmptyState() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-mute">
      No data available yet.
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Overview />
    </ProtectedRoute>
  );
}
