"use client";

import { useState, useEffect, useMemo } from "react";
import { Movie } from "../types/movie";
import Link from "next/link";
import Image from "next/image";
import { addMovie } from "../services/movieService";

interface MovieRecommendationsProps {
  searchQuery: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieRecommendations({
  searchQuery,
  movies,
  onSelectMovie,
}: MovieRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);

  // Memoize movies to prevent unnecessary re-renders
  const moviesList = useMemo(() => movies, [movies]);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || searchQuery.length < 1) {
      setRecommendations([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    // Handle numeric searches (e.g., "movie 45")
    const numericMatch = query.match(/(\d+)/);
    const hasNumericPart = numericMatch !== null;
    const numericValue = hasNumericPart ? parseInt(numericMatch[0]) : -1;

    // Improved scoring for better performance and accuracy
    const scoredMovies = moviesList.map((movie) => {
      let score = 0;
      const movieTitle = movie.title.toLowerCase();
      const movieId = movie.id;

      // Exact title match
      if (movieTitle === query) {
        score += 100;
      }
      // Title starts with query
      else if (movieTitle.startsWith(query)) {
        score += 80;
      }
      // Title contains query as a whole word
      else if (new RegExp(`\\b${query}\\b`, "i").test(movieTitle)) {
        score += 60;
      }
      // Title contains query
      else if (movieTitle.includes(query)) {
        score += 40;
      }

      // Handle numeric searches - match movie ID or any number in the title
      if (hasNumericPart) {
        // Direct ID match
        if (movieId === numericValue) {
          score += 90;
        }

        // Check if the movie title contains the same numeric part
        if (movieTitle.includes(numericMatch[0])) {
          score += 70;
        }

        // Special case for "movie X" format
        if (query.includes("movie") && movieId === numericValue) {
          score += 95;
        }

        // Year match
        if (movie.year && movie.year.includes(numericMatch[0])) {
          score += 50;
        }
      }

      // Check for word boundary matches (more precise than simple includes)
      const words = query.split(/\s+/);
      for (const word of words) {
        if (word.length > 1) {
          // Match at word boundaries
          const wordBoundaryRegex = new RegExp(`\\b${word}\\b`, "i");
          if (wordBoundaryRegex.test(movieTitle)) {
            score += 50;
          }
        }
      }

      // Genre matches
      const genreMatches = movie.genres.filter((genre) =>
        genre.toLowerCase().includes(query)
      ).length;

      if (genreMatches > 0) {
        score += genreMatches * 20;
      }

      // Director match
      if (movie.director && movie.director.toLowerCase().includes(query)) {
        score += 40;
      }

      // Stars match
      if (movie.stars) {
        const starMatches = movie.stars.filter((star) =>
          star.toLowerCase().includes(query)
        ).length;

        if (starMatches > 0) {
          score += starMatches * 30;
        }
      }

      return { movie, score };
    });

    // Filter out movies with zero relevance and sort by score
    const filteredAndSorted = scoredMovies
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.movie)
      .slice(0, 5); // Limit to 5 recommendations

    // If no results but we have a numeric query, try to find movies by ID
    if (filteredAndSorted.length === 0 && hasNumericPart) {
      const idMatches = moviesList
        .filter((movie) => movie.id.toString().includes(numericMatch[0]))
        .slice(0, 5);

      if (idMatches.length > 0) {
        setRecommendations(idMatches);
        setHighlightedIndex(-1);
        return;
      }
    }

    setRecommendations(filteredAndSorted);
    setHighlightedIndex(-1);
  }, [searchQuery, moviesList, mounted]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!recommendations.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < recommendations.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : recommendations.length - 1
          );
          break;
        case "Enter":
          if (highlightedIndex >= 0) {
            onSelectMovie(recommendations[highlightedIndex]);
          }
          break;
        case "Escape":
          setRecommendations([]);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [recommendations, highlightedIndex, onSelectMovie, mounted]);

  if (!mounted) {
    return null;
  }

  // Handle recommending a movie that's not in our database
  const handleRecommendMovie = async () => {
    try {
      setIsRecommending(true);

      // Create a basic movie object with the search query as the title
      const newMovie: Omit<Movie, "firestoreId" | "slug"> = {
        id: Date.now(), // Temporary ID
        title: searchQuery.trim(),
        posterPath: "/images/placeholders/default-movie.jpg",
        rating: 0,
        year: new Date().getFullYear().toString(), // Current year as default
        genres: [],
        status: "pending",
        pendingType: "user",
      };

      // Add the movie to Firestore
      await addMovie(newMovie, undefined, "user");

      // Show success message
      setRecommendSuccess(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setRecommendSuccess(false);
        setIsRecommending(false);
      }, 3000);
    } catch (error) {
      console.error("Error recommending movie:", error);
      setIsRecommending(false);
    }
  };

  // If we have recommendations, show them
  if (recommendations.length > 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            Are You Looking For
          </h3>
          <div className="space-y-3">
            {recommendations.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`cursor-pointer p-3 rounded-lg flex items-start gap-4 transition-all duration-200
                  ${
                    highlightedIndex === index
                      ? "bg-indigo-50 dark:bg-indigo-900/20 transform scale-[1.01] shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-750"
                  }`}
              >
                <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 shadow-sm relative group">
                  <Image
                    src={
                      movie.posterPath &&
                      (movie.posterPath.startsWith("http") ||
                        movie.posterPath.startsWith("/"))
                        ? movie.posterPath
                        : "/images/placeholders/default-movie.jpg"
                    }
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                  {highlightedIndex === index && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                        <svg
                          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-base ${
                      highlightedIndex === index
                        ? "text-indigo-700 dark:text-indigo-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {movie.title}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="mr-3">{movie.year}</span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating}
                    </span>
                    {movie.runtime && (
                      <span className="ml-3 flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {movie.runtime}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          highlightedIndex === index
                            ? "bg-indigo-100 dark:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {genre}
                      </span>
                    ))}
                    {movie.genres.length > 3 && (
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          highlightedIndex === index
                            ? "bg-indigo-100 dark:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        +{movie.genres.length - 3}
                      </span>
                    )}
                  </div>
                  {movie.director && highlightedIndex === index && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                      <span className="font-medium">Director:</span>{" "}
                      {movie.director}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-indigo-500 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Pro tip: Use ↑↓ arrows to navigate and Enter to select
          </div>
        </div>
      </div>
    );
  }

  // If search query exists but no recommendations found, show the recommend button
  if (searchQuery.trim().length > 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            No Movies Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't find "{searchQuery}" in our database.
          </p>

          {recommendSuccess ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-green-600 dark:text-green-400 font-medium">
                Thank you! We've added your movie recommendation to our pending
                list.
              </p>
            </div>
          ) : (
            <button
              onClick={handleRecommendMovie}
              disabled={isRecommending}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                ${
                  isRecommending
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                }
              `}
            >
              {isRecommending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recommend Us This Movie
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
