import { cn } from '../utils/cn';

const variants = {
  glass: 'glass-card',
  solid: 'glass-card-solid',
  elevated: 'glass-card-elevated',
};

const paddings = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
  none: '',
};

export default function Card({
  variant = 'glass',
  padding = 'md',
  hover = false,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        variants[variant],
        paddings[padding],
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
