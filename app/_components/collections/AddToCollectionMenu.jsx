"use client";
import { useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/_components/ui/Toaster";
import {
  listMyCollections,
  createCollection,
  addItem,
} from "@/_lib/collections";

const INITIAL_STATE = {
  open: false,
  collections: null,
  creating: false,
  newTitle: "",
  status: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true, status: "" };
    case "CLOSE":
      return { ...state, open: false };
    case "SET_COLLECTIONS":
      return { ...state, collections: action.payload };
    case "START_CREATING":
      return { ...state, creating: true };
    case "CANCEL_CREATING":
      return { ...state, creating: false, newTitle: "" };
    case "SET_NEW_TITLE":
      return { ...state, newTitle: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "RESET_AFTER_CREATE":
      return { ...state, newTitle: "", creating: false, open: false, collections: null };
    default:
      return state;
  }
}

export default function AddToCollectionMenu({ movie, movieId }) {
  const { refresh } = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { open, collections, creating, newTitle, status } = state;
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    dispatch({ type: "OPEN" });
    if (collections === null) {
      listMyCollections().then((list) =>
        dispatch({ type: "SET_COLLECTIONS", payload: list }),
      );
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
        const result = await addItem(collectionId, snapshot());
        toast(
          result?.added
            ? `Added to "${collectionTitle}"`
            : `Already in "${collectionTitle}"`,
        );
        dispatch({ type: "CLOSE" });
        refresh();
      } catch (e) {
        dispatch({ type: "SET_STATUS", payload: e.message || "Could not add" });
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
        toast(`Added to "${t}"`);
        dispatch({ type: "RESET_AFTER_CREATE" });
        refresh();
      } catch (e) {
        dispatch({ type: "SET_STATUS", payload: e.message || "Could not create" });
      }
    });
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className="h-10"
      >
        <FolderPlus className="size-4" /> Add to collection
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => dispatch({ type: v ? "OPEN" : "CLOSE" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to a collection</DialogTitle>
            <DialogDescription>{movie.Title}</DialogDescription>
          </DialogHeader>

          {collections === null ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Loading…
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {collections.length === 0 && !creating && (
                <p className="text-muted-foreground text-sm text-center py-2">
                  You don&apos;t have any collections yet.
                </p>
              )}
              {collections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleAdd(c.id, c.title)}
                  disabled={isPending}
                  className="flex min-h-11 items-center justify-between text-left bg-muted/40 hover:bg-muted rounded-lg px-3 py-2 border border-border cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <span className="text-foreground text-sm truncate">
                    {c.title}
                  </span>
                  <span className="text-muted-foreground text-xs ml-2 shrink-0">
                    {c.itemCount} films
                  </span>
                </button>
              ))}
            </div>
          )}

          {collections !== null &&
            (creating ? (
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateAndAdd();
                }}
              >
                <Input
                  value={newTitle}
                  onChange={(e) =>
                    dispatch({ type: "SET_NEW_TITLE", payload: e.target.value })
                  }
                  placeholder="New collection title"
                  maxLength={120}
                  disabled={isPending}
                  autoFocus
                  className="h-10"
                />
                <Button
                  type="submit"
                  disabled={isPending || !newTitle.trim()}
                  className="h-10"
                >
                  {isPending ? "Saving…" : "Create"}
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: "START_CREATING" })}
                disabled={isPending}
                className="self-start"
              >
                <Plus className="size-3" /> New collection
              </Button>
            ))}

          {status && (
            <p className="text-destructive text-xs">{status}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
