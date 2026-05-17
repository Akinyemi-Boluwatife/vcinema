"use client";
import { useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
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

const todayISO = (() => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
})();

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

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-on-surface-variant hover:text-on-surface ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <span>Watched {formatDisplay(watchedAt)}</span>
        <HiPencilSquare className="text-[0.95em] opacity-70" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value}
          max={todayISO}
          onChange={(e) => setValue(e.target.value)}
          disabled={isPending}
          className="bg-surface-low text-on-surface text-sm rounded-lg px-3 py-2 border border-outline-variant/40 outline-none focus:border-primary disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="bg-primary text-on-primary text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="text-on-surface-variant hover:text-on-surface text-xs bg-transparent border-none cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
