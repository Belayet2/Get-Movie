// app/thank-you/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const movieTitle = searchParams.get("movie");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          We've received your recommendation for "{movieTitle}" and added it to our pending list.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4 mb-6 font-bold">
          Our team will add your recommended movie under 12 hours.
        </p>
        <button
          onClick={() => router.push("/movies")}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
        >
          Back to Movies
        </button>
      </div>
    </div>
  );
}