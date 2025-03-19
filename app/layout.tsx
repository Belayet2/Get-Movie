import { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import RootLayoutClient from "./components/RootLayoutClient";
import { Inter } from "next/font/google";
import ClickSpark from './animation/ClickSpark';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Getmovie",
  description:
    "Getmovie is a movie search engine that allows you to search where your favorite movie is streaming.",
  applicationName: "Getmovie",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
    other: {
      rel: "icon",
      url: "/favicon.ico"
    },
  },

  openGraph: {
    title: "Getmovie - Find Your Favorite Movies Faster",
    description:
      "A fast and user-friendly movie listing website with search recommendations.",
    url: "https://getmoviefast.netlify.app/",
    siteName: "Getmovie",
    images: [
      {
        url: "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
        width: 1200,
        height: 630,
        alt: "Getmovie Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Getmovie",
    description:
      "Find, Watch, and Enjoy the Best Movies with Get Movie!",
    images: [
      "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
    ],
  },
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="keywords" content="Getmovie, getmoviefast, movie search engine, find movies online, movie database, latest movies list, best movie recommendations, get movie details fast, online movie catalog, popular movies 2025, movie reviews and ratings, top-rated films, new movie releases, movie streaming sites list, where to watch [movie name] online, best sites to find movie details, fastest way to search for movies, top upcoming movies 2025, movie recommendation website" />
        {/* Google Search Console Verification Meta Tag */}
        <meta name="google-site-verification" content="8AQVBky567b4DPaI3mtffaJiXnr9iPZ3q9TxdCnEtfg" />
        {/* JSON-LD Structured Data for Google Rich Snippets */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Getmovie",
              "url": "https://getmoviefast.netlify.app/",
              "description":
                "A fast and user-friendly movie listing website with search recommendations.",
              "keywords": "Getmovie, getmoviefast, movie search engine, find movies online, movie database, latest movies list, best movie recommendations, get movie details fast, online movie catalog, popular movies 2025, movie reviews and ratings, top-rated films, new movie releases, movie streaming sites list, where to watch [movie name] online, best sites to find movie details, fastest way to search for movies, top upcoming movies 2025, movie recommendation website",
              "logo": "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
              "publisher": {
                "@type": "Organization",
                "name": "Getmovie",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClickSpark sparkColor='#3A1078' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
          <RootLayoutClient>{children}</RootLayoutClient>
        </ClickSpark>
      </body>
    </html>
  );
}