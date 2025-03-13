"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "../types/movie";
import { createSlug } from "../services/movieService";

interface TrendingMoviesProps {
  movies: Movie[];
}

export default function TrendingMovies({ movies }: TrendingMoviesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && movies.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, 3000); // Change slide every 3 seconds (reduced from 5 seconds)
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const handlePrevious = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (!movies.length) return null;

  return (
    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Current Movie */}
      <div className="relative w-full h-full">
        <Image
          src={
            movies[currentIndex].posterPath &&
            (movies[currentIndex].posterPath.startsWith("http") ||
              movies[currentIndex].posterPath.startsWith("/"))
              ? movies[currentIndex].posterPath
              : "/images/placeholders/default-movie.jpg"
          }
          alt={movies[currentIndex].title}
          fill
          className="object-cover opacity-50"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {movies[currentIndex].title}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                {movies[currentIndex].year}
              </p>
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                {movies[currentIndex].genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-full bg-gray-700/60 text-gray-300 backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              {movies[currentIndex].siteInfo &&
              movies[currentIndex].siteInfo.length > 0 ? (
                <a
                  href={`${
                    movies[currentIndex].siteInfo[0].siteLink.startsWith("http")
                      ? movies[currentIndex].siteInfo[0].siteLink
                      : `https://${movies[currentIndex].siteInfo[0].siteLink}`
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-medium 
                  hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 
                  transition-all duration-150 transform hover:scale-105 group"
                >
                  View Site
                  <svg
                    className="w-3 h-3 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-150"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ) : (
                <Link
                  href={`/movies/${createSlug(movies[currentIndex].title)}`}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-medium 
                  hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25 
                  transition-all duration-150 transform hover:scale-105 group"
                >
                  Get Links
                  <svg
                    className="w-3 h-3 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-150"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-4 sm:w-6 bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
