import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getMovieBySlug, getAllMovieSlugs, incrementMovieViewCount, getRelatedMovies } from "../../services/movieService";
import { Movie } from "../../types/movie";
import MovieDetailClient from "./MovieDetailClient";
import VisitSiteButton from "./VisitSiteButton";

// Generate static params for all movies
export async function generateStaticParams() {
  try {
    const slugs = await getAllMovieSlugs();

    // Make sure "the-wild-robot" is included
    if (!slugs.includes("the-wild-robot")) {
      slugs.push("the-wild-robot");
    }

    // Filter out any undefined or empty slugs
    return slugs
      .filter((slug) => slug && slug.trim() !== "")
      .map((slug) => ({ slug }));
  } catch (error) {
    // Fallback to include at least "the-wild-robot"
    return [{ slug: "the-wild-robot" }];
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Handle undefined params
  if (!params.slug) {
    return {
      title: "Movie Not Found",
    };
  }

  try {
    const movie = await getMovieBySlug(params.slug);

    if (!movie) {
      return {
        title: "Movie Not Found",
      };
    }

    return {
      title: `${movie.title} (${movie.year}) - Getmovie`,
      description: `Watch ${movie.title} (${movie.year}) online. Get details, ratings, and streaming information for ${movie.title} on Getmovie.`,
      keywords: `${movie.title}, ${movie.title} movie, watch ${movie.title}, ${movie.title} ${movie.year}, ${movie.genres.join(', ')}, ${movie.director || ''}, streaming ${movie.title}, Getmovie`,
      openGraph: {
        title: `${movie.title} (${movie.year}) - Getmovie`,
        description: `Watch ${movie.title} (${movie.year}) online. Get details, ratings, and streaming information for ${movie.title} on Getmovie.`,
        images: [
          {
            url: movie.posterPath || 'https://getmoviefast.netlify.app/images/logo/movie-logo.png',
            width: 1200,
            height: 630,
            alt: `${movie.title} Poster`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movie.title} (${movie.year}) - Getmovie`,
        description: `Watch ${movie.title} (${movie.year}) online. Get details, ratings, and streaming information for ${movie.title} on Getmovie.`,
        images: [movie.posterPath || 'https://getmoviefast.netlify.app/images/logo/movie-logo.png'],
      },
    };
  } catch (error) {
    return {
      title: "Movie Details - Getmovie",
    };
  }
}

// Calculate color based on rating
const getRatingColor = (rating: number) => {
  if (rating >= 8.5) return "bg-emerald-500";
  if (rating >= 7) return "bg-blue-500";
  if (rating >= 5.5) return "bg-amber-500";
  return "bg-red-500";
};

// Related Movies Component
async function RelatedMovies({ movieId, genres }: { movieId: number, genres: string[] }) {
  try {
    const relatedMovies = await getRelatedMovies(movieId, genres, 4);
    
    if (!relatedMovies || relatedMovies.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray mb-6">
          Related Movies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedMovies.map((movie) => (
            <Link 
              href={`/movies/${movie.slug}`} 
              key={movie.id}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={movie.posterPath || "/images/placeholders/default-movie.jpg"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching related movies:", error);
    return null;
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Handle undefined params
  if (!params.slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Invalid Movie URL
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The movie URL is invalid or missing.
          </p>
          <Link
            href="/movies"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Browse All Movies
          </Link>
        </div>
      </div>
    );
  }

  try {
    const movie = await getMovieBySlug(params.slug);

    // If movie is found, render the server component
    if (movie) {
      return (
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs navigation */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <Link href="/movies" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-blue-400">Movies</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400 truncate max-w-[200px]">{movie.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Movie poster */}
              <div className="md:w-1/3 lg:w-1/4 relative">
                <div className="relative h-96 md:h-full w-full">
                  <Image
                    src={
                      movie.posterPath ||
                      "/images/placeholders/default-movie.jpg"
                    }
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority
                  />
                  <div
                    className={`absolute top-4 right-4 ${getRatingColor(
                      movie.rating
                    )} text-white font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10 text-lg`}
                  >
                    {movie.rating.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Movie info */}
              <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  {movie.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">
                  {movie.year}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Site Information Section */}
                {movie.siteInfo && movie.siteInfo.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                      Available On
                    </h2>
                    <div className="space-y-4">
                      {movie.siteInfo.map((site, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                              {site.siteName}
                            </h3>
                            <VisitSiteButton siteLink={site.siteLink} slug={params.slug} />
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {site.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="text-sm px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Movies Section */}
          <RelatedMovies movieId={movie.id} genres={movie.genres} />

          {/* Client component for handling view count and dynamic content */}
          <MovieDetailClient movie={movie} />

          {/* Schema.org structured data */}
          <Script
            id="movie-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Movie",
                "name": movie.title,
                "dateCreated": movie.year,
                "description": `Watch ${movie.title} (${movie.year}) online. Get details, ratings, and streaming information.`,
                "director": movie.director ? {
                  "@type": "Person",
                  "name": movie.director
                } : undefined,
                "genre": movie.genres,
                "image": movie.posterPath || "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
                "url": `https://getmoviefast.netlify.app/movies/${movie.slug}`,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": movie.rating.toString(),
                  "bestRating": "10",
                  "worstRating": "1",
                  "ratingCount": movie.views || 1
                }
              })
            }}
          />
        </div>
      );
    }
  } catch (error) {
  }

  // If movie is not found or there's an error, create a minimal movie object for the fallback
  const fallbackMovie: Movie = {
    id: 0,
    title: 'Movie Not Found',
    posterPath: '/images/placeholders/default-movie.jpg',
    rating: 0,
    year: '',
    genres: [],
    slug: params.slug
  };
  return <MovieDetailClient movie={fallbackMovie} />;
}
