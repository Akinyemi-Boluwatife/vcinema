import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicCollectionBySlug } from "@/_lib/collections";

export const metadata = {
  title: "Shared collection",
};

export default async function PublicCollectionPage({ params }) {
  const { slug } = await params;
  const collection = await getPublicCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-surface-low/80 border-b border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-on-surface text-base font-bold no-underline"
          >
            vcinema
          </Link>
          <span className="text-on-surface-variant text-xs uppercase tracking-widest">
            Shared list
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-on-surface text-2xl font-bold leading-tight">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-on-surface-variant text-sm mt-1">{collection.description}</p>
          )}
          <p className="text-on-surface-variant text-xs mt-2">
            {collection.items.length}{" "}
            {collection.items.length === 1 ? "film" : "films"}
          </p>
        </div>

        {collection.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-5xl">🎞️</span>
            <p className="text-on-surface-variant text-sm">This list is empty.</p>
          </div>
        ) : (
          <ol className="flex flex-col gap-2 list-none p-0 m-0">
            {collection.items.map((item, i) => (
              <li
                key={item.imdbID}
                className="flex items-center gap-3 p-2 bg-surface-high rounded-lg border border-outline-variant/30"
              >
                <span className="text-on-surface-variant text-sm font-bold w-6 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="w-10 h-14 bg-surface-variant rounded overflow-hidden shrink-0">
                  {item.poster && item.poster !== "N/A" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.poster} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface text-sm font-medium truncate">
                    {item.title}
                  </p>
                  {item.year && (
                    <p className="text-on-surface-variant text-xs">{item.year}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="text-on-surface-variant text-xs text-center mt-8">
          Made with{" "}
          <Link href="/" className="text-primary no-underline">
            vcinema
          </Link>
        </p>
      </div>
    </div>
  );
}
