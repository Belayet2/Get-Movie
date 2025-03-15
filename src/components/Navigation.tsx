import React, { useState } from "react";
import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
import AccessibleButton from "./AccessibleButton";

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <OptimizedImage
                src="/images/logo/movie-logo.png"
                alt="Getmovie Logo"
                width={40}
                height={40}
                className="mr-2"
                priority={true}
              />
              <span className="text-blue-600 dark:text-blue-400 text-xl md:text-2xl font-bold">
                Getmovie
              </span>
            </Link>
          </div>

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
              href="/about"
              className="text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
            >
              About
            </Link>
          </div>

          <div className="md:hidden">
            <AccessibleButton
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-300 focus:outline-none"
              ariaLabel={isMenuOpen ? "Close menu" : "Open menu"}
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
            </AccessibleButton>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <Link
              href="/"
              className="block text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="block text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
            >
              Movies
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md font-medium"
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
