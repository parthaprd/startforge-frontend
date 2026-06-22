'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import OpportunityForm from '@/components/opportunities/OpportunityForm';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { opportunityService } from '@/services/opportunityService';
import { getErrorMessage } from '@/lib/utils';

function EditOpportunity() {
  const { id } = useParams();
  const router = useRouter();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await opportunityService.getOpportunityById(id);
        setOpp(res.data);
      } catch (err) { toast.error(getErrorMessage(err, 'Failed to load')); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await opportunityService.updateOpportunity(id, data);
      toast.success('Opportunity updated!');
      router.push('/dashboard/founder/opportunities');
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to update')); }
    finally { setSubmitting(false); }
  };

  if (loading) return <FullPageSpinner />;
  if (!opp) return <p className="text-mute">Opportunity not found.</p>;

  return (
    <div>
      <PageHeader title="Edit Opportunity" description={opp.role_title} />
      <div className="mx-auto max-w-2xl">
        <OpportunityForm defaultValues={opp} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}

export default function EditOpportunityPage() {
  return <ProtectedRoute allowedRoles={['founder']}><EditOpportunity /></ProtectedRoute>;
}
