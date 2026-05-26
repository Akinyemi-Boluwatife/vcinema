import Link from "next/link";
import { Globe, Film } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CollectionCard({ collection }) {
  const { id, title, description, itemCount, coverPoster, isPublic } =
    collection;

  return (
    <Link href={`/lists/${id}`} className="no-underline group">
      <Card className="overflow-hidden hover:border-primary transition-colors h-full p-0">
        <div className="h-32 bg-muted flex items-stretch overflow-hidden">
          {coverPoster ? (
            <img
              src={coverPoster}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.85)" }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Film className="size-8" aria-hidden />
            </div>
          )}
        </div>
        <div className="p-4 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-foreground text-base font-medium truncate">
              {title}
            </p>
            {isPublic && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider shrink-0"
              >
                <Globe className="size-2.5" /> Public
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-muted-foreground text-xs pt-1">
            {itemCount} {itemCount === 1 ? "film" : "films"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
