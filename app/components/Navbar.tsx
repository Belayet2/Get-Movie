"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getAllMovies } from "../services/movieService";
import { useMovies } from "../hooks/useMovies";
import MovieRecommendations from "./MovieRecommendations";
import { Movie } from "../types/movie";
import RecommendMovieButton from "./RecommendMovieButton";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { movies: allMovies, error, refetch } = useMovies();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch movies from Firebase
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const moviesData = await getAllMovies();
        setMovies(moviesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (!mounted) return false;
    return pathname === path;
  };

  // Handle clicking outside of search
  useEffect(() => {
    if (!mounted) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowRecommendations(false);
        setIsFocused(false);
        if (searchQuery === "") {
          setShowSearch(false);
        }
      }

      // Close mobile menu when clicking outside
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchQuery, isMenuOpen, mounted]);

  // Close mobile menu on route change
  useEffect(() => {
    if (!mounted) return;
    setIsMenuOpen(false);
  }, [pathname, mounted]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowRecommendations(true);
  };

  // Handle movie selection from recommendations
  // In Navbar.tsx, update handleSelectMovie
  const handleSelectMovie = async (movie: Movie) => {
    setSearchQuery("");
    setShowRecommendations(false);
    setShowSearch(false);
    setIsFocused(false);
    setIsMenuOpen(false);

    if (movie.slug) {
      router.push(`/movies/${movie.slug}`);
    } else {
      router.push(`/movies?search=${encodeURIComponent(movie.title)}`);
    }
  };

  // If not mounted yet (server-side), render a simpler version
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo/movie-logo.png"
                  alt="Getmovie Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-blue-600 dark:text-blue-400 text-xl md:text-2xl font-bold">
                  Getmovie
                </span>
              </Link>
            </div>

            {/* Static Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                Movies
              </Link>
              <Link
                href="/about/"
                className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                About
              </Link>
            </div>

            {/* Mobile Menu Button (static) */}
            <div className="md:hidden">
              <button className="text-gray-600 dark:text-gray-300 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/movie-logo.png"
                alt="Getmovie Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-blue-600 dark:text-blue-400 text-xl md:text-2xl font-bold">
                Getmovie
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className={`${isActive("/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  } 
                  px-3 py-2 rounded-md font-medium`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`${isActive("/movies")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  } 
                  px-3 py-2 rounded-md font-medium`}
              >
                Movies
              </Link>
              <Link
                href="/about/"
                className={`${isActive("/about") || isActive("/about/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  } 
                  px-3 py-2 rounded-md font-medium`}
              >
                About
              </Link>
            </div>

            {/* Dark Mode Toggle - Desktop */}
            <div className="mr-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                    />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Desktop Search */}
            <div className="relative z-30" ref={searchInputRef}>
              {showSearch ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className={`w-80 pl-10 pr-10 py-2 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                      ${isFocused
                        ? "border-blue-500 shadow-lg dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30"
                        : "border-gray-200 dark:border-gray-700"
                      }`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      setShowRecommendations(true);
                      setIsFocused(true);
                    }}
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className={`w-5 h-5 ${isFocused ? "text-blue-500" : "text-gray-400"
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

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
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
                    ) : (
                      <button
                        onClick={() => setShowSearch(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
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
                    )}
                  </div>

                  {/* Movie Recommendations */}
                  {showRecommendations && !isLoading && (
                    <div className="absolute mt-2 w-[550px] right-0 transform-gpu transition-all duration-200 ease-in-out">
                      {searchQuery.trim().length > 0 && !isLoading && (
                        <div className="mt-3">
                          <RecommendMovieButton
                            searchQuery={searchQuery}
                            movies={allMovies}
                          />
                        </div>
                      )}
                      <MovieRecommendations
                        searchQuery={searchQuery}
                        movies={movies}
                        onSelectMovie={handleSelectMovie}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  aria-label="Search"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="ml-1 text-sm hidden sm:inline">Search</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center md:hidden">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                  />
                </svg>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 md:hidden bg-white dark:bg-gray-800 pt-16"
        >
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4 relative" ref={searchInputRef}>
              <input
                type="text"
                placeholder="Search movies..."
                className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                  ${isFocused
                    ? "border-blue-500 shadow-lg dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30"
                    : "border-gray-200 dark:border-gray-700"
                  }`}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  setShowRecommendations(true);
                  setIsFocused(true);
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className={`w-5 h-5 ${isFocused ? "text-blue-500" : "text-gray-400"
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

              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
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
                )}
              </div>

              {/* Mobile Movie Recommendations */}
              {showRecommendations && !isLoading && (
                <div className="mt-2 transform-gpu transition-all duration-200 ease-in-out">
                  <MovieRecommendations
                    searchQuery={searchQuery}
                    movies={movies}
                    onSelectMovie={handleSelectMovie}
                  />
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {/* Dark Mode Toggle - Mobile Menu */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-lg font-medium text-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span>Dark Mode</span>
                <button
                  onClick={toggleTheme}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
                  aria-label="Toggle dark mode"
                >
                  <div className="relative w-12 h-6 transition-colors duration-300 rounded-full"
                    style={{ backgroundColor: isDarkMode ? '#4F46E5' : '#D1D5DB' }}
                  >
                    <div
                      className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300"
                      style={{ transform: isDarkMode ? 'translateX(24px)' : 'translateX(0)' }}
                    ></div>
                  </div>
                </button>
              </div>
              
              <Link
                href="/"
                className={`${isActive("/")
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } 
                  block px-4 py-3 rounded-lg font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`${isActive("/movies")
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } 
                  block px-4 py-3 rounded-lg font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/about/"
                className={`${isActive("/about") || isActive("/about/")
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } 
                  block px-4 py-3 rounded-lg font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
