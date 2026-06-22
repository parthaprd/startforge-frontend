'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Eye, Users, Lock, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '@/components/ui/Table';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { opportunityService } from '@/services/opportunityService';
import { startupService } from '@/services/startupService';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { FREE_OPPORTUNITY_LIMIT } from '@/constants';

function OpportunitiesList() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = async () => {
    try {
      const [oppsRes, startupRes] = await Promise.all([
        opportunityService.getMyOpportunities(),
        startupService.getMyStartup().catch(() => null),
      ]);
      setOpportunities(oppsRes.data || []);
      setStartup(startupRes?.data || null);
    } catch (err) {   }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async () => {
    try {
      await opportunityService.deleteOpportunity(deleteId);
      setOpportunities(opportunities.filter((o) => o._id !== deleteId));
      toast.success('Opportunity deleted');
      setDeleteId(null);
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to delete')); }
  };

  if (loading) return <FullPageSpinner />;

  const isPremium = user?.isPremium;
  const reachedLimit = !isPremium && opportunities.length >= FREE_OPPORTUNITY_LIMIT;

  return (
    <div>
      <PageHeader title="My Opportunities" description="Manage your posted opportunities.">
        {reachedLimit ? (
          <Button href="/dashboard/founder/upgrade" leftIcon={Lock}>Upgrade to post more</Button>
        ) : (
          <Button href="/dashboard/founder/opportunities/create" leftIcon={Plus}>New Opportunity</Button>
        )}
      </PageHeader>

      {!isPremium && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm">
          <span className="flex items-center gap-2 text-primary-900"><AlertCircle className="h-4 w-4" /> Free plan: {opportunities.length}/{FREE_OPPORTUNITY_LIMIT} opportunities used.</span>
          <Button href="/dashboard/founder/upgrade" size="sm">Upgrade</Button>
        </div>
      )}

      {startup && startup.status !== 'approved' && (
        <div className="mb-6 rounded-xl border border-warning-100 bg-warning-50 p-4 text-sm text-warning-900">
          Your startup is {startup.status}. You need an approved startup before creating opportunities.
        </div>
      )}

      {opportunities.length === 0 ? (
        <div className="card-base">
          <EmptyState icon={Plus} title="No opportunities yet" description="Create your first opportunity to start receiving applications." action={<Button href="/dashboard/founder/opportunities/create" leftIcon={Plus}>Create Opportunity</Button>} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Title</TableHead>
              <TableHead>Work Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp) => (
              <TableRow key={opp._id}>
                <TableCell className="font-medium text-ink">{opp.role_title}</TableCell>
                <TableCell><Badge variant="primary" size="sm">{opp.work_type}</Badge></TableCell>
                <TableCell><Badge variant={opp.isActive ? 'success' : 'gray'} size="sm">{opp.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="text-mute">{formatDate(opp.deadline)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/opportunities/${opp._id}`} className="rounded-lg p-2 text-mute hover:bg-surface-card" title="View"><Eye className="h-4 w-4" /></Link>
                    <Link href={`/dashboard/founder/opportunities/${opp._id}/edit`} className="rounded-lg p-2 text-primary hover:bg-primary-50" title="Edit"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => setDeleteId(opp._id)} className="rounded-lg p-2 text-danger-500 hover:bg-danger-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Opportunity?" message="This action cannot be undone." confirmLabel="Delete" />
    </div>
  );
}

export default function FounderOpportunitiesPage() {
  return <ProtectedRoute allowedRoles={['founder']}><OpportunitiesList /></ProtectedRoute>;
}
