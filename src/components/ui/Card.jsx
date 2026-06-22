'use client';

import { cn } from '@/lib/utils';

export default function Card({ children, className, hover = false, as: Component = 'div', ...props }) {
  return (
    <Component
      className={cn(
        'card-base p-6',
        hover && 'hover:border-stone',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-2', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-bold text-ink', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-mute', className)}>{children}</p>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)}>
      {children}
    </div>
  );
}
