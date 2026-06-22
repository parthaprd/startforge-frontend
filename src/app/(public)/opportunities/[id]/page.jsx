'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Briefcase, Clock, Building2, CheckCircle2, Calendar, Send, Lock,
} from 'lucide-react';
import { opportunityService } from '@/services/opportunityService';
import { applicationService } from '@/services/applicationService';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/opportunities/ApplyModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/Table';
import { formatDate, deadlineCountdown, daysUntil, getPlaceholderImage, getErrorMessage } from '@/lib/utils';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await opportunityService.getOpportunityById(id);
        setOpp(res.data);
        if (user?.role === 'collaborator') {
          try {
            const mine = await applicationService.getMyApplications();
            setHasApplied((mine.data || []).some((a) => a.opportunity_id?._id === id || a.opportunity_id === id));
          } catch {}
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load opportunity'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, user]);

  if (loading) return <FullPageSpinner />;
  if (error || !opp) {
    return (
      <div className="container-custom py-20">
        <div className="card-base">
          <EmptyState icon={Briefcase} title="Opportunity not found" description={error || 'This opportunity does not exist.'} action={<Button href="/opportunities" leftIcon={ArrowLeft}>Back to Opportunities</Button>} />
        </div>
      </div>
    );
  }

  const startup = opp.startup_id || {};
  const daysLeft = daysUntil(opp.deadline);
  const isClosed = daysLeft <= 0;

  const canApply = user?.role === 'collaborator' && !isClosed;

  return (
    <div className="bg-surface-soft pb-16">
      {/* Header */}
      <div className="border-b border-hairline bg-surface-card py-12">
        <div className="container-custom">
          <Button href="/opportunities" variant="outline" size="sm" className="mb-6">← All Opportunities</Button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between font-semibold">
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">{opp.role_title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{opp.work_type}</Badge>
                <Badge variant="secondary">{opp.commitment_level}</Badge>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className={`rounded-xl px-4 py-2 text-sm font-medium ${isClosed ? 'bg-secondary-bg text-mute' : 'bg-warning-50 text-warning-900 border border-warning-100'}`}>
                <Clock className="mr-1.5 inline h-4 w-4" />
                {deadlineCountdown(opp.deadline)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
            <h2 className="text-xl font-semibold text-ink">Role Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{opp.description}</p>
          </motion.div>

          {opp.required_skills?.length > 0 && (
            <div className="card-base p-6">
              <h2 className="text-xl font-semibold text-ink">Required Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {opp.required_skills.map((skill, i) => (
                  <span key={i} className="rounded-lg bg-primary-50 px-3 py-1 text-sm font-bold text-primary">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {opp.responsibilities?.length > 0 && (
            <div className="card-base p-6">
              <h2 className="text-xl font-semibold text-ink">Responsibilities</h2>
              <ul className="mt-3 space-y-2">
                {opp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply card */}
          <div className="card-base sticky top-24 p-6">
            {canApply ? (
              <>
                <Button fullWidth size="lg" leftIcon={Send} onClick={() => setApplyOpen(true)} disabled={hasApplied} className="rounded-full">
                  {hasApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
                {hasApplied && <p className="mt-2 text-center text-xs text-mute">You applied for this role</p>}
              </>
            ) : isClosed ? (
              <Button fullWidth size="lg" disabled className="rounded-full">This opportunity is closed</Button>
            ) : !user ? (
              <div className="text-center">
                <Lock className="mx-auto h-6 w-6 text-ash" />
                <p className="mt-2 text-sm text-mute">Login as a collaborator to apply</p>
                <Button fullWidth className="mt-3 rounded-full" href="/login">Login to Apply</Button>
              </div>
            ) : user.role === 'founder' ? (
              <div className="text-center">
                <p className="text-sm text-mute">Founders cannot apply to opportunities. Switch to a collaborator account.</p>
              </div>
            ) : null}
          </div>

          {/* Startup info */}
          <div className="card-base p-6">
            <h3 className="font-semibold text-ink">About the Startup</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-canvas border border-hairline shadow-sm">
                <Image src={startup.logo || getPlaceholderImage(startup.startup_name)} alt={startup.startup_name} fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-ink">{startup.startup_name}</p>
                <p className="text-xs text-mute">{startup.industry}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-mute">Funding</dt><dd className="font-medium text-ink">{startup.funding_stage || '—'}</dd></div>
              <div className="flex justify-between"><dt className="flex items-center gap-1 text-mute"><Calendar className="h-3.5 w-3.5" /> Deadline</dt><dd className="font-medium text-ink">{formatDate(opp.deadline)}</dd></div>
            </dl>
            {startup._id && <Button href={`/startups/${startup._id}`} variant="outline" fullWidth className="mt-4 rounded-full">View Startup</Button>}
          </div>
        </div>
      </div>

      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} opportunity={opp} alreadyApplied={hasApplied} onApplied={() => setHasApplied(true)} />
    </div>
  );
}
