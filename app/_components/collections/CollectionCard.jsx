import Link from "next/link";

export default function CollectionCard({ collection }) {
  const { id, title, description, itemCount, coverPoster, isPublic } = collection;

  return (
    <Link
      href={`/lists/${id}`}
      className="flex gap-3 p-3 bg-surface-high rounded-lg border border-outline-variant/30 no-underline hover:bg-surface-variant transition-colors"
    >
      <div className="w-14 h-20 bg-surface-variant rounded overflow-hidden shrink-0 flex items-center justify-center">
        {coverPoster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPoster} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🎞️</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-on-surface text-sm font-semibold truncate">{title}</p>
          {isPublic && (
            <span className="bg-primary-container text-on-primary-container text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Public
            </span>
          )}
        </div>
        {description && (
          <p className="text-on-surface-variant text-xs line-clamp-2 mb-1">{description}</p>
        )}
        <p className="text-on-surface-variant text-xs">
          {itemCount} {itemCount === 1 ? "film" : "films"}
        </p>
      </div>
    </Link>
  );
}
