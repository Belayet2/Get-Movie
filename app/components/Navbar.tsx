"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  lazy,
  Suspense,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getAllMovies } from "../services/movieService";
import { Movie } from "../types/movie";

// Lazy load the MovieRecommendations component
const MovieRecommendations = lazy(() => import("./MovieRecommendations"));

// Simple loading fallback
const RecommendationsLoader = () => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </div>
);

const Navbar = memo(function Navbar() {
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

  // Fetch movies from Firebase with debounce
  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        const moviesData = await getAllMovies();
        if (isMounted) {
          setMovies(moviesData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Delay fetching movies until after initial render
    const timer = setTimeout(fetchMovies, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the active state calculation
  const isActive = useMemo(() => {
    return (path: string) => {
      if (!mounted) return false;
      return pathname === path;
    };
  }, [pathname, mounted]);

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

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowRecommendations(true);
  };

  // Handle movie selection from recommendations
  const handleSelectMovie = useMemo(() => {
    return (movie: Movie) => {
      setSearchQuery("");
      setShowRecommendations(false);
      setShowSearch(false);
      setIsFocused(false);
      setIsMenuOpen(false);

      // Navigate to the movie detail page using the slug
      if (movie.slug) {
        router.push(`/movies/${movie.slug}`);
      } else {
        // Fallback to search if no slug is available
        router.push(`/movies?search=${encodeURIComponent(movie.title)}`);
      }
    };
  }, [router]);

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
                  priority
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
              <button
                className="text-gray-600 dark:text-gray-300 focus:outline-none"
                aria-label="Open menu"
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

  // Memoize the recommendations component to prevent unnecessary re-renders
  const recommendationsComponent = useMemo(() => {
    if (!showRecommendations) return null;

    return (
      <Suspense fallback={<RecommendationsLoader />}>
        <MovieRecommendations
          searchQuery={searchQuery}
          movies={movies}
          onSelectMovie={handleSelectMovie}
        />
      </Suspense>
    );
  }, [showRecommendations, searchQuery, movies, handleSelectMovie]);

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
                priority
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
                className={`${
                  isActive("/")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                } 
                  px-3 py-2 rounded-md font-medium`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`${
                  isActive("/movies")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                } 
                  px-3 py-2 rounded-md font-medium`}
              >
                Movies
              </Link>
              <Link
                href="/about/"
                className={`${
                  isActive("/about") || isActive("/about/")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                } 
                  px-3 py-2 rounded-md font-medium`}
              >
                About
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="relative z-30" ref={searchInputRef}>
              {showSearch ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className={`w-80 pl-10 pr-10 py-2 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                      ${
                        isFocused
                          ? "border-blue-500 shadow-lg dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      setIsFocused(true);
                      setShowRecommendations(true);
                    }}
                    aria-label="Search movies"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <button
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchQuery("");
                      setShowRecommendations(false);
                      setShowSearch(false);
                      setIsFocused(false);
                    }}
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  {recommendationsComponent}
                </div>
              ) : (
                <button
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2"
                  onClick={() => setShowSearch(true)}
                  aria-label="Show search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Mobile Search Button */}
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 mr-2"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-3 px-2" ref={searchInputRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                className={`w-full pl-10 pr-10 py-2 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                  ${
                    isFocused
                      ? "border-blue-500 shadow-lg dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  setIsFocused(true);
                  setShowRecommendations(true);
                }}
                aria-label="Search movies"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearchQuery("");
                  setShowRecommendations(false);
                  setIsFocused(false);
                }}
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              {recommendationsComponent}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 py-2 px-4"
            ref={mobileMenuRef}
          >
            <Link
              href="/"
              className={`block py-2 px-4 rounded-md ${
                isActive("/")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/movies"
              className={`block py-2 px-4 rounded-md ${
                isActive("/movies")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              href="/about/"
              className={`block py-2 px-4 rounded-md ${
                isActive("/about") || isActive("/about/")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
});

// Add display name for debugging
Navbar.displayName = "Navbar";

export default Navbar;
