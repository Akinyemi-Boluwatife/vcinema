import Spinner from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 min-h-[50vh]">
      <Spinner size="lg" />
      <p className="text-on-surface-variant text-sm">Loading...</p>
    </div>
  );
}
