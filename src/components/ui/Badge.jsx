'use client';

import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-[#ffe5e0] text-primary',
  secondary: 'bg-secondary-bg text-on-secondary',
  success: 'bg-success-pale text-success-deep',
  warning: 'bg-[#fef3c7] text-[#b45309]',
  premium: 'bg-[#fef3c7] text-[#b45309]',
  danger: 'bg-danger-50 text-error',
  error: 'bg-danger-50 text-error',
  gray: 'bg-surface-card text-mute',
  outline: 'border border-hairline text-mute bg-canvas',
};

const statusVariants = {
  pending: 'warning',
  approved: 'success',
  accepted: 'success',
  active: 'success',
  rejected: 'danger',
  inactive: 'gray',
  blocked: 'danger',
  premium: 'premium',
};

export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  className,
  dot = false,
}) {

  const resolvedVariant = statusVariants[variant] || variant;

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const dotColors = {
    primary: 'bg-primary',
    secondary: 'bg-on-secondary',
    success: 'bg-success-600',
    warning: 'bg-warning-500',
    premium: 'bg-warning-500',
    danger: 'bg-error',
    error: 'bg-error',
    gray: 'bg-stone',
    outline: 'bg-stone',
  };

  return (
    <span
      className={cn('badge-base font-bold normal-case', variants[resolvedVariant], sizes[size], className)}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            dotColors[resolvedVariant] || dotColors.gray
          )}
        />
      )}
      {typeof children === 'string' ? children.toLowerCase() : children}
    </span>
  );
}
