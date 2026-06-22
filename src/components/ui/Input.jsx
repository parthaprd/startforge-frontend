'use client';

import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    className,
    containerClassName,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    id,
    required = false,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LeftIcon
              className={cn(
                'h-4 w-4',
                error ? 'text-error' : 'text-ash'
              )}
            />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'input-base',
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            error &&
              'border-error',
            className
          )}
          {...props}
        />

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <RightIcon className="h-4 w-4 text-ash" />
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs text-error">
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

export default Input;
