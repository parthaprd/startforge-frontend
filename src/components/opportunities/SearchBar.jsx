'use client';

import { useState, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search by role or skills...',
  loading = false,
  className,
}) {
  const inputRef = useRef(null);

  return (
    <div className={cn('relative', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
        ) : (
          <Search className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => {
            onClear?.();
            inputRef.current?.focus();
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
