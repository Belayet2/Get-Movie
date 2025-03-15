import React from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  widths?: number[];
  baseWidth?: number;
  baseHeight?: number;
  loading?: "lazy" | "eager";
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = "",
  sizes = "100vw",
  widths = [640, 750, 828, 1080, 1200],
  baseWidth = 1200,
  baseHeight = 800,
  loading = "lazy",
}) => {
  // Get file extension
  const extension = src.split(".").pop() || "";
  const basePath = src.substring(0, src.lastIndexOf("."));

  // Generate srcset
  const srcSet = widths
    .map((width) => `${basePath}-${width}.${extension} ${width}w`)
    .join(", ");

  // Calculate aspect ratio for proper sizing
  const aspectRatio = baseHeight / baseWidth;

  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      loading={loading}
      className={className}
      style={{ aspectRatio: `${baseWidth} / ${baseHeight}` }}
      width={baseWidth}
      height={baseHeight}
    />
  );
};

export default ResponsiveImage;
