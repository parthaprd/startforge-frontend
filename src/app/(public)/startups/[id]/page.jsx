'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Building2, Users, TrendingUp, Globe, ArrowLeft, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { startupService } from '@/services/startupService';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/Table';
import { formatDate, getPlaceholderImage, getErrorMessage } from '@/lib/utils';

export default function StartupDetailPage() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await startupService.getStartupById(id);
        setStartup(res.data);
        // Some backends nest opportunities under the startup response
        setOpportunities(res.data?.opportunities || []);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load startup'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  if (loading) return <FullPageSpinner />;
  if (error || !startup) {
    return (
      <div className="container-custom py-20">
        <div className="card-base">
          <EmptyState icon={Building2} title="Startup not found" description={error || 'The startup you are looking for does not exist.'} action={<Button href="/startups" leftIcon={ArrowLeft}>Back to Startups</Button>} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-soft pb-16">
      {/* Header banner */}
      <div className="border-b border-hairline bg-surface-card py-12">
        <div className="container-custom">
          <Button href="/startups" variant="outline" size="sm" className="mb-6">← All Startups</Button>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white border border-hairline shadow-sm">
              <Image src={startup.logo || getPlaceholderImage(startup.startup_name)} alt={startup.startup_name} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-ink md:text-4xl">{startup.startup_name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" size="md">{startup.industry}</Badge>
                <Badge variant={startup.status || 'approved'}>{startup.status || 'approved'}</Badge>
              </div>
            </div>
            {startup.website && (
              <Button href={startup.website} target="_blank" rel="noopener noreferrer" leftIcon={Globe} variant="primary">Visit Website</Button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
            <h2 className="text-xl font-semibold text-ink">About {startup.startup_name}</h2>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{startup.description}</p>
          </motion.div>

          {/* Opportunities */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Open Opportunities</h2>
              <Badge variant="primary">{opportunities.length} open</Badge>
            </div>
            {opportunities.length === 0 ? (
              <div className="card-base">
                <EmptyState icon={Briefcase} title="No open opportunities" description="This startup hasn't posted any opportunities yet." />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {opportunities.map((opp) => <OpportunityCard key={opp._id} opportunity={opp} />)}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-base p-6">
            <h3 className="font-semibold text-ink">Company Info</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mute"><Building2 className="h-4 w-4" /> Industry</dt><dd className="font-medium text-ink">{startup.industry}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mute"><Users className="h-4 w-4" /> Team Size</dt><dd className="font-medium text-ink">{startup.team_size || '—'}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mute"><TrendingUp className="h-4 w-4" /> Funding</dt><dd className="font-medium text-ink">{startup.funding_stage || '—'}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mute"><Globe className="h-4 w-4" /> Website</dt><dd className="font-medium text-ink truncate max-w-[150px]">{startup.website ? <a href={startup.website} className="text-primary hover:underline" target="_blank" rel="noreferrer">Visit</a> : '—'}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-mute">Founded</dt><dd className="font-medium text-ink">{formatDate(startup.createdAt)}</dd></div>
            </dl>
          </div>
          {startup.status === 'approved' && startup.founder_email && (
            <div className="card-base p-6">
              <h3 className="font-semibold text-ink">Contact Founder</h3>
              <p className="mt-2 text-sm text-mute">Reach out about collaboration opportunities.</p>
              <Button href={`mailto:${startup.founder_email}`} variant="outline" fullWidth className="mt-3 truncate">Email Founder</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
