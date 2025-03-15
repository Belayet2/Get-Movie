import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutClient from "./components/RootLayoutClient";
import Script from "next/script";

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Getmovie - Get your favorite movies faster",
  description:
    "Getmovie is a movie search engine that allows you to find your favorite movies faster.",
  icons: {
    icon: "/images/logo/movie-logo.png",
    shortcut: "/images/logo/movie-logo.png",
    apple: "/images/logo/movie-logo.png",
    other: {
      rel: "icon",
      url: "/images/logo/movie-logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Resource hints for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />

        {/* Preload critical assets */}
        <link rel="preload" href="/images/logo/movie-logo.png" as="image" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>

        {/* Defer non-critical JavaScript */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />

        {/* Register service worker */}
        <Script src="/register-sw.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
