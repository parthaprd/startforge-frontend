'use client';

import { cn } from '@/lib/utils';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-hairline bg-white">
      <table className={cn('w-full text-left text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={cn('border-b border-hairline bg-surface-card', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return <tbody className={cn('divide-y divide-hairline', className)}>{children}</tbody>;
}

export function TableRow({ children, className, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-surface-soft',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-mute',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }) {
  return (
    <td className={cn('whitespace-nowrap px-4 py-3 text-ink', className)}>
      {children}
    </td>
  );
}

export default Table;
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-card">
          <Icon className="h-8 w-8 text-ash" />
        </div>
      )}
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-mute">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
