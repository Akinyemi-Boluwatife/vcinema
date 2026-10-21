export default function TmdbAttribution() {
  return (
    <footer className="mt-4 pt-6 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
      <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="shrink-0">
        <img src="/tmdb-logo.svg" alt="TMDB" width={80} height={10} />
      </a>
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  );
}
