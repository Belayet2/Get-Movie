"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle clicking outside of mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  }, [isMenuOpen]);

  const handleLogout = async () => {
    // Clear client-side storage
    localStorage.removeItem("adminLoggedIn");
    Cookies.remove("adminLoggedIn", { path: "/" });

    // Navigate to login page
    router.push("/admin-login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                Admin Panel
              </span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/admin-control-panel"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === "/admin-control-panel"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/admin-control-panel/manage-movies"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === "/admin-control-panel/manage-movies"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                Manage Movies
              </Link>
              <Link
                href="/admin-control-panel/add-movie"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === "/admin-control-panel/add-movie"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                Add Movie
              </Link>
              <Link href="/admin-control-panel/analytics" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 hover:border-gray-300 dark:hover:border-gray-600">
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center mr-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        ref={mobileMenuRef}
        className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}
      >
        <div className="pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/admin-control-panel"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === "/admin-control-panel"
                ? "border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
          >
            Home
          </Link>
          <Link
            href="/admin-control-panel/manage-movies"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === "/admin-control-panel/manage-movies"
                ? "border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
          >
            Manage Movies
          </Link>
          <Link
            href="/admin-control-panel/add-movie"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === "/admin-control-panel/add-movie"
                ? "border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
          >
            Add Movie
          </Link>
        </div>
      </div>
    </nav>
  );
}
