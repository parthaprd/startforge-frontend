'use client';

import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = forwardRef(function Checkbox(
  { label, error, className, containerClassName, id, ...props },
  ref
) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <div className={cn('flex items-start gap-2', containerClassName)}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500/20 focus:ring-2',
            className
          )}
          {...props}
        />
      </div>
      <div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
        {error && <p className="mt-0.5 text-xs text-danger-600">{error}</p>}
      </div>
    </div>
  );
});

export default Checkbox;
