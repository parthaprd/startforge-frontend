'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Building2, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { startupService } from '@/services/startupService';
import StartupCard from '@/components/startups/StartupCard';
import { StartupCardSkeleton } from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { INDUSTRIES } from '@/constants';
import { getErrorMessage } from '@/lib/utils';
import { EmptyState } from '@/components/ui/Table';
import Link from 'next/link';

function StartupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: searchParams.get('page') || 1,
          limit: 12,
          search: searchParams.get('search') || '',
          industry: searchParams.get('industry') || '',
        };
        const res = await startupService.getStartups(params);
        setStartups(res.data || []);
        setPagination(res.pagination || { current: 1, total: 1 });
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load startups'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([k, v]) =>
      v ? params.set(k, v) : params.delete(k)
    );
    router.push(`/startups?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search, page: '' });
  };
  const handlePageChange = (page) => updateParams({ page });

  const featuredStartups = startups.slice(0, 3);
  const allStartups = startups.slice(3);

  return (
    <div className="min-h-screen bg-surface-soft">

      <div className="bg-ink py-14">
        <div className="container-custom text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-on-dark-mute block mb-2">
            Discover
          </span>
          <h1 className="text-heading-xl font-bold text-on-dark md:text-4xl md:tracking-[-1.5px]">
            Browse Startups
          </h1>
          <p className="mt-3 text-body-md text-on-dark-mute">
            Discover innovative startups looking for collaborators
          </p>
        </div>
      </div>

      <div className="container-custom py-10 pb-16">

        <div className="rounded-md border border-hairline-soft bg-canvas p-4 mb-10">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by startup name..."
                className="input-base pl-10"
              />
            </div>
            <div className="md:w-52">
              <Select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  updateParams({ industry: e.target.value, page: '' });
                }}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" leftIcon={SlidersHorizontal} className="rounded-full">
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <div className="h-6 w-36 shimmer-bg rounded-md" />
                <div className="h-4 w-16 shimmer-bg rounded-md" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <StartupCardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="h-6 w-44 shimmer-bg rounded-md" />
                <div className="h-4 w-16 shimmer-bg rounded-md" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <StartupCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </>
        ) : error ? (
          <div className="rounded-md border border-danger-100 bg-danger-50 p-8 text-center text-sm text-error">
            {error}
          </div>
        ) : startups.length === 0 ? (
          <div className="rounded-md border border-hairline-soft bg-canvas">
            <EmptyState
              icon={Building2}
              title="No startups found"
              description="Try adjusting your search or filters."
            />
          </div>
        ) : (
          <>

            {featuredStartups.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-heading-md font-bold text-ink">
                    {search || industry ? 'Results' : 'Featured Startups'}
                  </h2>
                  <Link
                    href="/opportunities"
                    className="text-sm font-semibold text-primary hover:text-primary-pressed flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
                  }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {featuredStartups.map((s) => (
                    <StartupCard key={s._id} startup={s} />
                  ))}
                </motion.div>
              </section>
            )}

            {allStartups.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-heading-md font-bold text-ink">
                    All Startups
                    <span className="ml-2 text-sm font-normal text-mute">
                      ({pagination.count || startups.length} total)
                    </span>
                  </h2>
                  <Link
                    href="/startups"
                    className="text-sm font-semibold text-primary hover:text-primary-pressed flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                  }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {allStartups.map((s) => (
                    <StartupCard key={s._id} startup={s} />
                  ))}
                </motion.div>
              </section>
            )}

            <div className="mt-10">
              <Pagination
                currentPage={pagination.current}
                totalPages={pagination.total}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function StartupsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-20 text-center text-mute">
          Loading...
        </div>
      }
    >
      <StartupsContent />
    </Suspense>
  );
}
