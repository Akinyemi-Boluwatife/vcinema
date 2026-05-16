export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-24 bg-surface-variant rounded-xl mb-4" />
      <div className="h-20 bg-surface-variant rounded-lg mb-4" />
      <div className="h-72 bg-surface-variant rounded-lg mb-4" />
      <div className="h-72 bg-surface-variant rounded-lg mb-4" />
      <div className="h-72 bg-surface-variant rounded-lg mb-4" />
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-48 bg-surface-variant rounded-lg flex-1" />
        <div className="h-48 bg-surface-variant rounded-lg flex-1" />
      </div>
    </div>
  );
}
