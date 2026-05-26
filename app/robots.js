export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/c/", "/u/"],
        disallow: [
          "/signin",
          "/forgot-password",
          "/reset-password",
          "/auth/",
          "/profile",
          "/settings",
          "/lists/",
          "/watchedMovies",
          "/movieDetails/",
          "/searchMovies",
          "/stats",
        ],
      },
    ],
  };
}
