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
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.imdbID === active.id);
    const newIndex = items.findIndex((i) => i.imdbID === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(async () => {
      await reorderItems(
        collectionId,
        next.map((i) => i.imdbID)
      );
      router.refresh();
    });
  }

  function handleRemove(imdbID) {
    const prev = items;
    setItems(items.filter((i) => i.imdbID !== imdbID));
    startTransition(async () => {
      try {
        await removeItem(collectionId, imdbID);
        router.refresh();
      } catch {
        setItems(prev);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <span className="text-5xl">🎞️</span>
        <p className="text-on-surface-variant text-sm text-center px-6">
          This collection is empty. From any movie page, tap "Add to collection".
        </p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => i.imdbID)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableItem
              key={item.imdbID}
              item={item}
              onRemove={handleRemove}
              isPending={isPending}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
