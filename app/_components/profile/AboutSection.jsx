import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="mt-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 id="about-heading" className="text-base font-medium text-foreground">
            About
          </h2>

          <div className="space-y-2">
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img src="/tmdb-logo.svg" alt="TMDB" width={88} height={11} />
            </a>
            <p className="text-sm text-muted-foreground">
              Trending and popular films come from The Movie Database. This product
              uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>

          <Separator />

          <p className="text-sm text-muted-foreground">
            Film details and ratings come from{" "}
            <a
              href="https://www.omdbapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              OMDb
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
