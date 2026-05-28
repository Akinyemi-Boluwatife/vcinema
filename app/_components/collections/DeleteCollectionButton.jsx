"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteCollection } from "@/_lib/collections";

export default function DeleteCollectionButton({ collectionId }) {
  const { push } = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCollection(collectionId);
        push("/lists");
      } catch (e) {
        setError(e.message || "Could not delete this collection.");
      }
    });
  }

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        onClick={() => setConfirming(true)}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
        Delete collection
      </Button>
    );
  }

  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="space-y-3">
        <div>
          <p className="text-base font-medium text-foreground mb-1">
            Delete this collection?
          </p>
          <p className="text-sm text-muted-foreground">This can&apos;t be undone.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4" />
            {isPending ? "Deleting…" : "Yes, delete"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setConfirming(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </CardContent>
    </Card>
  );
}
