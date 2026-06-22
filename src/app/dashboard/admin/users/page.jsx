'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Users, Search, Ban, CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import Tabs from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '@/components/ui/Table';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { adminService } from '@/services/adminService';
import { formatDate, getErrorMessage } from '@/lib/utils';

function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [updating, setUpdating] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        page: searchParams.get('page') || 1,
        limit: 10,
        search: searchParams.get('search') || '',
      });
      setUsers(res.data || []);
      setPagination(res.pagination || { current: 1, total: 1 });
    } catch {   }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [searchParams]);

  const updateUrl = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`/dashboard/admin/users?${params.toString()}`);
  };

  const toggleBlock = async (user) => {
    setUpdating(user._id);
    try {
      if (user.isBlocked) { await adminService.unblockUser(user._id); toast.success('User unblocked'); }
      else { await adminService.blockUser(user._id); toast.success('User blocked'); }
      setUsers(users.map((u) => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  return (
    <div>
      <PageHeader title="Manage Users" description="View and manage all platform users." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') updateUrl({ search, page: '' }); }} placeholder="Search by name or email..." className="input-base pl-10" />
        </div>
        <Button onClick={() => updateUrl({ search, page: '' })}>Search</Button>
      </div>

      {loading ? <FullPageSpinner /> : users.length === 0 ? (
        <div className="card-base"><EmptyState icon={Users} title="No users found" /></div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={user.image} name={user.name} size="sm" />
                      <div>
                        <p className="font-medium text-ink">{user.name}</p>
                        <p className="text-xs text-mute">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" size="sm">{user.role}</Badge></TableCell>
                  <TableCell><Badge variant={user.isBlocked ? 'danger' : 'success'} size="sm">{user.isBlocked ? 'Blocked' : 'Active'}</Badge></TableCell>
                  <TableCell className="text-mute">{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant={user.isBlocked ? 'success' : 'danger'} loading={updating === user._id} onClick={() => toggleBlock(user)} leftIcon={user.isBlocked ? CheckCircle2 : Ban}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6"><Pagination currentPage={pagination.current} totalPages={pagination.total} onPageChange={(p) => updateUrl({ page: p })} /></div>
        </>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<FullPageSpinner />}>
        <UsersContent />
      </Suspense>
    </ProtectedRoute>
  );
}
