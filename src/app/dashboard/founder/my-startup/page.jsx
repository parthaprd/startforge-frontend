'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, Pencil, Trash2, ExternalLink, Users, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import StartupForm from '@/components/startups/StartupForm';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { startupService } from '@/services/startupService';
import { formatDate, getPlaceholderImage, getErrorMessage } from '@/lib/utils';

function MyStartup() {
  const router = useRouter();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchStartup = async () => {
    try {
      const res = await startupService.getMyStartup();
      setStartup(res.data);
    } catch (err) {

      setStartup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStartup(); }, []);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      const res = await startupService.createStartup(data);
      setStartup(res.data);
      setShowForm(false);
      toast.success('Startup created! Pending admin approval.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create startup'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await startupService.deleteStartup(startup._id);
      setStartup(null);
      toast.success('Startup deleted');
      setConfirmDelete(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete startup'));
    }
  };

  if (loading) return <FullPageSpinner />;

  if (!startup && !showForm) {
    return (
      <div>
        <PageHeader title="My Startup" description="Create your startup profile to start posting opportunities." />
        <div className="mx-auto max-w-2xl"><StartupForm onSubmit={handleCreate} submitting={submitting} /></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <PageHeader title="Edit Startup" description="Update your startup information.">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
        </PageHeader>
        <div className="mx-auto max-w-2xl">
          <StartupForm defaultValues={startup} onSubmit={async (data) => {
            setSubmitting(true);
            try {
              const res = await startupService.updateStartup(startup._id, data);
              setStartup(res.data);
              setShowForm(false);
              toast.success('Startup updated!');
            } catch (err) { toast.error(getErrorMessage(err, 'Failed to update')); }
            finally { setSubmitting(false); }
          }} submitting={submitting} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Startup" description="Manage your startup profile.">
        <Button variant="outline" leftIcon={Pencil} onClick={() => setShowForm(true)}>Edit</Button>
        <Button variant="danger" leftIcon={Trash2} onClick={() => setConfirmDelete(true)}>Delete</Button>
      </PageHeader>

      {startup.status === 'pending' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-warning-100 bg-warning-50 p-4 text-sm text-warning-900">
          <AlertCircle className="h-5 w-5 flex-shrink-0" /> Your startup is under review. You'll be notified once approved.
        </div>
      )}
      {startup.status === 'rejected' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-danger-100 bg-danger-50 p-4 text-sm text-error">
          <XCircle className="h-5 w-5 flex-shrink-0" /> Your startup was rejected. Please edit and resubmit.
        </div>
      )}
      {startup.status === 'approved' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-success-50 bg-success-pale p-4 text-sm text-success-deep">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> Your startup is approved! You can now post opportunities.
        </div>
      )}

      <div className="card-base overflow-hidden">
        <div className="bg-surface-card border-b border-hairline p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white border border-hairline shadow-sm">
              <Image src={startup.logo || getPlaceholderImage(startup.startup_name)} alt={startup.startup_name} fill sizes="80px" className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">{startup.startup_name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{startup.industry}</Badge>
                <Badge variant={startup.status}>{startup.status}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-ink">About</h3>
          <p className="mt-2 whitespace-pre-wrap text-ink-soft">{startup.description}</p>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-soft border border-hairline-soft p-4">
              <dt className="flex items-center gap-2 text-xs text-mute"><Users className="h-4 w-4" /> Team Size</dt>
              <dd className="mt-1 font-semibold text-ink">{startup.team_size || '—'}</dd>
            </div>
            <div className="rounded-xl bg-surface-soft border border-hairline-soft p-4">
              <dt className="flex items-center gap-2 text-xs text-mute"><TrendingUp className="h-4 w-4" /> Funding Stage</dt>
              <dd className="mt-1 font-semibold text-ink">{startup.funding_stage || '—'}</dd>
            </div>
            <div className="rounded-xl bg-surface-soft border border-hairline-soft p-4">
              <dt className="flex items-center gap-2 text-xs text-mute">Created</dt>
              <dd className="mt-1 font-semibold text-ink">{formatDate(startup.createdAt)}</dd>
            </div>
          </dl>

          {startup.website && (
            <Button href={startup.website} target="_blank" variant="outline" leftIcon={ExternalLink} className="mt-6">Visit Website</Button>
          )}
        </div>
      </div>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={handleDelete} title="Delete Startup?" message="This will permanently delete your startup and all associated opportunities. This action cannot be undone." confirmLabel="Delete" />
    </div>
  );
}

export default function MyStartupPage() {
  return <ProtectedRoute allowedRoles={['founder']}><MyStartup /></ProtectedRoute>;
}
