'use client';

import { cn } from '@/lib/utils';

// Link-like component used for tabs and segmented navigation
export default function Tabs({ tabs, active, onChange, className, size = 'md' }) {
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-surface-card p-1',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const value = typeof tab === 'string' ? tab : tab.value;
        const label = typeof tab === 'string' ? tab : tab.label;
        const isActive = active === value;

        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-full font-bold transition-all',
              sizes[size],
              isActive
                ? 'bg-ink text-on-dark'
                : 'text-ink hover:bg-secondary-pressed'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
