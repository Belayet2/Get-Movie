"use client";

import { useEffect, useState } from "react";
import { getMovieAnalytics, getAllMovies, updateMovieOrder } from "../../../services/movieService";
import { Movie } from "../../../types/movie";
import AdminNavbar from "@/app/components/AdminNavbar";

interface AnalyticsData {
    id: string;
    points: number;
    lastClicked: Date;
    title?: string;
    order?: number;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const sortedMovies = [...movies].sort((a, b) => {
        const pointsDiff = (b.points || 0) - (a.points || 0);
        if (pointsDiff !== 0) return pointsDiff;
        return (a.order || Infinity) - (b.order || Infinity);
    });
    // const [editingOrder, setEditingOrder] = useState(false);
    // const [orderedMovies, setOrderedMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const analyticsData = await getMovieAnalytics();
                const allMovies = await getAllMovies();

                const enrichedData = analyticsData.map((item) => {
                    const movie = allMovies.find((m) => m.firestoreId === item.id);
                    return {
                        ...item,
                        title: movie?.title || "Unknown Movie",
                        order: movie?.order || 0,
                    };
                });

                setAnalytics(enrichedData);
                setMovies(allMovies);
                // setOrderedMovies([...allMovies].sort((a, b) => (a.order || 0) - (b.order || 0)));
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // const handleOrderChange = (id: string, newOrder: number) => {
    //     const updatedMovies = [...orderedMovies];
    //     const movieIndex = updatedMovies.findIndex(m => m.firestoreId === id);

    //     if (movieIndex !== -1) {
    //         // Swap orders if another movie already has this order
    //         const existingMovieIndex = updatedMovies.findIndex(m => m.order === newOrder);
    //         if (existingMovieIndex !== -1) {
    //             updatedMovies[existingMovieIndex].order = updatedMovies[movieIndex].order;
    //         }

    //         updatedMovies[movieIndex].order = newOrder;
    //         setOrderedMovies(updatedMovies.sort((a, b) => (a.order || 0) - (b.order || 0)));
    //     }
    // };

    // const saveMovieOrder = async () => {
    //     try {
    //         await Promise.all(orderedMovies.map(movie =>
    //             updateMovieOrder(movie.firestoreId || "", movie.order || 0)
    //         ));
    //         setEditingOrder(false);
    //         alert("Movie order saved successfully!");
    //     } catch (error) {
    //         console.error("Error saving movie order:", error);
    //         alert("Failed to save movie order");
    //     }
    // };

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-700 dark:text-gray-300">Loading analytics...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <AdminNavbar />
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">📊 Movie Analytics</h1>

