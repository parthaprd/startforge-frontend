'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase } from 'lucide-react';
import { opportunityService } from '@/services/opportunityService';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import {
  OpportunityCardSkeleton,
  GridSkeleton,
} from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function FeaturedOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await opportunityService.getOpportunities({
          page: 1,
          limit: 6,
        });
        setOpportunities(response.data || []);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load opportunities'));
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  return (
    <section className="py-section bg-surface-soft">
      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-mute block mb-1">
              Opportunities
            </span>
            <h2 className="text-heading-xl font-bold text-ink md:text-3xl md:tracking-[-1.2px]">
              Latest Opportunities
            </h2>
            <p className="mt-2 max-w-xl text-body-md text-mute">
              Explore fresh roles from exciting startups. Find your next big
              opportunity.
            </p>
          </div>
          <Button
            href="/opportunities"
            variant="secondary"
            rightIcon={ArrowRight}
            className="rounded-full"
          >
            Browse All Opportunities
          </Button>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <GridSkeleton count={4}>
            <OpportunityCardSkeleton />
          </GridSkeleton>
        ) : error ? (
          <div className="rounded-md border border-error bg-danger-50 p-8 text-center text-sm text-error">
            {error}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-md border border-hairline-soft bg-surface-card p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-mute" />
            <p className="mt-3 text-mute">No opportunities available yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm"
          >
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id} opportunity={opp} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
