"use client";

import { useState, useEffect, useMemo } from "react";
import { Movie } from "../types/movie";
import Link from "next/link";
import Image from "next/image";

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
        score += genreMatches * 15;
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

  if (!mounted || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-2">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 px-3 py-2 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Are You Looking For
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {recommendations.map((movie, index) => (
            <li key={movie.id}>
              <button
                onClick={() => onSelectMovie(movie)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3
                  ${
                    highlightedIndex === index
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0 shadow-sm relative">
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
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium truncate ${
                      highlightedIndex === index
                        ? "text-indigo-700 dark:text-indigo-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {movie.title}{" "}
                    <span className="text-xs text-gray-500">#{movie.id}</span>
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-2">{movie.year}</span>
                    <span className="flex items-center">
                      <svg
                        className="w-3 h-3 text-yellow-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {movie.genres.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                    {movie.genres.length > 2 && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        +{movie.genres.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                {highlightedIndex === index && (
                  <div className="text-indigo-500 dark:text-indigo-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
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
