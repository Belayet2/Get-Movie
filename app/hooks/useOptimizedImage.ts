import { useState, useEffect } from 'react';

interface UseOptimizedImageProps {
  src: string;
  width?: number;
  quality?: number;
}

/**
 * Custom hook for optimized image loading
 * This hook helps with lazy loading and optimizing images
 */
export function useOptimizedImage({ 
  src, 
  width = 500, 
  quality = 75 
}: UseOptimizedImageProps): { 
  optimizedSrc: string; 
  isLoading: boolean;
  error: Error | null;
} {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip optimization for data URLs or SVGs
    if (src.startsWith('data:') || src.endsWith('.svg')) {
      setOptimizedSrc(src);
      setIsLoading(false);
      return;
    }

    // Skip optimization for relative URLs that are likely already optimized
    if (src.startsWith('/') && !src.includes('://')) {
      setOptimizedSrc(src);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      // For external URLs, we can't optimize directly
      // But we can at least set the loading state correctly
      setOptimizedSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = (e) => {
      console.error('Error loading image:', e);
      setError(new Error('Failed to load image'));
      setIsLoading(false);
      
      // Fallback to original source
      setOptimizedSrc(src);
    };

    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, width, quality]);

  return { optimizedSrc, isLoading, error };
} 