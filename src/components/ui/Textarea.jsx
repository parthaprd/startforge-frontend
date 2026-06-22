'use client';

import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    className,
    containerClassName,
    id,
    required = false,
    rows = 4,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          'input-base resize-y',
          error &&
            'border-error',
          className
        )}
        {...props}
      />

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

export default Textarea;
