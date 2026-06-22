'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colors = {
  primary: 'text-primary',
  white: 'text-white',
  gray: 'text-ash',
  secondary: 'text-secondary',
};

export default function Spinner({
  size = 'md',
  color = 'primary',
  className,
  label,
}) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizes[size], colors[color])} />
      {label && <span className="text-sm text-mute">{label}</span>}
    </span>
  );
}

export function FullPageSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <Spinner size="xl" />
      <p className="text-sm text-mute">{label}</p>
    </div>
  );
}
