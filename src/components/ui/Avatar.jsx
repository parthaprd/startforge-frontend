'use client';

import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className,
}) {
  const initials = getInitials(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || name}
        width={48}
        height={48}
        className={cn(
          'rounded-full object-cover ring-2 ring-white',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-surface-card font-bold text-ink ring-2 ring-white',
        sizes[size],
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {initials || '?'}
    </div>
  );
}
