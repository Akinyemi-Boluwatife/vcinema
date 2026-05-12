import Spinner from './ui/Spinner';

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 py-16">
      <Spinner size="md" />
      <p className="text-on-surface-variant text-sm">Loading...</p>
    </div>
  );
}
