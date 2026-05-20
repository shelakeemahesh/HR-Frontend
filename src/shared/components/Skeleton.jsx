import { cn } from '../utils/cn';

export default function Skeleton({ className, variant = 'line', count = 1 }) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg';

  if (variant === 'card') return <div className={cn(base, 'h-32 rounded-2xl', className)} />;
  if (variant === 'avatar') return <div className={cn(base, 'h-10 w-10 rounded-full', className)} />;
  if (variant === 'title') return <div className={cn(base, 'h-6 w-48', className)} />;

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(base, 'h-4', i === count - 1 ? 'w-3/4' : 'w-full')} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-4">{Array.from({ length: cols }).map((_, i) => <div key={i} className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />)}</div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">{Array.from({ length: cols }).map((_, c) => <div key={c} className="h-10 flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
    </div>
  );
}
