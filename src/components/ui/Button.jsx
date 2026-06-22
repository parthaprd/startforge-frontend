'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-pressed active:bg-primary-pressed',
  // gradient is a Pinterest-system alias for primary — no decorative gradients in this system
  gradient:
    'bg-primary text-on-primary hover:bg-primary-pressed active:bg-primary-pressed',
  secondary:
    'bg-secondary-bg text-on-secondary hover:bg-secondary-pressed active:bg-secondary-pressed',
  tertiary:
    'bg-transparent text-ink hover:bg-surface-card active:bg-secondary-bg',
  outline:
    'border border-hairline bg-canvas text-ink hover:bg-surface-card active:bg-secondary-bg',
  ghost: 'bg-transparent text-ink hover:bg-surface-card active:bg-secondary-bg',
  danger:
    'bg-error text-white hover:bg-error-deep active:bg-error-deep',
  warn:
    'bg-[#fef3c7] text-[#b45309] hover:bg-[#fde68a] active:bg-[#fde68a]',
  success:
    'bg-success-pale text-success-deep hover:bg-success-100',
  'pill-on-image':
    'bg-canvas text-ink hover:bg-surface-card shadow-sm rounded-full',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-[14px] text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 rounded-full flex items-center justify-center p-0',
};

const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    href,
    type = 'button',
    fullWidth = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...props
  },
  ref
) {
  const classes = cn(
    'btn-base',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && LeftIcon && <LeftIcon className="h-4 w-4" />}
      {children}
      {!loading && RightIcon && <RightIcon className="h-4 w-4" />}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        ref={ref}
        aria-disabled={disabled}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
});

export default Button;
