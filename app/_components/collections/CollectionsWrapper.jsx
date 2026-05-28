import CollectionCard from "./CollectionCard";
import { listMyCollections } from "@/_lib/collections";
import { Film } from "lucide-react";

export async function CollectionsWrapper() {
    const collections = await listMyCollections();

    return <>
        {collections.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 px-4">
                <Film
                    className="size-8 text-muted-foreground mb-4"
                    aria-hidden
                />
                <p className="text-base font-medium text-foreground mb-1">
                    No collections yet.
                </p>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Make one to start curating: try &quot;Top 10 of All Time&quot; or
                    &quot;Horror Marathons&quot;.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((c) => (
                    <CollectionCard key={c.id} collection={c} />
                ))}
            </div>
        )} </>
}