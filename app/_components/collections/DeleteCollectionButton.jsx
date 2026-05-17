"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/_components/ui/Button";
import { deleteCollection } from "@/_lib/collections";

export default function DeleteCollectionButton({ collectionId }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteCollection(collectionId);
      router.push("/lists");
    });
  }

  if (!confirming) {
    return (
      <Button
        variant="secondary"
        onClick={() => setConfirming(true)}
        className="w-full rounded-xl py-2 text-sm !text-error !border-error/40 hover:!bg-error/10"
      >
        Delete collection
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-on-surface-variant text-xs text-center">
        Delete this collection and all its items? This cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 rounded-xl py-2 text-sm !text-error !border-error/40 hover:!bg-error/10"
        >
          {isPending ? "Deleting…" : "Yes, delete"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-xl py-2 text-sm px-4"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
