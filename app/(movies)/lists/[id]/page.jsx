import { notFound } from "next/navigation";
import Link from "next/link";
import { getMyCollection } from "@/_lib/collections";
import EditCollectionClient from "@/_components/collections/EditCollectionClient";
import PublicToggle from "@/_components/collections/PublicToggle";
import DeleteCollectionButton from "@/_components/collections/DeleteCollectionButton";

export const metadata = {
  title: "Edit collection",
};

export default async function CollectionEditPage({ params }) {
  const { id } = await params;
  const collection = await getMyCollection(id);
  if (!collection) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
      <Link
        href="/lists"
        className="text-on-surface-variant text-xs no-underline hover:text-on-surface"
      >
        ← Back to lists
      </Link>

      <div>
        <h1 className="text-on-surface text-2xl font-bold leading-tight">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-on-surface-variant text-sm mt-1">{collection.description}</p>
        )}
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

      <div className="mt-6 pt-6 border-t border-outline-variant/30">
        <DeleteCollectionButton collectionId={collection.id} />
      </div>
    </div>
  );
}
