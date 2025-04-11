"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMovieBySlug, incrementMovieViewCount } from "../../services/movieService";
import { Movie } from "../../types/movie";

// Calculate color based on rating
const getRatingColor = (rating: number) => {
  if (rating >= 8.5) return "bg-emerald-500";
  if (rating >= 7) return "bg-blue-500";
  if (rating >= 5.5) return "bg-amber-500";
  return "bg-red-500";
};

// Add global error handler to catch 404 errors
if (typeof window !== "undefined") {
  window.addEventListener(
    "error",
    function (event) {
      if (event.target && "src" in event.target && event.target.src) {
        console.error("Resource failed to load:", event.target.src);
      }
    },
    true
  );

  // Add a global unhandled rejection handler
  window.addEventListener("unhandledrejection", function (event) {
    console.error("Unhandled promise rejection:", event.reason);
  });
}

export default function MovieDetailClient({ slug }: { slug: string }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        let actualSlug = slug;
        if (typeof window !== "undefined") {
          const pathParts = window.location.pathname.split("/");
          const moviesIndex = pathParts.findIndex((part) => part === "movies");
          if (moviesIndex >= 0 && moviesIndex < pathParts.length - 1) {
            actualSlug = pathParts[moviesIndex + 1];
          }
        }

        const movieData = await getMovieBySlug(actualSlug);

        if (movieData) {
          setMovie(movieData);
        } else {
          setError("Movie not found");
          if (retryCount < 3 && window.location.hostname !== "localhost") {
            setRetryCount((prev) => prev + 1);
            setTimeout(() => {
              setLoading(true);
              setError(null);
            }, 1000);
          }
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Error loading movie details");
        if (retryCount < 3 && window.location.hostname !== "localhost") {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            setLoading(true);
            setError(null);
          }, 1000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug, retryCount]);

  // const handleGetLinks = async (e: React.MouseEvent) => {
  //   e.preventDefault();

  //   // Increment view count when Get Links button is clicked
  //   try {
  //     await incrementMovieViewCount(slug);
  //   } catch (error) {
  //     console.error("Error incrementing view count:", error);
  //   }

  //   // window.location.href = `/movies/${slug}`;
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/movies"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Movies
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/3 lg:w-1/4 relative">
              <div className="h-96 md:h-full w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/4 mb-6"></div>
              <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-24"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Movie Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn&apos;t find the movie you&apos;re looking for.
          </p>
          <Link
            href="/movies"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Browse All Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/movies"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Movies
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Movie poster */}
          <div className="md:w-1/3 lg:w-1/4 relative">
            <div className="relative h-96 md:h-full w-full">
              <Image
                src={
                  movie.posterPath || "/images/placeholders/default-movie.jpg"
                }
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
              <div
                className={`absolute top-4 right-4 ${getRatingColor(
                  movie.rating
                )} text-white font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10 text-lg`}
              >
                {movie.rating.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Movie info */}
          <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">
              {movie.year}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Site Information Section */}
            {movie.siteInfo && movie.siteInfo.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                  Available On
                </h2>
                <div className="space-y-4">
                  {movie.siteInfo.map((site, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                          {site.siteName}
                        </h3>
                        {/* <Link
                          onClick={handleGetLinks}
                          href={`${site.siteLink.startsWith("http")
                            ? site.siteLink
                            : `https://${site.siteLink}`
                            }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Visit Site
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </Link> */}

                        <a
                          href={site.siteLink.startsWith("http") ? site.siteLink : `https://${site.siteLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={async (e) => {
                            console.log("Incrementing view for:", slug);
                            try {
                              await incrementMovieViewCount(slug);
                              console.log("View increment success");
                            } catch (err) {
                              console.error("Failed to increment view count", err);
                            }
                          }}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Visit Site
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {site.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-sm px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
