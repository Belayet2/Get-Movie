"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import { getAllMovies, deleteMovie } from "@/app/services/movieService";
import { Movie } from "@/app/types/movie";

export default function ManageMoviesClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [activePendingTab, setActivePendingTab] = useState("admin");
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/admin-login");
      return;
    }

    const fetchMovies = async () => {
      try {
        const allMovies = await getAllMovies();
        setMovies(allMovies);
        setFilteredMovies(allMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMovies(movies);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.genres.some((genre) => genre.toLowerCase().includes(query))
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  const handleDeleteMovie = async (movie: Movie) => {
    if (!movie.firestoreId) {
      console.error("Movie has no Firestore ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        const adminPassword = prompt(
          "Please enter admin password to confirm deletion:"
        );

        if (!adminPassword) {
          return; // User cancelled or didn't enter a password
        }

        await deleteMovie(movie.firestoreId, adminPassword);

        const updatedMovies = movies.filter(
          (m) => m.firestoreId !== movie.firestoreId
        );
        setMovies(updatedMovies);
        setFilteredMovies(updatedMovies);
        setDeleteError("");
      } catch (error) {
        console.error("Error deleting movie:", error);
        setDeleteError(
          error instanceof Error ? error.message : "Failed to delete movie"
        );
        setTimeout(() => setDeleteError(""), 5000); // Clear error after 5 seconds
      }
    }
  };

  const handleEditMovie = (movie: Movie) => {
    router.push(`/admin-control-panel/edit-movie/${movie.slug}`);
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For demo purposes, we'll simulate pending movies
  // In a real app, you would fetch these from your database
  const liveMovies = filteredMovies.filter((movie) => movie.status === "live");
  const pendingAdminMovies = filteredMovies.filter(
    (movie) => movie.status === "pending" && movie.pendingType === "admin"
  );
  const pendingUserMovies = filteredMovies.filter(
    (movie) => movie.status === "pending" && movie.pendingType === "user"
  );

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Movies
            </h1>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search movies by title or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {deleteError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {deleteError}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "live"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Live
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "pending"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Pending
                </button>
              </li>
            </ul>
          </div>

          {/* Live Movies Section */}
          {activeTab === "live" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveMovies.length > 0 ? (
                liveMovies.map((movie) => (
                  <div
                    key={movie.firestoreId}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {movie.title}
                          </h2>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Live
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {movie.year}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {movie.genres.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleEditMovie(movie)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? "No movies found matching your search."
                      : "No live movies available."}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pending Movies Section */}
          {activeTab === "pending" && (
            <div>
              {/* Pending Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <button
                      onClick={() => setActivePendingTab("admin")}
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${
                        activePendingTab === "admin"
                          ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                    >
                      Admin Pending ({pendingAdminMovies.length})
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      onClick={() => setActivePendingTab("user")}
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${
                        activePendingTab === "user"
                          ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                    >
                      User Pending ({pendingUserMovies.length})
                    </button>
                  </li>
                </ul>
              </div>

              {/* Admin Pending Movies */}
              {activePendingTab === "admin" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingAdminMovies.length > 0 ? (
                    pendingAdminMovies.map((movie) => (
                      <div
                        key={movie.firestoreId}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {movie.title}
                              </h2>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                Admin Pending
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                {movie.year}
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {movie.genres.join(", ")}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap justify-end gap-2 mt-4">
                            <button
                              onClick={() => handleEditMovie(movie)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No admin pending movies available.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* User Pending Movies */}
              {activePendingTab === "user" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingUserMovies.length > 0 ? (
                    pendingUserMovies.map((movie) => (
                      <div
                        key={movie.firestoreId}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {movie.title}
                              </h2>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                User Pending
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                {movie.year}
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {movie.genres.join(", ")}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap justify-end gap-2 mt-4">
                            <button
                              onClick={() => handleEditMovie(movie)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No user pending movies available.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
