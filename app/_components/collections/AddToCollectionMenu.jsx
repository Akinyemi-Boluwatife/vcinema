"use client";
import { useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
      return { ...state, open: true };
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
        dispatch({
          type: "SET_STATUS",
          payload: result?.added
            ? `Added to "${collectionTitle}"`
            : `Already in "${collectionTitle}"`,
        });
        setTimeout(() => dispatch({ type: "SET_STATUS", payload: "" }), 2000);
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
        dispatch({ type: "SET_STATUS", payload: `Added to "${t}"` });
        setTimeout(() => dispatch({ type: "SET_STATUS", payload: "" }), 2000);
        dispatch({ type: "RESET_AFTER_CREATE" });
        refresh();
      } catch (e) {
        dispatch({ type: "SET_STATUS", payload: e.message || "Could not create" });
      }
    });
  }

  return (
    <Card className="mt-4 max-w-2xl">
      <CardContent className="space-y-3">
        <div className="text-micro">Add to a collection</div>

        {!open ? (
          <Button variant="outline" onClick={handleOpen} className="h-10">
            <Plus className="size-4" /> Add to collection
          </Button>
        ) : (
          <>
            {collections === null ? (
              <p className="text-muted-foreground text-xs text-center py-2">
                Loading…
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {collections.length === 0 && !creating && (
                  <p className="text-muted-foreground text-xs text-center py-2">
                    You don&apos;t have any collections yet.
                  </p>
                )}
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAdd(c.id, c.title)}
                    disabled={isPending}
                    className="flex items-center justify-between text-left bg-muted/40 hover:bg-muted rounded-md px-3 py-2 border border-border cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <span className="text-foreground text-sm truncate">
                      {c.title}
                    </span>
                    <span className="text-muted-foreground text-xs ml-2 shrink-0">
                      {c.itemCount} films
                    </span>
                  </button>
                ))}

                {creating ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={newTitle}
                      onChange={(e) =>
                        dispatch({ type: "SET_NEW_TITLE", payload: e.target.value })
                      }
                      placeholder="New collection title"
                      maxLength={120}
                      disabled={isPending}
                      className="h-10"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateAndAdd}
                        disabled={isPending || !newTitle.trim()}
                        className="flex-1 h-9"
                      >
                        {isPending ? "Saving…" : "Create & add"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => dispatch({ type: "CANCEL_CREATING" })}
                        disabled={isPending}
                        className="h-9"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
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
                )}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "CLOSE" })}
              disabled={isPending}
            >
              Close
            </Button>
          </>
        )}

        {status && (
          <p className="text-muted-foreground text-xs">{status}</p>
        )}
      </CardContent>
    </Card>
  );
}
