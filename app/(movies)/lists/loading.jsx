export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-surface-variant rounded w-24" />
      <div className="h-12 bg-surface-variant rounded-xl" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-surface-variant rounded-lg" />
      ))}
    </div>
  );
}
