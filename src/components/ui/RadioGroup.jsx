'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

const RadioGroup = forwardRef(function RadioGroup(
  { options = [], label, error, className, containerClassName, id, ...props },
  ref
) {
  const generatedId = useId();
  const groupId = id || generatedId;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <div className={cn('flex flex-wrap gap-3', className)} role="radiogroup">
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const optionLabel = typeof opt === 'string' ? opt : opt.label;
          const optionDesc = typeof opt === 'object' ? opt.description : null;

          return (
            <label
              key={value}
              htmlFor={`${groupId}-${value}`}
              className="flex flex-1 cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary-400 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
            >
              <input
                ref={ref}
                type="radio"
                id={`${groupId}-${value}`}
                value={value}
                className="mt-0.5 h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500/20 focus:ring-2"
                {...props}
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">
                  {optionLabel}
                </span>
                {optionDesc && (
                  <span className="block text-xs text-gray-500">
                    {optionDesc}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
    </div>
  );
});

export default RadioGroup;
