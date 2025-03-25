// // app/thank-you/page.tsx
// "use client";

// import {useRouter } from "next/navigation";

// export default function ThankYouPage() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//       <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//           Thank You!
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300">
//           We've received your recommendation.
//         </p>
//         <p className="text-gray-600 dark:text-gray-300 mt-4 mb-6 font-bold">
//           Our team will add your recommended movie under 12 hours.
//         </p>
//         <button
//           onClick={() => router.push("/movies")}
//           className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
//         >
//           Back to Movies
//         </button>
//       </div>
//     </div>
//   );
// }



// app/thank-you/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          🎉 Thank You!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          We've received your recommendation.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4 mb-6 font-bold">
          Our team will add your recommended movie within 12 hours.
        </p>
        <button
          onClick={() => router.push("/movies")}
          className="mt-4 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Back to Movies
        </button>
      </motion.div>
    </div>
  );
}