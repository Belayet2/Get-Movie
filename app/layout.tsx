import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutClient from "./components/RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

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
  other: {
    "Content-Security-Policy": {
      "http-equiv": "Content-Security-Policy",
      content:
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://netlify.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;",
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
      <body className={`${inter.className} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
