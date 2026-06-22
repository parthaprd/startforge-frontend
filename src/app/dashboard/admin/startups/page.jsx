'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, Search, CheckCircle2, XCircle, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '@/components/ui/Table';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { adminService } from '@/services/adminService';
import { formatDate, getErrorMessage } from '@/lib/utils';

function StartupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [updating, setUpdating] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStartups({
        page: searchParams.get('page') || 1,
        limit: 10,
        search: searchParams.get('search') || '',
        status: searchParams.get('status') || '',
      });
      setStartups(res.data || []);
      setPagination(res.pagination || { current: 1, total: 1 });
    } catch {   }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [searchParams]);

  const updateUrl = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`/dashboard/admin/startups?${params.toString()}`);
  };

  const handleApprove = async (id) => {
    setUpdating(id);
    try {
      await adminService.approveStartup(id);
      toast.success('Startup approved');
      setStartups(startups.map((s) => s._id === id ? { ...s, status: 'approved' } : s));
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try {
      await adminService.rejectStartup(id);
      toast.success('Startup rejected');
      setStartups(startups.map((s) => s._id === id ? { ...s, status: 'rejected' } : s));
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    setUpdating(deleteDialog._id);
    try {
      await adminService.deleteStartup(deleteDialog._id);
      toast.success('Startup deleted');
      setStartups(startups.filter((s) => s._id !== deleteDialog._id));
      setDeleteDialog(null);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  return (
    <div>
      <PageHeader title="Manage Startups" description="Review and manage all startup listings." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') updateUrl({ search, page: '' }); }}
            placeholder="Search startups..."
            className="input-base pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => updateUrl({ search, page: '' })}>Search</Button>
          {statusFilter && (
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
              statusFilter === tab.value
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
      ) : startups.length === 0 ? (
        <div className="card-base">
          <EmptyState icon={Building2} title="No startups found" description="No startups match your filters." />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup</TableHead>
                <TableHead>Founder</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {startups.map((startup) => (
                <TableRow key={startup._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={startup.logo} name={startup.startup_name} size="sm" />
                      <div>
                        <p className="font-medium text-ink">{startup.startup_name}</p>
                        <p className="text-xs text-mute line-clamp-1 max-w-[200px]">{startup.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {startup.founder?.image && (
                        <Avatar src={startup.founder.image} name={startup.founder.name} size="xs" />
                      )}
                      <span className="text-sm text-ink-soft">{startup.founder?.name || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" size="sm">{startup.industry}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={startup.status === 'approved' ? 'success' : startup.status === 'rejected' ? 'danger' : 'warning'} size="sm">
                      {startup.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-mute">{formatDate(startup.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/startups/${startup._id}`}>
                        <Button size="icon" variant="ghost" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {startup.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            loading={updating === startup._id}
                            onClick={() => handleApprove(startup._id)}
                            leftIcon={CheckCircle2}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={updating === startup._id}
                            onClick={() => handleReject(startup._id)}
                            leftIcon={XCircle}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeleteDialog(startup)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
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

      <ConfirmDialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={handleDelete}
        title="Delete Startup"
        message={`Are you sure you want to delete "${deleteDialog?.startup_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={updating === deleteDialog?._id}
      />
    </div>
  );
}

export default function AdminStartupsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<FullPageSpinner />}>
        <StartupsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
