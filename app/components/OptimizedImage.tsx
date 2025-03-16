"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { useOptimizedImage } from "../hooks/useOptimizedImage";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  onLoad?: () => void;
}

/**
 * OptimizedImage component that improves performance by:
 * 1. Lazy loading images by default
 * 2. Using Next.js Image optimization
 * 3. Providing fallbacks for loading and errors
 * 4. Memoizing to prevent unnecessary re-renders
 */
const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  priority = false,
  quality = 75,
  objectFit = "cover",
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { optimizedSrc, isLoading, error } = useOptimizedImage({
    src,
    width,
    quality,
  });

  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Show loading state
  if (isLoading && !priority) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        role="img"
        aria-label={`Loading ${alt}`}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        role="img"
        aria-label={`Failed to load ${alt}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    );
  }

  // Render the optimized image
  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        style={{ objectFit }}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
      />
      {!isLoaded && !priority && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
});

// Add display name for debugging
OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
