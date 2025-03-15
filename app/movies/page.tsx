"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";
import GenreFilter from "../components/GenreFilter";
import MovieRecommendations from "../components/MovieRecommendations";
import RecommendMovieButton from "../components/RecommendMovieButton";
import { useMovies } from "../hooks/useMovies";
import { Movie } from "../types/movie";

function MoviesContent() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams
    ? searchParams.get("search") || ""
    : "";

  const { movies: allMovies, loading: isLoading, error, refetch } = useMovies();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeCardTitle, setActiveCardTitle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract all unique genres when movies change
  useEffect(() => {
    if (allMovies.length > 0) {
      // Extract all unique genres
      const genres = Array.from(
        new Set(allMovies.flatMap((movie) => movie.genres))
      ).sort();
      setAllGenres(genres);
    }
  }, [allMovies]);

  // Force refetch when the component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  // Set initial search query after component mounts (client-side only)
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Filter movies based on selected genres and search query
  useEffect(() => {
    if (allMovies.length === 0) return;

    let result = allMovies;

    // Filter by selected genres
    if (selectedGenres.length > 0) {
      result = result.filter((movie) =>
        selectedGenres.some((genre) => movie.genres.includes(genre))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();

      // Check for numeric patterns in the search query
      const numericMatch = query.match(/(\d+)/);
      const hasNumericPart = numericMatch !== null;

      if (hasNumericPart) {
        const numericValue = parseInt(numericMatch[0]);

        // Special case for "movie X" format
        if (query.includes("movie") && numericMatch) {
          const exactIdMatch = result.filter(
            (movie) => movie.id === numericValue
          );
          if (exactIdMatch.length > 0) {
            result = exactIdMatch;
          } else {
            // If no exact match, look for movies with IDs containing the number
            result = result.filter(
              (movie) =>
                movie.id.toString().includes(numericMatch[0]) ||
                movie.title.toLowerCase().includes(query)
            );
          }
        } else {
          // General numeric search
          result = result.filter(
            (movie) =>
              movie.id === numericValue ||
              movie.id.toString().includes(numericMatch[0]) ||
              movie.title.toLowerCase().includes(query) ||
              movie.year.includes(numericMatch[0])
          );
        }
      } else {
        // Standard text search
        result = result.filter(
          (movie) =>
            movie.title.toLowerCase().includes(query) ||
            movie.genres.some((genre) => genre.toLowerCase().includes(query))
        );
      }
    }

    setFilteredMovies(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedGenres, searchQuery, allMovies]);

  // Get current page movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle genre selection
  const handleGenreSelect = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Handle clear all genres
  const handleClearAllGenres = () => {
    setSelectedGenres([]);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Always show recommendations when there's text, even if it's just one character
    setShowRecommendations(e.target.value.length > 0);
  };

  // Handle clicking outside of search and recommendations
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        // Don't hide recommendations when clicking outside anymore
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle movie selection from recommendations
  const handleSelectMovie = (movie: Movie) => {
    setSearchQuery(movie.title);
    setShowRecommendations(false);

    // Navigate to the movie detail page using the slug
    if (movie.slug) {
      window.location.href = `/movies/${movie.slug}`;
    } else {
      // If no slug is available, just select the genres
      setSelectedGenres(movie.genres);
    }
  };

  // Initialize with search params if present
  useEffect(() => {
    if (initialSearchQuery && allMovies.length > 0) {
      // Find if there's a movie that exactly matches the search query
      const exactMatch = allMovies.find(
        (movie) =>
          movie.title.toLowerCase() === initialSearchQuery.toLowerCase()
      );

      if (exactMatch) {
        // If there's an exact match, also select its genres
        setSelectedGenres(exactMatch.genres);
      } else {
        // Check for numeric patterns in the search query
        const numericMatch = initialSearchQuery.match(/(\d+)/);
        if (numericMatch) {
          const numericValue = parseInt(numericMatch[0]);
          const idMatch = allMovies.find((movie) => movie.id === numericValue);
          if (idMatch) {
            setSelectedGenres(idMatch.genres);
          }
        }
      }
    }
  }, [initialSearchQuery, allMovies]);

  // Handle card click to ensure only one card is flipped at a time
  const handleCardClick = (title: string) => {
    setActiveCardTitle(title);
  };

  // Show loading state while fetching data
  if (isLoading) {
    return <MoviesLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Movie Collection
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our curated collection of movies across various genres. Use
            the filters below to watch your favorite film fast.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Search Input */}
            <div className="flex-1 relative" ref={searchInputRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className={`w-5 h-5 ${
                      isFocused ? "text-indigo-500" : "text-gray-400"
                    }`}
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
                </div>
                <input
                  type="text"
                  placeholder="Search by title, or genre ..."
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                    ${
                      isFocused
                        ? "border-indigo-500 shadow-lg dark:border-indigo-400 ring-4 ring-indigo-100 dark:ring-indigo-900/30"
                        : "border-gray-200 dark:border-gray-700"
                    } transition-all duration-150`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 transform hover:scale-110 active:scale-95"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  }
                </div>
              </div>

              {/* Quick Recommend Button - Show when there's a search query */}
              {searchQuery.trim().length > 0 && !isLoading && (
                <div className="mt-3">
                  <RecommendMovieButton
                    searchQuery={searchQuery}
                    movies={allMovies}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Genre Filter - Hide when search recommendations are shown */}
          {!showRecommendations && (
            <GenreFilter
              genres={allGenres}
              selectedGenres={selectedGenres}
              onSelectGenre={handleGenreSelect}
              onClearAll={handleClearAllGenres}
            />
          )}
        </div>

        {/* Movie Recommendations - Moving to here, above the results count */}
        {showRecommendations && !isLoading && (
          <div className="mb-6 transform-gpu transition-all duration-200 ease-in-out">
            <MovieRecommendations
              searchQuery={searchQuery}
              movies={allMovies}
              onSelectMovie={handleSelectMovie}
            />
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {Math.min(indexOfFirstMovie + 1, filteredMovies.length)} -{" "}
              {Math.min(indexOfLastMovie, filteredMovies.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {filteredMovies.length}
            </span>{" "}
            movies
            {selectedGenres.length > 0 && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedGenres.join(", ")}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Movies Grid */}
        {currentMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isGridView={true}
                  isActive={activeCardTitle === movie.title}
                  onClick={() => handleCardClick(movie.title)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === number
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No movies found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
            {selectedGenres.length > 0 && (
              <button
                onClick={() => setSelectedGenres([])}
                className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                Clear genre filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function MoviesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<MoviesLoading />}>
      <MoviesContent />
    </Suspense>
  );
}
