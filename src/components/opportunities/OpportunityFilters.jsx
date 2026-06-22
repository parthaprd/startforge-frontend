'use client';

import { Search, X, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import { WORK_TYPES, COMMITMENT_LEVELS, INDUSTRIES } from '@/constants';

export default function OpportunityFilters({ filters, onChange, onClear, search, onSearchChange }) {
  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="card-base p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClear} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600">
          <RotateCcw className="h-3 w-3" /> Clear
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search roles or skills..." className="input-base pl-10" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Work Type</label>
          <div className="space-y-2">
            {WORK_TYPES.map((type) => (
              <Checkbox key={type} label={type} checked={(filters.work_type || []).includes(type)} onChange={() => toggleArrayFilter('work_type', type)} />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Commitment</label>
          <div className="space-y-2">
            {COMMITMENT_LEVELS.map((level) => (
              <Checkbox key={level} label={level} checked={(filters.commitment_level || []).includes(level)} onChange={() => toggleArrayFilter('commitment_level', level)} />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Industry</label>
          <Select value={filters.industry || ''} onChange={(e) => onChange({ ...filters, industry: e.target.value })}>
            {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}
