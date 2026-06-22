'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Check, X, Eye } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '@/components/ui/Table';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { opportunityService } from '@/services/opportunityService';
import { applicationService } from '@/services/applicationService';
import { formatDate, getErrorMessage } from '@/lib/utils';

function Applications() {
  const [opps, setOpps] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewApp, setViewApp] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetch = async () => {
    try {
      const [oppsRes, ...appsPromises] = await Promise.all([
        opportunityService.getMyOpportunities(),
      ]);
      const oppList = oppsRes.data || [];
      setOpps(oppList);
      const appsResults = await Promise.all(oppList.map((o) => applicationService.getOpportunityApplications(o._id).catch(() => ({ data: [] }))));
      const all = appsResults.flatMap((r) => r.data || []);
      setApps(all);
    } catch {   }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      await applicationService.updateStatus(appId, status);
      setApps(apps.map((a) => a._id === appId ? { ...a, status } : a));
      toast.success(`Application ${status}`);
      if (viewApp?._id === appId) setViewApp({ ...viewApp, status });
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to update')); }
    finally { setUpdating(null); }
  };

  if (loading) return <FullPageSpinner />;

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div>
      <PageHeader title="Applications" description="Review and manage applications for your opportunities." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          tabs={[{ value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'accepted', label: 'Accepted' }, { value: 'rejected', label: 'Rejected' }]}
          active={filter}
          onChange={setFilter}
        />
        <span className="text-sm text-mute">{filtered.length} applications</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card-base">
          <EmptyState icon={FileText} title="No applications" description="Applications for your opportunities will appear here." />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((app) => {
              const opp = opps.find((o) => o._id === (app.opportunity_id?._id || app.opportunity_id));
              return (
                <TableRow key={app._id}>
                  <TableCell>
                    <p className="font-medium text-ink">{app.applicant_email}</p>
                  </TableCell>
                  <TableCell className="text-ink-soft">{opp?.role_title || '—'}</TableCell>
                  <TableCell className="text-mute">{formatDate(app.applied_at || app.createdAt)}</TableCell>
                  <TableCell><Badge variant={app.status} size="sm">{app.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewApp(app)} className="rounded-lg p-2 text-mute hover:bg-surface-card" title="View"><Eye className="h-4 w-4" /></button>
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(app._id, 'accepted')} disabled={updating === app._id} className="rounded-lg p-2 text-success hover:bg-success-pale" title="Accept"><Check className="h-4 w-4" /></button>
                          <button onClick={() => updateStatus(app._id, 'rejected')} disabled={updating === app._id} className="rounded-lg p-2 text-error hover:bg-danger-50" title="Reject"><X className="h-4 w-4" /></button>
                        </>
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
            <div>
              <p className="text-xs text-mute">Applicant</p>
              <p className="font-medium text-ink">{viewApp.applicant_email}</p>
            </div>
            {viewApp.portfolio_link && (
              <div>
                <p className="text-xs text-mute">Portfolio</p>
                <a href={viewApp.portfolio_link} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{viewApp.portfolio_link}</a>
              </div>
            )}
            <div>
              <p className="text-xs text-mute">Motivation</p>
              <p className="mt-1 whitespace-pre-wrap text-ink-soft">{viewApp.motivation}</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant={viewApp.status} size="md">{viewApp.status}</Badge>
            </div>
            {viewApp.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button variant="success" fullWidth loading={updating === viewApp._id} onClick={() => updateStatus(viewApp._id, 'accepted')} leftIcon={Check}>Accept</Button>
                <Button variant="danger" fullWidth loading={updating === viewApp._id} onClick={() => updateStatus(viewApp._id, 'rejected')} leftIcon={X}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function FounderApplicationsPage() {
  return <ProtectedRoute allowedRoles={['founder']}><Applications /></ProtectedRoute>;
}
