'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className, variant = 'dark', showText = true, href = '/' }) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink';

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
        <Rocket className="h-5 w-5 text-white" />
      </div>
      {showText && (
        <span className={cn('text-xl font-bold tracking-tighter', textColor)}>
          Startup<span className="text-primary">Forge</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-flex">{content}</Link>;
  }
  return content;
}
