"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateWatchedDate } from "@/_hooks/useUpdateWatchedDate";

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toInputDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplay(iso) {
  if (!iso) return "Not set";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not set";
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function freshTodayISO() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function EditWatchedDate({ imdbID, watchedAt, compact = false }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(toInputDate(watchedAt));
  const { save, isPending, error, clearError } = useUpdateWatchedDate(imdbID);

  async function handleSave() {
    const ok = await save(value);
    if (ok) setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
    setValue(toInputDate(watchedAt));
    clearError();
  }

  function handleEnterEdit() {
    setValue(toInputDate(watchedAt));
    setEditing(true);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={handleEnterEdit}
        className={`inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer text-muted-foreground hover:text-foreground font-mono ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <span>{formatDisplay(watchedAt)}</span>
        <Pencil className="size-3 opacity-70" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          type="date"
          value={value}
          max={freshTodayISO()}
          onChange={(e) => setValue(e.target.value)}
          disabled={isPending}
          className="h-9 w-auto flex-1 min-w-[150px]"
        />
        <Button onClick={handleSave} disabled={isPending} size="sm">
          {isPending ? "Saving…" : "Save"}
        </Button>
        <Button
          variant="ghost"
          onClick={handleCancel}
          disabled={isPending}
          size="sm"
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
