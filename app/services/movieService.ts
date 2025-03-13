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
  setDoc
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
    description: data.description || '',
    director: data.director || '',
    stars: data.stars || [],
    runtime: data.runtime || '',
    firestoreId: doc.id, // Store the Firestore document ID
    slug: createSlug(data.title), // Add slug for URL
    siteInfo: data.siteInfo || []
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
export const addMovie = async (movie: Omit<Movie, 'firestoreId' | 'slug'>): Promise<string> => {
  try {
    const moviesCollection = collection(db, 'movies');
    
    // Add timestamp
    const movieWithTimestamp = {
      ...movie,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(moviesCollection, movieWithTimestamp);
    
    // Clear the cache to ensure fresh data is fetched next time
    clearMoviesCache();
    
    // Trigger revalidation for the new movie
    const slug = createSlug(movie.title);
    try {
      const revalidationToken = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN || 'your-secret-token';
      
      // Only trigger in production environment
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: revalidationToken,
            slug,
          }),
        });
        console.log('Revalidation triggered for new movie:', slug);
      }
    } catch (revalidateError) {
      console.error('Failed to trigger revalidation:', revalidateError);
      // Continue even if revalidation fails
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// Update a movie
export const updateMovie = async (firestoreId: string, movie: Partial<Movie>): Promise<void> => {
  try {
    const movieRef = doc(db, 'movies', firestoreId);
    
    // Add updated timestamp
    const movieWithTimestamp = {
      ...movie,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(movieRef, movieWithTimestamp);
    
    // Clear the cache to ensure fresh data is fetched next time
    clearMoviesCache();
    
    // Trigger revalidation if the title was updated (which would change the slug)
    if (movie.title) {
      const slug = createSlug(movie.title);
      try {
        const revalidationToken = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN || 'your-secret-token';
        
        // Only trigger in production environment
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: revalidationToken,
              slug,
            }),
          });
          console.log('Revalidation triggered for updated movie:', slug);
        }
      } catch (revalidateError) {
        console.error('Failed to trigger revalidation:', revalidateError);
        // Continue even if revalidation fails
      }
    }
  } catch (error) {
    console.error(`Error updating movie with ID ${firestoreId}:`, error);
    throw error;
  }
};

// Delete a movie
export const deleteMovie = async (firestoreId: string): Promise<void> => {
  try {
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