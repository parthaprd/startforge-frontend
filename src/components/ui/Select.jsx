'use client';

import { forwardRef, useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    className,
    containerClassName,
    id,
    options = [],
    placeholder = 'Select an option',
    required = false,
    children,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'input-base appearance-none pr-10',
            error &&
              'border-error',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {children}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>

        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-ash" />
      </div>

      {error ? (
        <p
          id={errorId}
          className="mt-1.5 flex items-center gap-1 text-xs text-error"
        >
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
