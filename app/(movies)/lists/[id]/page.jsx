import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMyCollection } from "@/_lib/collections";
import EditCollectionClient from "@/_components/collections/EditCollectionClient";
import PublicToggle from "@/_components/collections/PublicToggle";
import DeleteCollectionButton from "@/_components/collections/DeleteCollectionButton";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Edit collection",
};

export default async function CollectionEditPage({ params }) {
  const { id } = await params;
  const collection = await getMyCollection(id);
  if (!collection) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="self-start -ml-2">
        <Link href="/lists">
          <ArrowLeft className="size-3.5" />
          Back to lists
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-base text-muted-foreground mt-2">
            {collection.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          {collection.items?.length ?? 0}{" "}
          {(collection.items?.length ?? 0) === 1 ? "film" : "films"}
        </p>
      </div>

      <PublicToggle
        collectionId={collection.id}
        initialPublic={collection.isPublic}
        initialSlug={collection.publicSlug}
      />

      <EditCollectionClient
        collectionId={collection.id}
        initialItems={collection.items}
      />

      <div className="mt-8 pt-6 border-t border-border">
        <DeleteCollectionButton collectionId={collection.id} />
      </div>
    </div>
  );
}
