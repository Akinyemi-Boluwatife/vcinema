import Spinner from "@/_components/ui/Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-3">
      <Spinner size="lg" />
      <p className="text-on-surface-variant text-sm">Loading list…</p>
    </div>
  );
}
