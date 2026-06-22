'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertCircle, Lock } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import OpportunityForm from '@/components/opportunities/OpportunityForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { opportunityService } from '@/services/opportunityService';
import { startupService } from '@/services/startupService';
import { FREE_OPPORTUNITY_LIMIT } from '@/constants';
import { getErrorMessage } from '@/lib/utils';

function CreateOpportunity() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [startup, setStartup] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await startupService.getMyStartup();
        setStartup(res.data);
      } catch { setStartup(null); }
      finally { setChecked(true); }
    })();
  }, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await opportunityService.createOpportunity(data);
      toast.success('Opportunity created!');
      router.push('/dashboard/founder/opportunities');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create opportunity'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!checked) return null;

  if (!startup || startup.status !== 'approved') {
    return (
      <div>
        <PageHeader title="Create Opportunity" />
        <div className="mx-auto max-w-xl">
          <div className="card-base p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-warning-500" />
            <h2 className="mt-3 text-lg font-semibold text-ink">Approved startup required</h2>
            <p className="mt-1 text-sm text-mute">You need an approved startup profile before posting opportunities.</p>
            <Button href="/dashboard/founder/my-startup" className="mt-4">Set up your startup</Button>
          </div>
        </div>
      </div>
    );
  }

  const atLimit = !user?.isPremium && (startup.opportunityCount || 0) >= FREE_OPPORTUNITY_LIMIT;
  if (atLimit) {
    return (
      <div>
        <PageHeader title="Create Opportunity" />
        <div className="mx-auto max-w-xl">
          <div className="card-base p-8 text-center">
            <Lock className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 text-lg font-semibold text-ink">Free limit reached</h2>
            <p className="mt-1 text-sm text-mute">You&apos;ve used all {FREE_OPPORTUNITY_LIMIT} free opportunities. Upgrade to post unlimited.</p>
            <Button href="/dashboard/founder/upgrade" className="mt-4">Upgrade to Premium</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Create Opportunity" description="Post a new role for collaborators to apply." />
      <div className="mx-auto max-w-2xl">
        <OpportunityForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}

export default function CreateOpportunityPage() {
  return <ProtectedRoute allowedRoles={['founder']}><CreateOpportunity /></ProtectedRoute>;
}
