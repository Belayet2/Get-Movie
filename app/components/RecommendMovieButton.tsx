"use client";

import { useState, useEffect } from "react";
import { Movie } from "../types/movie";
import { addMovie } from "../services/movieService";

interface RecommendMovieButtonProps {
  searchQuery: string;
  movies: Movie[];
}

export default function RecommendMovieButton({
  searchQuery,
  movies,
}: RecommendMovieButtonProps) {
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Check if we should show the button (when there's no exact match)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowButton(false);
      return;
    }

    // Check if there's an exact match for the search query
    const exactMatch = movies.some(
      (movie) => movie.title.toLowerCase() === searchQuery.toLowerCase()
    );

    // Only show the button if there's no exact match
    setShowButton(!exactMatch);
  }, [searchQuery, movies]);

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

  if (!showButton) {
    return null;
  }

  return (
    <div className="w-full">
      {recommendSuccess ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-green-600 dark:text-green-400 font-medium text-sm">
            Thank you! We've added "{searchQuery}" to our pending list.
          </p>
        </div>
      ) : (
        <button
          onClick={handleRecommendMovie}
          disabled={isRecommending}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200
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
                className="w-4 h-4 mr-2"
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
              Recommend "{searchQuery}"
            </span>
          )}
        </button>
      )}
    </div>
  );
}
