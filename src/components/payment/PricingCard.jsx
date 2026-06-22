'use client';

import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PricingCard({ plan, isPremium, onUpgrade, loading }) {
  return (
    <div className={cn(
      'relative mx-auto w-full max-w-md border-2 bg-white p-8',
      isPremium ? 'border-success-500' : 'border-primary-200'
    )}>
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
          <Crown className="h-3.5 w-3.5" /> {plan.name}
        </div>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-gray-900">${plan.price.toLocaleString()}</span>
          <span className="text-gray-500">/{plan.interval}</span>
        </div>

        <ul className="mt-8 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success-50">
                <Check className="h-3 w-3 text-success-600" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={onUpgrade}
          disabled={isPremium || loading}
          className={cn(
            'btn-base mt-8 w-full py-3 text-base font-semibold rounded-full',
            isPremium ? 'bg-gray-100 text-gray-400' : 'bg-primary text-on-primary hover:bg-primary-pressed'
          )}
        >
          {loading ? 'Processing...' : isPremium ? 'You are Premium ✓' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
}