            {/* Movie Order Control Section */}
            {/* <div className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Movie Display Order</h2>
                    {editingOrder ? (
                        <div className="space-x-2">
                            <button
                                onClick={saveMovieOrder}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Save Order
                            </button>
                            <button
                                onClick={() => setEditingOrder(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditingOrder(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Edit Order
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orderedMovies.map((movie) => (
                        <div key={movie.firestoreId} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                            {editingOrder ? (
                                <>
                                    <input
                                        type="number"
                                        min="1"
                                        value={movie.order || 0}
                                        onChange={(e) => handleOrderChange(movie.firestoreId || "", parseInt(e.target.value) || 0)}
                                        className="w-16 mr-4 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                                    />
                                    <span className="font-medium">{movie.title}</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold rounded-full mr-4">
                                        {movie.order || "-"}
                                    </div>
                                    <span className="font-medium">{movie.title}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Analytics Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Movie</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Points</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Last Clicked</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase">Display Order</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {sortedMovies.length > 0 ? (
                            sortedMovies.map((movie) => {
                                const analyticsItem = analytics.find(a => a.id === movie.firestoreId);
                                return (
                                    <tr key={movie.firestoreId} className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">{movie.title}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{movie.points || 0}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {analyticsItem?.lastClicked ? new Date(analyticsItem.lastClicked).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{movie.order || "Not set"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">No movies available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



// app/admin/analytics/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { getMovieAnalytics, getAllMovies, updateMovieOrder } from "../../../services/movieService";
// import { Movie } from "../../../types/movie";
// import AdminNavbar from "@/app/components/AdminNavbar";

// interface AnalyticsData {
//     id: string;
//     points: number;
//     lastClicked: Date;
//     title?: string;
//     order?: number;
// }

// export default function AnalyticsPage() {
//     const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
//     const [movies, setMovies] = useState<Movie[]>([]);
//     const [loading, setLoading] = useState(true);
//     // const [editingOrder, setEditingOrder] = useState(false);
//     // const [orderedMovies, setOrderedMovies] = useState<Movie[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [analyticsData, allMovies] = await Promise.all([
//                     getMovieAnalytics(),
//                     getAllMovies()
//                 ]);

//                 const enrichedData = analyticsData.map((item) => {
//                     const movie = allMovies.find((m) => m.firestoreId === item.id);
//                     return {
//                         ...item,
//                         title: movie?.title || "Unknown Movie",
//                         order: movie?.order || 0,
//                     };
//                 });

//                 setAnalytics(enrichedData);
//                 setMovies(allMovies);
//                 setOrderedMovies([...allMovies].sort((a, b) => (a.order || 0) - (b.order || 0)));
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // const handleOrderChange = (id: string, newOrder: number) => {
//     //     setOrderedMovies(prev => {
//     //         const updated = [...prev];
//     //         const movieIndex = updated.findIndex(m => m.firestoreId === id);

//     //         if (movieIndex !== -1) {
//     //             // If another movie has this order, swap them
//     //             const existingIndex = updated.findIndex(m => m.order === newOrder);
//     //             if (existingIndex !== -1) {
//     //                 updated[existingIndex].order = updated[movieIndex].order;
//     //             }

//     //             updated[movieIndex].order = newOrder;
//     //             return updated.sort((a, b) => (a.order || 0) - (b.order || 0));
//     //         }
//     //         return prev;
//     //     });
//     // };

//     // const saveMovieOrder = async () => {
//     //     try {
//     //         await Promise.all(
//     //             orderedMovies.map(movie =>
//     //                 updateMovieOrder(movie.firestoreId || "", movie.order || 0)
//     //         ));
//     //         setEditingOrder(false);
//     //         alert("Movie order saved successfully!");
//     //     } catch (error) {
//     //         console.error("Error saving order:", error);
//     //         alert("Failed to save movie order");
//     //     }
//     // };

//     if (loading) {
//         return <div className="flex items-center justify-center h-screen">Loading...</div>;
//     }

//     return (
//         <div className="container mx-auto py-8 px-4">
//             <AdminNavbar />
//             <h1 className="text-3xl font-bold mb-8">Movie Analytics</h1>

//             {/* Order Control Section */}
//             {/* <div className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">Movie Display Order</h2>
//                     {editingOrder ? (
//                         <div className="space-x-2">
//                             <button
//                                 onClick={saveMovieOrder}
//                                 className="px-4 py-2 bg-green-600 text-white rounded"
//                             >
//                                 Save Order
//                             </button>
//                             <button
//                                 onClick={() => setEditingOrder(false)}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     ) : (
//                         <button
//                             onClick={() => setEditingOrder(true)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded"
//                         >
//                             Edit Order
//                         </button>
//                     )}
//                 </div>

//                 <div className="space-y-3">
//                     {orderedMovies.map((movie) => (
//                         <div key={movie.firestoreId} className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
//                             {editingOrder ? (
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     value={movie.order || 0}
//                                     onChange={(e) =>
//                                         handleOrderChange(
//                                             movie.firestoreId || "",
//                                             parseInt(e.target.value) || 0
//                                         )
//                                     }
//                                     className="w-16 mr-4 p-2 border rounded"
//                                 />
//                             ) : (
//                                 <span className="w-16 mr-4 p-2 font-bold text-center">
//                                     {movie.order || "-"}
//                                 </span>
//                             )}
//                             <span>{movie.title}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div> */}

//             {/* Analytics Table */}
//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded">
//                     <thead className="bg-gray-200 dark:bg-gray-700">
//                         <tr>
//                             <th className="px-6 py-3 text-left">Movie</th>
//                             <th className="px-6 py-3 text-left">Points</th>
//                             <th className="px-6 py-3 text-left">Last Clicked</th>
//                             <th className="px-6 py-3 text-left">Order</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {analytics.map((item) => (
//                             <tr key={item.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
//                                 <td className="px-6 py-4">{item.title}</td>
//                                 <td className="px-6 py-4">{item.points}</td>
//                                 <td className="px-6 py-4">
//                                     {new Date(item.lastClicked).toLocaleString()}
//                                 </td>
//                                 <td className="px-6 py-4">{item.order || "-"}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }