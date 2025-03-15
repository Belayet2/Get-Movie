"use client";

import { useState } from "react";
import { getImageUrl } from "../utils/imageLoader";

/**
 * Image component with built-in fallback handling
 */
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  className = "",
  width,
  height,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src, fallbackSrc));

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || "Image"}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;
