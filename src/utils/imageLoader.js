/**
 * Utility function to handle image loading with fallbacks
 * This helps ensure images load properly even if the original path has issues
 */

// Default fallback image if the main image fails to load
const DEFAULT_FALLBACK = '/images/placeholder.jpg';

/**
 * Get the appropriate image URL with fallback options
 * @param {string} src - The original image source
 * @param {string} fallbackSrc - Optional custom fallback image
 * @returns {string} - The processed image URL
 */
export const getImageUrl = (src, fallbackSrc = DEFAULT_FALLBACK) => {
    if (!src) return fallbackSrc;

    // If it's already an absolute URL, return it
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }

    // If it's a relative URL, ensure it starts with a slash
    if (!src.startsWith('/')) {
        src = `/${src}`;
    }

    return src;
};

/**
 * Handle image error by replacing with fallback
 * @param {Event} event - The error event
 * @param {string} fallbackSrc - Optional custom fallback image
 */
export const handleImageError = (event, fallbackSrc = DEFAULT_FALLBACK) => {
    if (event.target.src !== fallbackSrc) {
        event.target.src = fallbackSrc;
    }
};

export default {
    getImageUrl,
    handleImageError
}; 