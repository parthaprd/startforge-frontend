'use client';

import { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { opportunityService } from '@/services/opportunityService';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import OpportunityFilters from '@/components/opportunities/OpportunityFilters';
import { OpportunityCardSkeleton } from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Table';
import { useDebounce } from '@/hooks/useDebounce';
import { getErrorMessage } from '@/lib/utils';

function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    work_type: searchParams.get('work_type') ? searchParams.get('work_type').split(',') : [],
    commitment_level: searchParams.get('commitment_level') ? searchParams.get('commitment_level').split(',') : [],
    industry: searchParams.get('industry') || '',
  });

  const debouncedSearch = useDebounce(search, 500);

  // Use a ref-based pushUrl so effects never become stale
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([k, v]) => {
      if (Array.isArray(v)) { v.length ? params.set(k, v.join(',')) : params.delete(k); }
      else if (v) params.set(k, v);
      else params.delete(k);
    });
    routerRef.current.push(`/opportunities?${params.toString()}`);
  }, []);

  // Track previous values to avoid resetting page on unrelated searchParams changes
  const prevSearchRef = useRef(debouncedSearch);
  useEffect(() => {
    if (debouncedSearch !== prevSearchRef.current) {
      prevSearchRef.current = debouncedSearch;
      updateUrl({ search: debouncedSearch, page: '' });
    }
  }, [debouncedSearch, updateUrl]);

  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    if (filters !== prevFiltersRef.current) {
      prevFiltersRef.current = filters;
      updateUrl({ work_type: filters.work_type, commitment_level: filters.commitment_level, industry: filters.industry, page: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: searchParams.get('page') || 1,
          limit: 12,
          search: searchParams.get('search') || '',
          work_type: searchParams.get('work_type') || '',
          commitment_level: searchParams.get('commitment_level') || '',
          industry: searchParams.get('industry') || '',
        };
        const res = await opportunityService.getOpportunities(params);
        setOpportunities(res.data || []);
        setPagination(res.pagination || { current: 1, total: 1 });
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load opportunities'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const clearFilters = () => {
    setSearch(''); setFilters({ work_type: [], commitment_level: [], industry: '' });
    router.push('/opportunities');
  };

  return (
    <div className="bg-surface-soft min-h-screen">
      <div className="bg-ink py-14">
        <div className="container-custom text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-on-dark-mute block mb-2">
            Explore
          </span>
          <h1 className="text-heading-xl font-bold text-on-dark md:text-4xl md:tracking-[-1.5px]">
            Browse Opportunities
          </h1>
          <p className="mt-3 text-body-md text-on-dark-mute">
            Find your next role at an exciting startup
          </p>
        </div>
      </div>

      <div className="container-custom -mt-8 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <OpportunityFilters filters={filters} onChange={setFilters} onClear={clearFilters} search={search} onSearchChange={setSearch} />
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-sm text-mute">{pagination.count || 0} opportunities</p>
            <Button variant="outline" size="sm" leftIcon={SlidersHorizontal} onClick={() => setShowMobileFilters(true)}>Filters</Button>
          </div>

          {/* Results */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => <OpportunityCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="rounded-md border border-danger-100 bg-danger-50 p-8 text-center text-sm text-error">{error}</div>
            ) : opportunities.length === 0 ? (
              <div className="card-base">
                <EmptyState icon={Briefcase} title="No opportunities found" description="Try adjusting your search or filters." action={<Button variant="outline" onClick={clearFilters}>Clear Filters</Button>} />
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-heading-md font-bold text-ink">
                    Opportunities
                    <span className="ml-2 text-sm font-normal text-mute">({pagination.count || opportunities.length} found)</span>
                  </h2>
                </div>
                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {opportunities.map((opp) => <OpportunityCard key={opp._id} opportunity={opp} />)}
                </motion.div>
                <div className="mt-10">
                  <Pagination currentPage={pagination.current} totalPages={pagination.total} onPageChange={(p) => updateUrl({ page: p })} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-canvas p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-ink">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="rounded-lg p-1 text-mute hover:bg-surface-card"><X className="h-5 w-5" /></button>
            </div>
            <OpportunityFilters filters={filters} onChange={setFilters} onClear={clearFilters} search={search} onSearchChange={setSearch} />
            <Button fullWidth className="mt-4 rounded-full" onClick={() => setShowMobileFilters(false)}>Show Results</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="container-custom py-20 text-center text-mute">Loading...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
