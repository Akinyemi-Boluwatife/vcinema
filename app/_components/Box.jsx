export default function Box({ children }) {
  return (
    <div className="rounded-xl bg-surface-low overflow-auto">
      {children}
    </div>
  );
}
