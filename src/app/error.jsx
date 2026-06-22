'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50">
        <AlertTriangle className="h-8 w-8 text-danger-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="max-w-md text-gray-500">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        <Button href="/">Go Home</Button>
      </div>
    </div>
  );
}
