const variants = {
  default: 'bg-surface-high text-on-surface-variant',
  active: 'bg-tertiary-container text-on-tertiary-container',
  accent: 'bg-primary-container/20 text-primary border border-primary-container/40',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-widest ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
