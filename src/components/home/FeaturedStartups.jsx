'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { startupService } from '@/services/startupService';
import StartupCard from '@/components/startups/StartupCard';
import {
  StartupCardSkeleton,
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

export default function FeaturedStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const response = await startupService.getStartups({ page: 1, limit: 6 });
        setStartups(response.data || []);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load startups'));
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  return (
    <section className="bg-canvas py-section">
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
              Featured
            </span>
            <h2 className="text-heading-xl font-bold text-ink md:text-3xl md:tracking-[-1.2px]">
              Featured Startups
            </h2>
            <p className="mt-2 max-w-xl text-body-md text-mute">
              Discover innovative startups looking for talented collaborators to
              join their mission.
            </p>
          </div>
          <Button href="/startups" variant="secondary" rightIcon={ArrowRight} className="rounded-full">
            View All Startups
          </Button>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <GridSkeleton count={4}>
            <StartupCardSkeleton />
          </GridSkeleton>
        ) : error ? (
          <div className="rounded-md border border-error bg-danger-50 p-8 text-center text-sm text-error">
            {error}
          </div>
        ) : startups.length === 0 ? (
          <div className="rounded-md border border-hairline-soft bg-surface-card p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-mute" />
            <p className="mt-3 text-mute">No startups available yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm"
          >
            {startups.map((startup) => (
              <StartupCard key={startup._id} startup={startup} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
