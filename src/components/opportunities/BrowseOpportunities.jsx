'use client';

import { useEffect, useState, useCallback } from 'react';
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

export default function BrowseOpportunities() {
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

  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (Array.isArray(v)) { v.length ? params.set(k, v.join(',')) : params.delete(k); }
      else if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/dashboard/collaborator/browse?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => { updateUrl({ search: debouncedSearch, page: '' }); }, [debouncedSearch, updateUrl]);
  useEffect(() => { updateUrl({ work_type: filters.work_type, commitment_level: filters.commitment_level, industry: filters.industry, page: '' });   }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await opportunityService.getOpportunities({
          page: searchParams.get('page') || 1,
          limit: 12,
          search: searchParams.get('search') || '',
          work_type: searchParams.get('work_type') || '',
          commitment_level: searchParams.get('commitment_level') || '',
          industry: searchParams.get('industry') || '',
        });
        setOpportunities(res.data || []);
        setPagination(res.pagination || { current: 1, total: 1 });
      } catch (err) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [searchParams]);

  const clearFilters = () => { setSearch(''); setFilters({ work_type: [], commitment_level: [], industry: '' }); router.push('/dashboard/collaborator/browse'); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Opportunities</h1>
          <p className="mt-1 text-sm text-gray-500">Find your next role at an exciting startup</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <OpportunityFilters filters={filters} onChange={setFilters} onClear={clearFilters} search={search} onSearchChange={setSearch} />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <p className="text-sm text-gray-500">{pagination.count || 0} opportunities</p>
            <Button variant="outline" size="sm" leftIcon={SlidersHorizontal} onClick={() => setShowMobileFilters(true)}>Filters</Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => <OpportunityCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-danger-100 bg-danger-50 p-8 text-center text-danger-600">{error}</div>
          ) : opportunities.length === 0 ? (
            <div className="card-base">
              <EmptyState icon={Briefcase} title="No opportunities found" description="Try adjusting your search or filters." action={<Button variant="outline" onClick={clearFilters}>Clear Filters</Button>} />
            </div>
          ) : (
            <>
              <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {opportunities.map((opp) => <OpportunityCard key={opp._id} opportunity={opp} />)}
              </motion.div>
              <div className="mt-10"><Pagination currentPage={pagination.current} totalPages={pagination.total} onPageChange={(p) => updateUrl({ page: p })} /></div>
            </>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="rounded-lg p-1 hover:bg-gray-200"><X className="h-5 w-5" /></button>
            </div>
            <OpportunityFilters filters={filters} onChange={setFilters} onClear={clearFilters} search={search} onSearchChange={setSearch} />
            <Button fullWidth className="mt-4" onClick={() => setShowMobileFilters(false)}>Show Results</Button>
          </div>
        </div>
      )}
    </div>
  );
}
