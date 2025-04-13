"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

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

      // Redirect to thank you page
      router.push(`/thank-you?movie=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error recommending movie:", error);
      setIsRecommending(false);
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <div className="w-full my-3">
      <div className="mb-2 text-center text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">Can't find "{searchQuery}"?</span> We'll add it to our collection!
      </div>
      <button
        onClick={handleRecommendMovie}
        disabled={isRecommending}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
          ${
            isRecommending
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800"
          }
        `}
      >
        {isRecommending ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            Adding to our collection...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg 
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                clipRule="evenodd"
              />
            </svg>
            Recommend "{searchQuery}" to Our Collection
          </span>
        )}
      </button>
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        Help us grow our movie database! Your recommendations matter.
      </div>
    </div>
  );
}