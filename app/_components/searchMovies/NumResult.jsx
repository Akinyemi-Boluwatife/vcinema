import { Badge } from "@/components/ui/badge";

export default function NumResult({ movies }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Badge variant="outline" className="text-xs">
        Found {movies.length} {movies.length === 1 ? "result" : "results"}
      </Badge>
    </div>
  );
}
