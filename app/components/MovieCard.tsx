import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Movie } from "../types/movie";
import { createSlug } from "../services/movieService";

interface MovieCardProps {
  movie: Movie;
  isGridView: boolean;
  isActive: boolean;
  onClick: () => void;
}

export default function MovieCard({
  movie,
  isActive,
  onClick,
}: MovieCardProps) {
  const { title, posterPath, rating, year, genres } = movie;
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get the slug for the movie
  const slug = movie.slug || createSlug(title);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Update flipped state when active state changes
  useEffect(() => {
    if (isMobile) {
      setIsFlipped(isActive);
    }
  }, [isActive, isMobile]);

  // Calculate color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "bg-emerald-500";
    if (rating >= 7) return "bg-blue-500";
    if (rating >= 5.5) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleCardClick = () => {
    if (isMobile) {
      onClick();
    }
  };

  // If not mounted yet (server-side), render a simpler version
  if (!mounted) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-lg h-[400px]">
        <div className="relative h-full bg-gray-200 dark:bg-gray-700 rounded-xl">
          {/* Static placeholder */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div
        ref={cardRef}
        className={`perspective-1000 h-[400px] cursor-pointer ${
          isMobile ? "" : "group"
        }`}
        onClick={handleCardClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          } ${!isMobile ? "group-hover:rotate-y-180" : ""}`}
        >
          {/* Front side - Movie Poster */}
          <div className="absolute w-full h-full backface-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -mr-16 -mt-16 blur-xl"></div>

              <Image
                src={
                  posterPath &&
                  (posterPath.startsWith("http") || posterPath.startsWith("/"))
                    ? posterPath
                    : "/images/placeholders/default-movie.jpg"
                }
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={() => setImageError(true)}
              />

              {/* Rating Badge */}
              <div
                className={`absolute top-3 right-3 ${getRatingColor(rating)} 
                  text-white font-bold rounded-full w-12 h-12 flex items-center 
                  justify-center shadow-lg z-10 text-lg`}
              >
                {rating.toFixed(1)}
              </div>

              {/* Title overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                <h3 className="text-xl font-bold text-white truncate">
                  {title}
                </h3>
                <p className="text-gray-300 text-sm">{year}</p>
              </div>
            </div>
          </div>

          {/* Back side - Movie Details */}
          <div className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg overflow-hidden rotate-y-180">
            <div className="flex flex-col justify-between h-full p-6 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full -mr-20 -mt-20 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-teal-500/20 rounded-full -ml-16 -mb-16 blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl"></div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10"
              >
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                  {title}
                </h3>
                <p className="text-gray-300 text-lg mb-4">{year}</p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((genre, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 rounded-full bg-gray-700/60 text-gray-300 backdrop-blur-sm border border-gray-600/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Links Button - Below Card */}
      <a
        href={`/movies/${slug}`}
        className="block w-full text-center py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium 
        hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 
        transition-all duration-150 transform hover:scale-105 hover:translate-y-[-2px]
        group overflow-hidden"
        data-testid="get-links-button"
      >
        <div className="relative z-10 inline-flex items-center group-hover:translate-x-1 transition-transform duration-150">
          Get Links
          <svg
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-150"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150"></div>
      </a>
    </div>
  );
}
