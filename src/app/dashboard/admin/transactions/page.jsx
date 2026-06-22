'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Search, DollarSign, TrendingUp, Download } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '@/components/ui/Table';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { adminService } from '@/services/adminService';
import { formatCurrency, formatDate, formatDateTime, getErrorMessage } from '@/lib/utils';

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [stats, setStats] = useState({ total: 0, monthly: 0, count: 0 });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTransactions({
        page: searchParams.get('page') || 1,
        limit: 10,
        search: searchParams.get('search') || '',
      });
      setTransactions(res.data || []);
      setPagination(res.pagination || { current: 1, total: 1 });
      if (res.stats) setStats(res.stats);
    } catch {   }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [searchParams]);

  const updateUrl = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`/dashboard/admin/transactions?${params.toString()}`);
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' },
  ];

  const currentStatusFilter = searchParams.get('status') || '';

  return (
    <div>
      <PageHeader title="Transactions" description="View all payment transactions on the platform." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard index={0} icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.total || 0)} color="success" />
        <StatsCard index={1} icon={TrendingUp} label="This Month" value={formatCurrency(stats.monthly || 0)} color="primary" trend={10} />
        <StatsCard index={2} icon={CreditCard} label="Total Transactions" value={stats.count || transactions.length} color="secondary" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') updateUrl({ search, page: '' }); }}
            placeholder="Search by user or transaction ID..."
            className="input-base pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => updateUrl({ search, page: '' })}>Search</Button>
          {currentStatusFilter && (
            <Button variant="outline" onClick={() => updateUrl({ status: '', page: '' })}>
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateUrl({ status: tab.value, page: '' })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              currentStatusFilter === tab.value
                ? 'bg-primary text-on-primary'
                : 'bg-surface-card text-mute hover:bg-secondary-bg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <FullPageSpinner />
      ) : transactions.length === 0 ? (
        <div className="card-base">
          <EmptyState icon={CreditCard} title="No transactions found" description="No transactions match your filters." />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn._id}>
                  <TableCell>
                    <span className="font-mono text-xs text-mute">{txn.transactionId || txn.stripeSessionId || txn._id?.slice(-8)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar src={txn.user?.image} name={txn.user?.name} size="xs" />
                      <div>
                        <p className="text-sm font-medium text-ink">{txn.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-mute">{txn.user?.email || ''}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" size="sm">{txn.plan || 'Premium'}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-ink">
                    {formatCurrency(txn.amount || 0)}
                  </TableCell>
                  <TableCell className="text-mute">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {txn.paymentMethod || 'Stripe'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={txn.status === 'completed' ? 'success' : txn.status === 'failed' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-mute">{formatDateTime(txn.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.total}
              onPageChange={(p) => updateUrl({ page: p })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminTransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<FullPageSpinner />}>
        <TransactionsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
