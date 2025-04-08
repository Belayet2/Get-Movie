import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Movies - Getmovie",
  description: "Browse our collection of movies. Filter by genre, search by title, and discover new films to watch.",
  keywords: "movie list, browse movies, movie collection, movie catalog, filter movies, search movies, movie genres, Getmovie",
  openGraph: {
    title: "Browse Movies - Getmovie",
    description: "Browse our collection of movies. Filter by genre, search by title, and discover new films to watch.",
    images: [
      {
        url: "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
        width: 1200,
        height: 630,
        alt: "Getmovie Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Movies - Getmovie",
    description: "Browse our collection of movies. Filter by genre, search by title, and discover new films to watch.",
    images: ["https://getmoviefast.netlify.app/images/logo/movie-logo.png"],
  },
};

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
