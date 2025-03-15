import React from "react";

interface AdvancedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  widths?: number[];
  baseWidth?: number;
  baseHeight?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

const AdvancedImage: React.FC<AdvancedImageProps> = ({
  src,
  alt,
  className = "",
  sizes = "100vw",
  widths = [640, 750, 828, 1080, 1200],
  baseWidth = 1200,
  baseHeight = 800,
  loading = "lazy",
  priority = false,
  objectFit = "cover",
}) => {
  // Get file extension and base path
  const ext = src.split(".").pop() || "";
  const basePath = src.substring(0, src.lastIndexOf("."));

  // Generate srcset for each format
  const generateSrcSet = (format: string) => {
    return widths
      .map((width) => `${basePath}-${width}.${format} ${width}w`)
      .join(", ");
  };

  // Generate srcsets for different formats
  const avifSrcSet = generateSrcSet("avif");
  const webpSrcSet = generateSrcSet("webp");
  const fallbackSrcSet = generateSrcSet(ext);

  // Set loading attribute based on priority
  const loadingAttr = priority ? "eager" : loading;

  return (
    <picture>
      {/* AVIF format - best compression, modern browsers */}
      <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />

      {/* WebP format - good compression, wide support */}
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />

      {/* Original format as fallback */}
      <img
        src={src}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        loading={loadingAttr}
        width={baseWidth}
        height={baseHeight}
        className={className}
        style={{
          aspectRatio: `${baseWidth} / ${baseHeight}`,
          objectFit,
        }}
      />
    </picture>
  );
};

export default AdvancedImage;
