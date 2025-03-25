import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Movie, SiteInfo } from '../types/movie';

// Cache for movies to avoid excessive Firestore reads
let moviesCache: Movie[] | null = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 60000; // 1 minute cache expiry

// Convert Firestore document to Movie type
const convertMovie = (doc: QueryDocumentSnapshot<DocumentData>): Movie => {
  const data = doc.data();
  return {
    id: data.id,
    title: data.title,
    posterPath: data.posterPath,
    rating: data.rating,
    year: data.year,
    genres: data.genres,
    director: data.director || '',
    stars: data.stars || [],
    runtime: data.runtime || '',
    firestoreId: doc.id, // Store the Firestore document ID
    slug: createSlug(data.title), // Add slug for URL
    siteInfo: data.siteInfo || [],
    status: data.status || 'pending',
    pendingType: data.pendingType || 'admin',
    points: data.points || 0,
    lastClicked: data.lastClicked?.toDate() || null,
  };
};

// Create a URL-friendly slug from a title
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Clear the cache to force a fresh fetch
export const clearMoviesCache = () => {
  moviesCache = null;
  lastFetchTime = 0;
  console.log('Movies cache cleared');
};

// Get all movies with caching
export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const now = Date.now();

    // Return cached data if it's still valid
    if (moviesCache && now - lastFetchTime < CACHE_EXPIRY) {
      console.log('Returning cached movies data');
      return moviesCache;
    }

    console.log('Fetching fresh movies data from Firestore');
    const moviesCollection = collection(db, 'movies');
    const moviesSnapshot = await getDocs(moviesCollection);
    const movies = moviesSnapshot.docs.map(convertMovie);

    // Update cache
    moviesCache = movies;
    lastFetchTime = now;

    return movies;
  } catch (error) {
    console.error('Error getting all movies:', error);
    // If there's an error but we have cached data, return it as a fallback
    if (moviesCache) {
      console.log('Returning cached data as fallback after error');
      return moviesCache;
    }
    throw error;
  }
};

// Get a movie by ID
export const getMovieById = async (id: number): Promise<Movie | null> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where('id', '==', id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return convertMovie(querySnapshot.docs[0]);
  } catch (error) {
    console.error(`Error getting movie with ID ${id}:`, error);
    throw error;
  }
};

// Get a movie by slug
export const getMovieBySlug = async (slug: string): Promise<Movie | null> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);

    // Find the movie with the matching slug
    const movieDoc = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return createSlug(data.title) === slug;
    });

    if (!movieDoc) {
      return null;
    }

    return convertMovie(movieDoc);
  } catch (error) {
    console.error(`Error getting movie with slug ${slug}:`, error);
    throw error;
  }
};

// Get all movie slugs (for static generation)
export const getAllMovieSlugs = async (): Promise<string[]> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const moviesSnapshot = await getDocs(moviesCollection);
    return moviesSnapshot.docs.map(doc => {
      const data = doc.data();
      return createSlug(data.title);
    });
  } catch (error) {
    console.error('Error getting all movie slugs:', error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const moviesSnapshot = await getDocs(moviesCollection);

    // Filter movies that include the specified genre
    const filteredMovies = moviesSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.genres && data.genres.includes(genre);
    });

    return filteredMovies.map(convertMovie);
  } catch (error) {
    console.error(`Error getting movies with genre ${genre}:`, error);
    throw error;
  }
};

// Search movies by title
export const searchMovies = async (searchTerm: string): Promise<Movie[]> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const moviesSnapshot = await getDocs(moviesCollection);

    // If search term is empty, return all movies
    if (!searchTerm.trim()) {
      return moviesSnapshot.docs.map(convertMovie);
    }

    // Filter movies that match the search term
    const searchTermLower = searchTerm.toLowerCase();
    const filteredMovies = moviesSnapshot.docs.filter(doc => {
      const data = doc.data();

      // Check if title contains search term
      const titleMatch = data.title.toLowerCase().includes(searchTermLower);

      // Check if any genre contains search term
      const genreMatch = data.genres && data.genres.some((genre: string) =>
        genre.toLowerCase().includes(searchTermLower)
      );

      return titleMatch || genreMatch;
    });

    return filteredMovies.map(convertMovie);
  } catch (error) {
    console.error(`Error searching movies with term ${searchTerm}:`, error);
    throw error;
  }
};

