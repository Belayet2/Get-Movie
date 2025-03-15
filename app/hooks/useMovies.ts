import { useState, useEffect, useCallback } from 'react';
import { getAllMovies, clearMoviesCache } from '../services/movieService';
import { Movie } from '../types/movie';

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMovies(): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMovies = useCallback(async (forceFresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear cache if force fresh is requested
      if (forceFresh) {
        clearMoviesCache();
      }
      
      const data = await getAllMovies();
      
      // Filter to only include live movies
      const liveMovies = data.filter(movie => movie.status === 'live');
      setMovies(liveMovies);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch movies'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Function to manually refetch data
  const refetch = useCallback(async () => {
    await fetchMovies(true);
  }, [fetchMovies]);

  return { movies, loading, error, refetch };
} 