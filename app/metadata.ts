import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getmovie - Find Your Favorite Movies Faster",
  description: "Getmovie is your ultimate destination for finding movies online. Get quick access to movie details, ratings, and streaming information.",
  keywords: "Getmovie, movie search, find movies, movie database, streaming movies, movie ratings, latest movies, popular movies, movie recommendations, watch movies online",
  openGraph: {
    title: "Getmovie - Find Your Favorite Movies Faster",
    description: "Getmovie is your ultimate destination for finding movies online. Get quick access to movie details, ratings, and streaming information.",
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
    title: "Getmovie - Find Your Favorite Movies Faster",
    description: "Getmovie is your ultimate destination for finding movies online. Get quick access to movie details, ratings, and streaming information.",
    images: ["https://getmoviefast.netlify.app/images/logo/movie-logo.png"],
  },
};
