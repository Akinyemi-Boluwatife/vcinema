const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function Spinner({ size = 'md' }) {
  return (
    <div
      className={`${sizes[size]} border-2 border-surface-high border-t-primary-container rounded-full animate-spin`}
    />
  );
}
