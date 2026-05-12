export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`bg-surface-lowest border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/60 px-3 py-2 text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all duration-200 w-full ${className}`}
      {...props}
    />
  );
}
