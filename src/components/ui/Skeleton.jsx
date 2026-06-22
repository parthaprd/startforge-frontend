'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ variant = 'rectangle', className, width, height }) {
  const variants = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    rectangle: 'rounded-md',
  };

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn('shimmer-bg', variants[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
}

export function StartupCardSkeleton() {
  return (
    <div className="card-base bg-canvas p-4 flex flex-col gap-3">

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton variant="rectangle" width={40} height={40} className="rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" width="55%" />
            <Skeleton variant="text" width="35%" height={10} />
          </div>
        </div>
        <Skeleton variant="circle" width={28} height={28} />
      </div>

      <div className="space-y-1.5">
        <Skeleton variant="text" width="75%" />
        <Skeleton variant="text" width="40%" height={10} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-hairline-soft">
        <Skeleton width={60} height={28} />
        <Skeleton width={90} height={28} className="rounded-full" />
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="card-base bg-canvas p-4 flex flex-col gap-3">

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton variant="rectangle" width={40} height={40} className="rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" height={10} />
          </div>
        </div>
        <Skeleton variant="circle" width={28} height={28} />
      </div>

      <div className="space-y-1.5">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="35%" height={10} />
      </div>

      <div className="flex gap-1.5">
        <Skeleton width={55} height={20} className="rounded-full" />
        <Skeleton width={65} height={20} className="rounded-full" />
        <Skeleton width={48} height={20} className="rounded-full" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-hairline-soft">
        <Skeleton width={70} height={28} />
        <Skeleton width={80} height={28} className="rounded-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, children }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  );
}

export default Skeleton;
