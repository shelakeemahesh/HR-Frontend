import { cn } from '../utils/cn';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-4',
};

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
