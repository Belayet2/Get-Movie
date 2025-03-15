"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import Link from "next/link";

export default function AdminControlPanelClient() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user is on a subpage of admin-control-panel
    const isSubpage =
      pathname &&
      pathname !== "/admin-control-panel" &&
      pathname.startsWith("/admin-control-panel/");

    if (isSubpage) {
      // Log out the admin if they're on a subpage
      localStorage.removeItem("adminLoggedIn");
      router.replace("/admin-login");
      return;
    }

    // Otherwise, check if they're logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/admin-login");
      return;
    }

    setLoading(false);
  }, [router, pathname]);

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

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Control Panel
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome to the admin control panel. Use the navigation to manage
              your movie database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Manage Movies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    View, edit, and delete movies. Manage pending movies from
                    admins and users.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/admin-control-panel/manage-movies"
                    className="inline-block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Go to Manage Movies
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Add New Movie
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add a new movie to the database with all details and
                    information.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/admin-control-panel/add-movie"
                    className="inline-block w-full px-4 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Add New Movie
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Analytics
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    View statistics and analytics about your movie database and
                    user interactions.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    className="inline-block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
