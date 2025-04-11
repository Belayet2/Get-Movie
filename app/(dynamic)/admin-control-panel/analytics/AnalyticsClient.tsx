"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Movie } from "@/app/types/movie";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Cookies from "js-cookie";

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsClient() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [genreViews, setGenreViews] = useState<{[key: string]: number}>({});
  const [viewsByMonth, setViewsByMonth] = useState<{[key: string]: number}>({});
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn =
      localStorage.getItem("adminLoggedIn") === "true" ||
      Cookies.get("adminLoggedIn") === "true";

    if (!isLoggedIn) {
      router.replace("/admin-login");
      return;
    }

    fetchMovieData();
  }, [router]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const moviesCollection = collection(db, 'movies');
      const moviesSnapshot = await getDocs(moviesCollection);
      
      const moviesData = moviesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.id,
          title: data.title,
          posterPath: data.posterPath,
          rating: data.rating,
          year: data.year,
          genres: data.genres || [],
          director: data.director || '',
          stars: data.stars || [],
          runtime: data.runtime || '',
          firestoreId: doc.id,
          slug: data.slug || '',
          siteInfo: data.siteInfo || [],
          status: data.status || 'pending',
          pendingType: data.pendingType || 'admin',
          views: data.views || 0,
        };
      });

      // Calculate total views
      const total = moviesData.reduce((sum, movie) => sum + (movie.views || 0), 0);
      setTotalViews(total);

      // Get top 5 most viewed movies
      const sortedMovies = [...moviesData].sort((a, b) => (b.views || 0) - (a.views || 0));
      setTopMovies(sortedMovies.slice(0, 5));

      // Calculate views by genre
      const genreData: {[key: string]: number} = {};
      moviesData.forEach(movie => {
        if (movie.genres && Array.isArray(movie.genres)) {
          movie.genres.forEach(genre => {
            if (!genreData[genre]) {
              genreData[genre] = 0;
            }
            genreData[genre] += movie.views || 0;
          });
        }
      });
      setGenreViews(genreData);

      // Mock data for views by month (since we don't have actual timestamps for views)
      // In a real application, you would store timestamps with views and aggregate them
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mockViewsByMonth: {[key: string]: number} = {};
      
      // Create a distribution of the total views across months
      // This is just for demonstration purposes
      let remainingViews = total;
      months.forEach(month => {
        // Distribute views somewhat randomly but weighted towards recent months
        const monthIndex = months.indexOf(month);
        const weight = (monthIndex + 1) / months.length;
        const views = Math.floor(remainingViews * weight * Math.random() * 0.5);
        mockViewsByMonth[month] = views;
        remainingViews -= views;
      });
      
      // Add any remaining views to the last month
      mockViewsByMonth[months[months.length - 1]] += remainingViews;
      
      setViewsByMonth(mockViewsByMonth);
      setMovies(moviesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: Object.keys(genreViews),
    datasets: [
      {
        label: 'Views by Genre',
        data: Object.values(genreViews),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(78, 205, 196, 0.6)',
          'rgba(255, 99, 71, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(78, 205, 196, 1)',
          'rgba(255, 99, 71, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(viewsByMonth),
    datasets: [
      {
        label: 'Views by Month',
        data: Object.values(viewsByMonth),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Views Distribution',
      },
    },
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

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Movie Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View statistics and analytics about your movie database and user interactions.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Views per Movie</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {movies.length > 0 ? Math.round(totalViews / movies.length).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Movies</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{movies.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Views by Genre</h2>
              <div className="h-80">
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Views by Month</h2>
              <div className="h-80">
                <Bar data={barChartData} options={{ ...barChartOptions, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Top Movies Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 5 Most Viewed Movies</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Movie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topMovies.map((movie, index) => (
                    <tr key={movie.firestoreId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{movie.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{movie.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{(movie.views || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          movie.rating >= 8.5 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          movie.rating >= 7 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          movie.rating >= 5.5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {movie.rating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end">
            <button
              onClick={fetchMovieData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
