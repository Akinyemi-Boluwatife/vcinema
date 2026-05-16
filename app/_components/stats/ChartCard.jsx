export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-surface-high rounded-lg border border-outline-variant/30 p-4 mb-4">
      <div className="mb-3">
        <p className="text-on-surface text-sm font-semibold">{title}</p>
        {subtitle && (
          <p className="text-on-surface-variant text-xs mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="w-full h-64">{children}</div>
    </div>
  );
}
