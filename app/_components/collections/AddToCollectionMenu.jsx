"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/_components/ui/Button";
import { listMyCollections, createCollection, addItem } from "@/_lib/collections";

export default function AddToCollectionMenu({ movie, movieId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    if (collections === null) {
      listMyCollections().then((list) => setCollections(list));
    }
  }

  function snapshot() {
    return {
      imdbID: movieId,
      title: movie.Title,
      poster: movie.Poster,
      year: movie.Year,
    };
  }

  function handleAdd(collectionId, collectionTitle) {
    startTransition(async () => {
      try {
        await addItem(collectionId, snapshot());
        setStatus(`Added to "${collectionTitle}"`);
        setTimeout(() => setStatus(""), 2000);
        setOpen(false);
        router.refresh();
      } catch (e) {
        setStatus(e.message || "Could not add");
      }
    });
  }

  function handleCreateAndAdd() {
    const t = newTitle.trim();
    if (!t) return;
    startTransition(async () => {
      try {
        const id = await createCollection({ title: t });
        await addItem(id, snapshot());
        setStatus(`Added to "${t}"`);
        setTimeout(() => setStatus(""), 2000);
        setNewTitle("");
        setCreating(false);
        setOpen(false);
        setCollections(null);
        router.refresh();
      } catch (e) {
        setStatus(e.message || "Could not create");
      }
    });
  }

  return (
    <div className="bg-surface-low rounded-xl border border-outline-variant/30 p-4 mt-4 flex flex-col gap-3">
      <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest text-center">
        Add to a collection
      </h2>

      {!open ? (
        <Button
          variant="secondary"
          onClick={handleOpen}
          className="w-full rounded-xl py-3 text-sm"
        >
          + Add to collection
        </Button>
      ) : (
        <>
          {collections === null ? (
            <p className="text-on-surface-variant text-xs text-center py-2">Loading…</p>
          ) : (
            <div className="flex flex-col gap-2">
              {collections.length === 0 && !creating && (
                <p className="text-on-surface-variant text-xs text-center py-2">
                  You don't have any collections yet.
                </p>
              )}
              {collections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleAdd(c.id, c.title)}
                  disabled={isPending}
                  className="flex items-center justify-between text-left bg-surface-high hover:bg-surface-variant rounded-lg px-3 py-2 border border-outline-variant/30 cursor-pointer disabled:opacity-50"
                >
                  <span className="text-on-surface text-sm truncate">{c.title}</span>
                  <span className="text-on-surface-variant text-xs ml-2 shrink-0">
                    {c.itemCount} films
                  </span>
                </button>
              ))}

              {creating ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New collection title"
                    maxLength={120}
                    disabled={isPending}
                    className="bg-surface-low text-on-surface text-sm rounded-lg px-3 py-2 border border-outline-variant/40 outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleCreateAndAdd}
                      disabled={isPending || !newTitle.trim()}
                      className="flex-1 rounded-xl py-2 text-sm"
                    >
                      {isPending ? "Saving…" : "Create & add"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCreating(false);
                        setNewTitle("");
                      }}
                      disabled={isPending}
                      className="rounded-xl py-2 px-4 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  disabled={isPending}
                  className="text-primary text-xs text-center bg-transparent border-none cursor-pointer hover:underline disabled:opacity-50"
                >
                  + New collection
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="text-on-surface-variant hover:text-on-surface text-xs text-center bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            Close
          </button>
        </>
      )}

      {status && (
        <p className="text-on-surface-variant text-xs text-center">{status}</p>
      )}
    </div>
  );
}
