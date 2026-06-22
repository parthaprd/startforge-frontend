'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FileText, Eye, Trash2, ExternalLink } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '@/components/ui/Table';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { applicationService } from '@/services/applicationService';
import { formatDate, getErrorMessage } from '@/lib/utils';

function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewApp, setViewApp] = useState(null);
  const [withdrawId, setWithdrawId] = useState(null);

  const fetch = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setApps(res.data || []);
    } catch {   }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleWithdraw = async () => {
    try {
      await applicationService.withdraw(withdrawId);
      setApps(apps.filter((a) => a._id !== withdrawId));
      toast.success('Application withdrawn');
      setWithdrawId(null);
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to withdraw')); }
  };

  if (loading) return <FullPageSpinner />;

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div>
      <PageHeader title="My Applications" description="Track the status of your applications." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={[{ value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'accepted', label: 'Accepted' }, { value: 'rejected', label: 'Rejected' }]} active={filter} onChange={setFilter} />
        <span className="text-sm text-mute">{filtered.length} applications</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card-base">
          <EmptyState icon={FileText} title="No applications found" description="Browse opportunities and apply to get started." action={<Button href="/dashboard/collaborator/browse">Browse Opportunities</Button>} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Startup</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((app) => {
              const opp = app.opportunity_id;
              return (
                <TableRow key={app._id}>
                  <TableCell>
                    {typeof opp === 'object' && opp?._id ? (
                      <Link href={`/opportunities/${opp._id}`} className="font-medium text-ink hover:text-primary">{opp.role_title}</Link>
                    ) : <span className="text-mute">Opportunity</span>}
                  </TableCell>
                  <TableCell className="text-ink-soft">{typeof opp === 'object' ? opp?.startup_id?.startup_name || '—' : '—'}</TableCell>
                  <TableCell className="text-mute">{formatDate(app.applied_at || app.createdAt)}</TableCell>
                  <TableCell><Badge variant={app.status} size="sm">{app.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewApp(app)} className="rounded-lg p-2 text-mute hover:bg-surface-card" title="View"><Eye className="h-4 w-4" /></button>
                      {app.status === 'pending' && (
                        <button onClick={() => setWithdrawId(app._id)} className="rounded-lg p-2 text-danger-500 hover:bg-danger-50" title="Withdraw"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={!!viewApp} onClose={() => setViewApp(null)} title="Application Details" size="md">
        {viewApp && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink">{viewApp.opportunity_id?.role_title || 'Opportunity'}</p>
              <Badge variant={viewApp.status} size="md">{viewApp.status}</Badge>
            </div>
            {viewApp.portfolio_link && (
              <div>
                <p className="text-xs text-mute">Portfolio</p>
                <a href={viewApp.portfolio_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline break-all">{viewApp.portfolio_link} <ExternalLink className="h-3 w-3" /></a>
              </div>
            )}
            <div>
              <p className="text-xs text-mute">Motivation</p>
              <p className="mt-1 whitespace-pre-wrap text-ink-soft">{viewApp.motivation}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!withdrawId} onClose={() => setWithdrawId(null)} onConfirm={handleWithdraw} title="Withdraw Application?" message="You cannot undo this action. You'll need to re-apply if you change your mind." confirmLabel="Withdraw" />
    </div>
  );
}

export default function CollaboratorApplicationsPage() {
  return <ProtectedRoute allowedRoles={['collaborator']}><MyApplications /></ProtectedRoute>;
}
