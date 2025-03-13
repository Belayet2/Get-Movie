"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent redirect loops by checking for a redirect flag in sessionStorage
    const hasRedirected = sessionStorage.getItem("redirected");

    // Check if this is a movie detail page and we haven't redirected yet
    if (pathname?.startsWith("/movies/") && !hasRedirected) {
      const slug = pathname.split("/").pop();
      console.log("404 for movie with slug:", slug);

      // Set the redirect flag to prevent loops
      sessionStorage.setItem("redirected", "true");

      // Clear the flag after 5 seconds to allow future redirects
      setTimeout(() => {
        sessionStorage.removeItem("redirected");
      }, 5000);

      // Redirect to the client-side movie detail page
      if (slug) {
        window.location.href = `/movies/${slug}`;
      }
    }
  }, [pathname]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-8">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
