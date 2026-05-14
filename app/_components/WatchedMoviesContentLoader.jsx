function WatchedMoviesContentLoader() {
  return (
    <div className="animate-pulse flex flex-col gap-4 mt-4">
      <div className="h-4 bg-surface-variant rounded w-24" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-16 bg-surface-variant rounded-xl" />
      ))}
    </div>
  );
}

export default WatchedMoviesContentLoader;
