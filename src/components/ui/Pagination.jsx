'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

function getPageRange(current, total) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) rangeWithDots.push(1, '...');
  else rangeWithDots.push(1);

  rangeWithDots.push(...range);

  if (current + delta < total - 1) rangeWithDots.push('...', total);
  else if (total > 1) rangeWithDots.push(total);

  return rangeWithDots;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  const buttonBase =
    'flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-bold transition-colors';

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          buttonBase,
          'border border-hairline text-ink hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`dots-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-mute"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(
              buttonBase,
              currentPage === page
                ? 'bg-ink text-on-dark'
                : 'border border-hairline text-ink hover:bg-surface-card'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          buttonBase,
          'border border-hairline text-ink hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
