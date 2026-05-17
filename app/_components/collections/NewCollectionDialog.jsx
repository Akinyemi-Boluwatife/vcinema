"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/_components/ui/Button";
import { createCollection } from "@/_lib/collections";

export default function NewCollectionDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setError("");
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    startTransition(async () => {
      try {
        const id = await createCollection({ title, description });
        setOpen(false);
        reset();
        router.push(`/lists/${id}`);
      } catch (e) {
        setError(e.message || "Could not create");
      }
    });
  }

  if (!open) {
    return (
      <Button
        variant="primary"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl py-3 text-sm"
      >
        + New collection
      </Button>
    );
  }

  return (
    <div className="bg-surface-high rounded-xl border border-outline-variant/30 p-4 flex flex-col gap-3">
      <p className="text-on-surface text-sm font-semibold">New collection</p>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Top 10 of All Time"
        maxLength={120}
        disabled={isPending}
        className="bg-surface-low text-on-surface text-sm rounded-lg px-3 py-2 border border-outline-variant/40 outline-none focus:border-primary"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
        maxLength={500}
        rows={2}
        disabled={isPending}
        className="bg-surface-low text-on-surface text-sm rounded-lg px-3 py-2 border border-outline-variant/40 outline-none focus:border-primary resize-none"
      />
      {error && <p className="text-error text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 rounded-xl py-2 text-sm"
        >
          {isPending ? "Creating…" : "Create"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setOpen(false);
            reset();
          }}
          disabled={isPending}
          className="rounded-xl py-2 text-sm px-4"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
