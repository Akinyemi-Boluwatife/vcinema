"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { reorderItems, removeItem } from "@/_lib/collections";

export default function EditCollectionClient({ collectionId, initialItems }) {
  const { refresh } = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let prev = null;
    let next = null;
    setItems((current) => {
      const oldIndex = current.findIndex((i) => i.imdbID === active.id);
      const newIndex = current.findIndex((i) => i.imdbID === over.id);
      if (oldIndex < 0 || newIndex < 0) return current;
      prev = current;
      next = arrayMove(current, oldIndex, newIndex);
      return next;
    });

    if (!next) return;

    setError(null);
    startTransition(async () => {
      try {
        await reorderItems(collectionId, next.map((i) => i.imdbID));
        refresh();
      } catch (e) {
        setItems(prev);
        setError(e.message || "Could not save the new order.");
      }
    });
  }

  function handleRemove(imdbID) {
    let prev = null;
    setItems((current) => {
      prev = current;
      return current.filter((i) => i.imdbID !== imdbID);
    });
    setError(null);
    startTransition(async () => {
      try {
        await removeItem(collectionId, imdbID);
        refresh();
      } catch (e) {
        setItems(prev);
        setError(e.message || "Could not remove that item.");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12 px-4">
        <p className="text-base font-medium text-foreground mb-1">
          This collection is empty.
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">
          From any movie page, tap &quot;Add to collection&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.imdbID)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <SortableItem
                key={item.imdbID}
                item={item}
                index={i}
                onRemove={handleRemove}
                isPending={isPending}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