// Add a new movie
export const addMovie = async (
  movie: Omit<Movie, 'firestoreId' | 'slug'>,
  adminKey?: string,
  addedBy: 'admin' | 'user' = 'admin'
): Promise<string> => {
  try {
    const moviesCollection = collection(db, 'movies');

    // Determine movie status based on admin key
    let status: 'live' | 'pending' = 'pending';
    let pendingType = addedBy;

    // Verify admin key if provided
    if (adminKey) {
      // Get the admin credentials
      const adminDoc = await getDoc(doc(db, 'admin', 'admin_credentials'));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        // Compare the provided key with the stored admin key
        if (adminKey === adminData.key) {
          // If admin key is valid, set status to live
          status = 'live';
        }
      }
    }

    // Add timestamp and status
    const movieWithTimestamp = {
      ...movie,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status,
      pendingType,
      addedBy // Track who added the movie
    };

    const docRef = await addDoc(moviesCollection, movieWithTimestamp);

    // Clear the cache to ensure fresh data is fetched next time
    clearMoviesCache();

    return docRef.id;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// Update a movie
export const updateMovie = async (
  firestoreId: string,
  movie: Partial<Movie> & {
    adminKey?: string;
  }
): Promise<void> => {
  try {
    const movieRef = doc(db, 'movies', firestoreId);
    const movieDoc = await getDoc(movieRef);

    if (!movieDoc.exists()) {
      throw new Error('Movie not found');
    }

    const movieData = movieDoc.data();

    // Get current movie data
    const currentStatus = movieData.status || 'pending';
    const currentPendingType = movieData.pendingType || 'admin';
    const addedBy = movieData.addedBy || 'admin';

    // Default status and pendingType
    let status = 'pending';
    let pendingType = currentPendingType;

    // Verify admin key if provided
    if (movie.adminKey) {
      // Get the admin credentials
      const adminDoc = await getDoc(doc(db, 'admin', 'admin_credentials'));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        // Compare the provided key with the stored admin key
        if (movie.adminKey === adminData.key) {
          // If admin key is valid, set status to live
          status = 'live';
        }
      }
    }

    // If admin key is invalid or not provided, keep in pending with correct pendingType
    if (status === 'pending') {
      pendingType = addedBy === 'admin' ? 'admin' : 'user';
    }

    // Remove adminKey from the update data
    const { adminKey, ...updateData } = movie;

    // Update the movie with timestamp and status information
    await updateDoc(movieRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
      status,
      pendingType
    });

    // Clear the cache to ensure fresh data is fetched next time
    clearMoviesCache();
  } catch (error) {
    console.error(`Error updating movie ${firestoreId}:`, error);
    throw error;
  }
};

// Delete a movie
export const deleteMovie = async (firestoreId: string, adminPassword: string): Promise<void> => {
  try {
    // Verify admin password
    const adminDoc = await getDoc(doc(db, 'admin', 'admin_credentials'));
    if (!adminDoc.exists()) {
      throw new Error('Admin credentials not found');
    }

    const adminData = adminDoc.data();
    if (adminData.password !== adminPassword) {
      throw new Error('Invalid admin password');
    }

    const movieRef = doc(db, 'movies', firestoreId);
    await deleteDoc(movieRef);

    // Clear the cache to ensure fresh data is fetched next time
    clearMoviesCache();
  } catch (error) {
    console.error(`Error deleting movie with ID ${firestoreId}:`, error);
    throw error;
  }
};

