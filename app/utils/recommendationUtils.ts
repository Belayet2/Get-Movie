import Cookies from 'js-cookie';
import { Movie } from '../types/movie';

// Set a cookie when a user's movie recommendation is accepted
export const setAcceptedMovieCookie = (movie: Movie, moviePath: string) => {
  if (!movie.slug) return;
  
  const acceptedMovieInfo = {
    title: movie.title,
    slug: movie.slug,
    moviePath: moviePath.trim()
  };
  
  // Store in a cookie that expires in 7 days
  Cookies.set('acceptedMovie', JSON.stringify(acceptedMovieInfo), { expires: 7 });
};

// Get the accepted movie info from cookies
export const getAcceptedMovieFromCookie = () => {
  const acceptedMovieJson = Cookies.get('acceptedMovie');
  if (!acceptedMovieJson) return null;
  
  try {
    return JSON.parse(acceptedMovieJson);
  } catch (error) {
    console.error('Error parsing accepted movie cookie:', error);
    return null;
  }
};

// Clear the accepted movie cookie
export const clearAcceptedMovieCookie = () => {
  Cookies.remove('acceptedMovie');
};
