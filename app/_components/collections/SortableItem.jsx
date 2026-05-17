"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { HiBars3, HiTrash } from "react-icons/hi2";

export default function SortableItem({ item, onRemove, isPending }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.imdbID });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-2 bg-surface-high rounded-lg border border-outline-variant/30"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="text-on-surface-variant hover:text-on-surface cursor-grab active:cursor-grabbing bg-transparent border-none p-1 touch-none"
      >
        <HiBars3 className="text-lg" />
      </button>

      <Link
        href={`/movieDetails/${item.imdbID}`}
        className="flex items-center gap-3 flex-1 min-w-0 no-underline"
      >
        <div className="w-10 h-14 bg-surface-variant rounded overflow-hidden shrink-0">
          {item.poster && item.poster !== "N/A" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.poster} alt="" className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-on-surface text-sm font-medium truncate">{item.title}</p>
          {item.year && (
            <p className="text-on-surface-variant text-xs">{item.year}</p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onRemove(item.imdbID)}
        disabled={isPending}
        aria-label="Remove"
        className="text-on-surface-variant hover:text-error bg-transparent border-none p-1 disabled:opacity-50 cursor-pointer"
      >
        <HiTrash className="text-lg" />
      </button>
    </div>
  );
}
