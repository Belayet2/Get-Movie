// "use client";

// import React, { memo, useState, useEffect } from "react";

// interface GenreFilterProps {
//   genres: string[];
//   selectedGenres: string[];
//   onSelectGenre: (genre: string) => void;
//   onClearAll?: () => void;
// }

// // Memoize the component to prevent unnecessary re-renders
// const GenreFilter = memo(function GenreFilter({
//   genres,
//   selectedGenres,
//   onSelectGenre,
//   onClearAll,
// }: GenreFilterProps) {
//   const [mounted, setMounted] = useState(false);

//   // Set mounted state after component mounts (client-side only)
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Handle clear all button click
//   const handleClearAll = () => {
//     if (onClearAll) {
//       onClearAll();
//     }
//   };

//   // If not mounted yet (server-side), render a simpler version
//   if (!mounted) {
//     return (
//       <div className="mt-4">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
//             <svg
//               className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
//               />
//             </svg>
//             Filter by Genre
//           </h3>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {genres.map((genre) => (
//             <button
//               key={genre}
//               className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//             >
//               {genre}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
//           <svg
//             className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
//             />
//           </svg>
//           Filter by Genre
//         </h3>

//         {selectedGenres.length > 0 && (
//           <button
//             onClick={handleClearAll}
//             className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 
//             rounded-lg border border-red-100 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-800/50 
//             transition-colors duration-150 flex items-center shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
//           >
//             <svg
//               className="w-3.5 h-3.5 mr-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//             Clear All
//           </button>
//         )}
//       </div>

//       <div className="flex flex-wrap gap-2">
//         {genres.map((genre) => (
//           <button
//             key={genre}
//             onClick={() => onSelectGenre(genre)}
//             className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 transform hover:scale-105 active:scale-95 ${
//               selectedGenres.includes(genre)
//                 ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-105"
//                 : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
//             }`}
//           >
//             {selectedGenres.includes(genre) && <span className="mr-1">✓</span>}
//             {genre}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// });

// export default GenreFilter;







"use client";

import React, { memo, useState, useEffect } from "react";

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onSelectGenre: (genre: string) => void;
  onClearAll?: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const GenreFilter = memo(function GenreFilter({
  genres,
  selectedGenres,
  onSelectGenre,
  onClearAll,
}: GenreFilterProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle clear all button click
  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  // If not mounted yet (server-side), render a simpler version
  if (!mounted) {
    return null; // Do not render anything before mounting
  }
  
  return (
    <div className="hidden md:block mt-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Filter by Genre
        </h3>
  
        {selectedGenres.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 
            rounded-lg border border-red-100 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-800/50 
            transition-colors duration-150 flex items-center shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
          >
            <svg
              className="w-3.5 h-3.5 mr-1"
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
            Clear All
          </button>
        )}
      </div>
  
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 transform hover:scale-105 active:scale-95 ${
              selectedGenres.includes(genre)
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-105"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            }`}
          >
            {selectedGenres.includes(genre) && <span className="mr-1">✓</span>}
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
});  

export default GenreFilter;