// Get trending movies
export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const trendingDoc = await getDoc(doc(db, 'settings', 'trending'));

    if (!trendingDoc.exists()) {
      return [];
    }

    const trendingData = trendingDoc.data();
    const movieIds = trendingData.movieIds || [];

    if (movieIds.length === 0) {
      return [];
    }

    // Fetch all movies
    const allMovies = await getAllMovies();

    // Filter and sort movies based on the trending order
    const trendingMovies = movieIds
      .map((id: number) => allMovies.find(movie => movie.id === id))
      .filter((movie: Movie | undefined) => movie !== undefined) as Movie[];

    return trendingMovies;
  } catch (error) {
    console.error('Error getting trending movies:', error);
    throw error;
  }
};

// Save trending movies
export const saveTrendingMovies = async (movies: Movie[]): Promise<void> => {
  try {
    const movieIds = movies.map(movie => movie.id);

    // Check if trending document exists
    const trendingDocRef = doc(db, 'settings', 'trending');
    const trendingDoc = await getDoc(trendingDocRef);

    if (trendingDoc.exists()) {
      // Update existing document
      await updateDoc(trendingDocRef, {
        movieIds,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new document
      await setDoc(trendingDocRef, {
        movieIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving trending movies:', error);
    throw error;
  }
};

// Track movie points when "Get Links" is clicked
// movieService.ts
export const incrementMoviePoints = async (movieId: string): Promise<void> => {
  try {
    if (!movieId) {
      console.error("No movieId provided");
      return;
    }

    // Update analytics collection
    const movieAnalyticsRef = doc(db, 'movieAnalytics', movieId);
    await setDoc(movieAnalyticsRef, {
      points: increment(1),
      lastClicked: serverTimestamp(),
    }, { merge: true });

    // Also update the movie document itself
    const movieRef = doc(db, 'movies', movieId);
    await updateDoc(movieRef, {
      points: increment(1),
      lastClicked: serverTimestamp()
    });

    console.log(`Points incremented for movie ${movieId}`);
  } catch (error) {
    console.error(`Error incrementing points for movie ${movieId}:`, error);
    throw error;
  }
};

// Get all movie analytics data
export const getMovieAnalytics = async (): Promise<Array<{
  id: string;
  points: number;
  lastClicked: Date;
  title?: string;
}>> => {
  try {
    // Get all analytics data
    const analyticsSnapshot = await getDocs(collection(db, 'movieAnalytics'));
    const analyticsData = analyticsSnapshot.docs.map(doc => ({
      id: doc.id,
      points: doc.data().points || 0,
      lastClicked: doc.data().lastClicked?.toDate() || new Date(0),
    }));

    // Get all movies to match titles
    const movies = await getAllMovies();

    // Enrich analytics data with movie titles
    return analyticsData.map(item => {
      const movie = movies.find(m => m.firestoreId === item.id);
      return {
        ...item,
        title: movie?.title || 'Unknown Movie',
      };
    }).sort((a, b) => b.points - a.points); // Sort by points descending
  } catch (error) {
    console.error('Error getting movie analytics:', error);
    throw error;
  }
};

// Get analytics for a specific movie
export const getMovieAnalyticsById = async (movieId: string): Promise<{
  points: number;
  lastClicked: Date;
} | null> => {
  try {
    const docRef = doc(db, 'movieAnalytics', movieId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        points: docSnap.data().points || 0,
        lastClicked: docSnap.data().lastClicked?.toDate() || new Date(0),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting analytics for movie ${movieId}:`, error);
    throw error;
  }
};

export async function updateMovieOrder(movieId: string, order: number): Promise<void> {
  try {
    const movieRef = doc(db, 'movies', movieId);
    await updateDoc(movieRef, {
      order: order,
      updatedAt: serverTimestamp() // Using serverTimestamp() instead of new Date()
    });
  } catch (error) {
    console.error("Error updating movie order:", error);
    throw error;
  }
}