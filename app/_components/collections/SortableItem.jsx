"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { GripVertical, X } from "lucide-react";

export default function SortableItem({ item, index, onRemove, isPending }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.imdbID });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card rounded-md border border-border hover:border-primary transition-colors"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing bg-transparent border-0 p-0 touch-none inline-flex items-center"
      >
        <GripVertical className="size-4" />
      </button>

      {typeof index === "number" && (
        <span className="text-[11px] text-muted-foreground font-mono w-6 text-right">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <Link
        href={`/movieDetails/${item.imdbID}`}
        className="flex items-center gap-3 flex-1 min-w-0 no-underline"
      >
        <div className="w-9 shrink-0">
          <div className="poster rounded-sm">
            {item.poster && item.poster !== "N/A" ? (
              <img src={item.poster} alt="" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm truncate">{item.title}</p>
          {item.year && (
            <p className="text-muted-foreground text-xs mt-0.5">{item.year}</p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onRemove(item.imdbID)}
        disabled={isPending}
        aria-label="Remove"
        className="icon-btn disabled:opacity-50"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
