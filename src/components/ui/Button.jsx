const variants = {
  primary:
    'bg-primary-container text-on-primary-container hover:bg-primary-dim shadow-glow-sm font-semibold',
  secondary:
    'bg-surface-high text-on-surface border border-outline-variant hover:border-outline hover:bg-surface-highest',
  ghost: 'bg-transparent text-primary hover:bg-surface-mid hover:text-on-surface',
};

export default function Button({ variant = 'primary', children, className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded transition-all duration-200 cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
