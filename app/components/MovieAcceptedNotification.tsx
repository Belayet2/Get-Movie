"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAcceptedMovieFromCookie, clearAcceptedMovieCookie } from '../utils/recommendationUtils';

export default function MovieAcceptedNotification() {
  const [acceptedMovie, setAcceptedMovie] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check if there's an accepted movie in cookies
    const movie = getAcceptedMovieFromCookie();
    if (movie) {
      setAcceptedMovie(movie);
      setShowNotification(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowNotification(false);
    // Remove the cookie after dismissing
    clearAcceptedMovieCookie();
  };

  if (!showNotification || !acceptedMovie) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-green-500 animate-slide-in-right">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your recommendation was accepted!
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            "{acceptedMovie.title}" has been added to our collection.
          </p>
          <div className="mt-3 flex space-x-3">
            {acceptedMovie.moviePath && (
              <Link 
                href={acceptedMovie.moviePath} 
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Now
              </Link>
            )}
            <Link 
              href={`/movies/${acceptedMovie.slug}`} 
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-400 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              View Details
            </Link>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Add this CSS to your globals.css
// @keyframes slide-in-right {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
// .animate-slide-in-right {
//   animation: slide-in-right 0.3s ease-out;
// }
