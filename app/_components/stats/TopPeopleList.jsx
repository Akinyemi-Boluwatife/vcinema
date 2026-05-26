import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TopPeopleList({ title, people }) {
  return (
    <Card className="flex-1">
      <CardContent>
        <p className="text-base font-medium text-foreground mb-4">{title}</p>
        {people.length === 0 ? (
          <p className="text-muted-foreground text-xs">No data yet.</p>
        ) : (
          <ol className="flex flex-col list-none p-0 m-0">
            {people.map((p, i) => (
              <li
                key={p.name}
                className={`flex items-center justify-between text-sm py-2 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="truncate text-foreground">{p.name}</span>
                <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                  {p.count}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
