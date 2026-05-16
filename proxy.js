export { auth as proxy } from "./auth-edge";

export const config = {
  matcher: [
    "/searchMovies",
    "/searchMovies/:path*",
    "/watchedMovies",
    "/watchedMovies/:path*",
    "/movieDetails/:path*",
    "/stats",
    "/stats/:path*",
  ],
};
