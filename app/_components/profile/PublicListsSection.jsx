import Image from "next/image";
import Link from "next/link";
import { Film } from "lucide-react";
import { getPublicCollections } from "@/_lib/profiles";
import { Card } from "@/components/ui/card";
import Pagination from "@/_components/shared/Pagination";
import PublicProfileSection from "./PublicProfileSection";
import { PER_PAGE, paginate } from "./publicProfileUtils";

export default async function PublicListsSection({ username, page }) {
  const collections = await getPublicCollections(username);
  if (!collections.length) return null;

  const pageItems = paginate(collections, page, PER_PAGE);

  return (
    <PublicProfileSection
      title="Public lists"
      subtitle={`${collections.length} ${collections.length === 1 ? "list" : "lists"}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pageItems.map((c) => (
          <PublicCollectionLink key={c.id} collection={c} />
        ))}
      </div>
      <Pagination paramName="lp" total={collections.length} perPage={PER_PAGE} />
    </PublicProfileSection>
  );
}

function PublicCollectionLink({ collection }) {
  const { title, description, itemCount, coverPoster, publicSlug } = collection;
  return (
    <Link href={`/c/${publicSlug}`} className="no-underline">
      <Card className="overflow-hidden hover:border-primary transition-colors h-full p-0">
        <div className="h-24 bg-muted relative">
          {coverPoster ? (
            <Image
              src={coverPoster}
              alt=""
              fill
              className="object-cover"
              style={{ filter: "saturate(0.85)" }}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Film className="size-6" aria-hidden />
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-foreground text-sm font-medium truncate">
            {title}
          </p>
          {description && (
            <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
              {description}
            </p>
          )}
          <p className="text-muted-foreground text-xs mt-2">
            {itemCount} {itemCount === 1 ? "film" : "films"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
