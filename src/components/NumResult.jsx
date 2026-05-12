import Badge from './ui/Badge';

export default function NumResult({ movies }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-on-surface-variant text-sm">Found</span>
      <Badge variant="accent">{movies.length} results</Badge>
    </div>
  );
}
